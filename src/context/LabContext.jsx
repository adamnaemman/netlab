import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { parseCommand, getPrompt, getHelpText } from '../logic/commandParser';
import { createInitialLabState, executeAction } from '../logic/networkState';
import { levels, getLevelById } from '../data/levels';
import { commandModes } from '../data/commands';

const LabContext = createContext(null);

// Action types
const ACTIONS = {
    LOAD_PROGRESS: 'LOAD_PROGRESS',
    EXECUTE_COMMAND: 'EXECUTE_COMMAND',
    SWITCH_DEVICE: 'SWITCH_DEVICE',
    SELECT_LEVEL: 'SELECT_LEVEL',
    START_LEVEL: 'START_LEVEL',
    COMPLETE_STEP: 'COMPLETE_STEP',
    COMPLETE_LEVEL: 'COMPLETE_LEVEL',
    LOSE_HEART: 'LOSE_HEART',
    RESET_HEARTS: 'RESET_HEARTS',
    ADD_XP: 'ADD_XP',
    UPDATE_STREAK: 'UPDATE_STREAK',
    TOGGLE_MODE: 'TOGGLE_MODE',
    CLEAR_TERMINAL: 'CLEAR_TERMINAL',
    RESET_LEVEL: 'RESET_LEVEL',
    GO_HOME: 'GO_HOME',
    ADD_OUTPUT: 'ADD_OUTPUT',
};

// Create initial state 
const createInitialState = () => {
    const labState = createInitialLabState();
    return {
        ...labState,
        // Game state
        xp: 0,
        hearts: 5,
        maxHearts: 5,
        streak: 0,
        lastActiveDate: null,

        // Level progress
        currentLevelId: null,
        currentStepIndex: 0,
        completedLevels: [],
        unlockedLevels: ['1-1'], // First level of first unit
        levelProgress: {}, // { levelId: { stepsCompleted: [], xpEarned: 0 } }

        // View state
        currentView: 'home', // 'home' or 'lab'

        // Session state
        sessionXP: 0,
        sessionMistakes: 0,

        // User tracking
        currentUserId: null,
    };
};

// Get storage key for user
const getStorageKey = (userId) => {
    return userId ? `netLabProgress_${userId}` : 'netLabProgress_guest';
};

// Load state from localStorage
const loadState = (userId) => {
    try {
        const key = getStorageKey(userId);
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            const fresh = createInitialState();

            // Check streak
            const today = new Date().toDateString();
            if (parsed.lastActiveDate) {
                const daysDiff = Math.floor(
                    (new Date(today) - new Date(parsed.lastActiveDate)) / (1000 * 60 * 60 * 24)
                );
                if (daysDiff > 1) {
                    parsed.streak = 0; // Streak broken
                }
            }

            return {
                ...fresh,
                xp: parsed.xp || 0,
                streak: parsed.streak || 0,
                lastActiveDate: today,
                completedLevels: parsed.completedLevels || [],
                unlockedLevels: parsed.unlockedLevels || ['1-1'],
                levelProgress: parsed.levelProgress || {},
                currentUserId: userId,
            };
        }
    } catch (e) {
        console.error('Failed to load progress:', e);
    }
    return { ...createInitialState(), currentUserId: userId };
};

// Save progress to localStorage
const saveProgress = (state) => {
    try {
        const key = getStorageKey(state.currentUserId);
        localStorage.setItem(key, JSON.stringify({
            xp: state.xp,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            completedLevels: state.completedLevels,
            unlockedLevels: state.unlockedLevels,
            levelProgress: state.levelProgress,
        }));
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
};

// Reducer
const labReducer = (state, action) => {
    let newState;

    switch (action.type) {
        case ACTIONS.LOAD_PROGRESS:
            return { ...state, ...action.payload };

        case ACTIONS.START_LEVEL: {
            const levelId = action.payload;
            const level = getLevelById(levelId);
            const labState = createInitialLabState();

            return {
                ...state,
                ...labState,
                currentLevelId: levelId,
                currentStepIndex: 0,
                currentView: 'lab',
                hearts: state.maxHearts,
                sessionXP: 0,
                sessionMistakes: 0,
                currentDevice: level.steps[0]?.device || 'router',
            };
        }

        case ACTIONS.EXECUTE_COMMAND: {
            const { command, result, output, isError } = action.payload;

            newState = {
                ...state,
                devices: result.newDevices,
                commandHistory: [...state.commandHistory, command],
                outputHistory: [
                    ...state.outputHistory,
                    { type: 'command', content: command, prompt: action.payload.prompt },
                    ...(output ? [{ type: isError ? 'error' : 'output', content: output }] : []),
                ],
            };
            break;
        }

        case ACTIONS.COMPLETE_STEP: {
            const { stepIndex, xpEarned } = action.payload;
            const level = getLevelById(state.currentLevelId);
            const nextStep = level?.steps[stepIndex + 1];

            // Update level progress
            const levelProgress = {
                ...state.levelProgress,
                [state.currentLevelId]: {
                    stepsCompleted: [...(state.levelProgress[state.currentLevelId]?.stepsCompleted || []), stepIndex],
                    xpEarned: (state.levelProgress[state.currentLevelId]?.xpEarned || 0) + xpEarned,
                },
            };

            newState = {
                ...state,
                currentStepIndex: stepIndex + 1,
                xp: state.xp + xpEarned,
                sessionXP: state.sessionXP + xpEarned,
                levelProgress,
                outputHistory: [
                    ...state.outputHistory,
                    { type: 'success', content: `✓ +${xpEarned} XP - ${level.steps[stepIndex].description}` },
                ],
                // Auto-switch device if next step requires different device
                currentDevice: nextStep?.device || state.currentDevice,
            };
            break;
        }

        case ACTIONS.COMPLETE_LEVEL: {
            const { levelId } = action.payload;
            // Calculate next level ID (e.g., '1-1' -> '1-2', '1-10' -> '2-1')
            const [unitId, levelNum] = levelId.split('-').map(Number);
            const nextLevelId = levelNum < 10 ? `${unitId}-${levelNum + 1}` : `${unitId + 1}-1`;

            newState = {
                ...state,
                completedLevels: [...new Set([...state.completedLevels, levelId])],
                unlockedLevels: [...new Set([...state.unlockedLevels, nextLevelId])],
                currentView: 'celebration',
            };
            break;
        }

        case ACTIONS.LOSE_HEART:
            newState = {
                ...state,
                hearts: Math.max(0, state.hearts - 1),
                sessionMistakes: state.sessionMistakes + 1,
            };
            break;

        case ACTIONS.RESET_HEARTS:
            newState = {
                ...state,
                hearts: state.maxHearts,
            };
            break;

        case ACTIONS.ADD_XP:
            newState = {
                ...state,
                xp: state.xp + action.payload,
                sessionXP: state.sessionXP + action.payload,
            };
            break;

        case ACTIONS.UPDATE_STREAK: {
            const today = new Date().toDateString();
            if (state.lastActiveDate !== today) {
                newState = {
                    ...state,
                    streak: state.streak + 1,
                    lastActiveDate: today,
                };
            } else {
                return state;
            }
            break;
        }

        case ACTIONS.SWITCH_DEVICE: {
            const device = state.devices[action.payload];
            newState = {
                ...state,
                currentDevice: action.payload,
                outputHistory: [
                    ...state.outputHistory,
                    { type: 'info', content: `\n--- Switched to ${device.hostname} ---\n` },
                ],
            };
            break;
        }

        case ACTIONS.TOGGLE_MODE:
            newState = {
                ...state,
                isGuidedMode: !state.isGuidedMode,
            };
            break;

        case ACTIONS.CLEAR_TERMINAL:
            newState = {
                ...state,
                outputHistory: [],
            };
            break;

        case ACTIONS.RESET_LEVEL: {
            const labState = createInitialLabState();
            const level = getLevelById(state.currentLevelId);

            newState = {
                ...state,
                ...labState,
                currentStepIndex: 0,
                hearts: state.maxHearts,
                sessionXP: 0,
                sessionMistakes: 0,
                currentDevice: level?.steps[0]?.device || 'router',
            };
            break;
        }

        case ACTIONS.GO_HOME:
            newState = {
                ...state,
                currentView: 'home',
                currentLevelId: null,
            };
            break;

        case ACTIONS.ADD_OUTPUT:
            newState = {
                ...state,
                outputHistory: [...state.outputHistory, action.payload],
            };
            break;

        default:
            return state;
    }

    // Save progress after state changes
    saveProgress(newState);
    return newState;
};

// Provider
export const LabProvider = ({ children, userId }) => {
    const [state, dispatch] = useReducer(labReducer, userId, (uid) => loadState(uid));

    // Reload progress when user changes
    useEffect(() => {
        const newState = loadState(userId);
        dispatch({ type: ACTIONS.LOAD_PROGRESS, payload: newState });
    }, [userId]);

    // Update streak on mount
    useEffect(() => {
        dispatch({ type: ACTIONS.UPDATE_STREAK });
    }, []);

    // Get current level and step
    const currentLevel = state.currentLevelId ? getLevelById(state.currentLevelId) : null;
    const currentStep = currentLevel?.steps[state.currentStepIndex] || null;

    // Execute command and check if it matches current step
    const executeCommand = useCallback((input) => {
        const device = state.devices[state.currentDevice];
        const prompt = getPrompt(device.hostname, device.mode);
        const trimmedInput = input.trim().toLowerCase();

        // Parse the command
        const parseResult = parseCommand(input, device.mode);

        if (!parseResult.success) {
            dispatch({
                type: ACTIONS.ADD_OUTPUT,
                payload: { type: 'command', content: input, prompt },
            });
            dispatch({
                type: ACTIONS.ADD_OUTPUT,
                payload: { type: 'error', content: parseResult.error },
            });
            dispatch({ type: ACTIONS.LOSE_HEART });
            return;
        }

        // Handle help command
        if (parseResult.action === 'showHelp') {
            dispatch({
                type: ACTIONS.ADD_OUTPUT,
                payload: { type: 'command', content: input, prompt },
            });
            dispatch({
                type: ACTIONS.ADD_OUTPUT,
                payload: { type: 'output', content: getHelpText(device.mode) },
            });
            return;
        }

        // Check if this matches the current step
        let matchesStep = false;
        if (currentStep) {
            const expectedCmd = currentStep.command.toLowerCase();
            const alternates = (currentStep.alternateCommands || []).map(c => c.toLowerCase());
            matchesStep = trimmedInput === expectedCmd || alternates.includes(trimmedInput);
        }

        // Execute the action
        const result = executeAction(
            state,
            parseResult.action,
            { ...parseResult.params, targetMode: parseResult.targetMode }
        );

        dispatch({
            type: ACTIONS.EXECUTE_COMMAND,
            payload: {
                command: input,
                result,
                output: result.output,
                isError: result.isError,
                prompt,
            },
        });

        // If command matches step, complete it
        if (matchesStep && currentStep) {
            dispatch({
                type: ACTIONS.COMPLETE_STEP,
                payload: {
                    stepIndex: state.currentStepIndex,
                    xpEarned: currentStep.xp,
                },
            });

            // Check if level is complete
            if (state.currentStepIndex + 1 >= currentLevel.steps.length) {
                setTimeout(() => {
                    dispatch({
                        type: ACTIONS.COMPLETE_LEVEL,
                        payload: {
                            levelId: state.currentLevelId,
                            totalXP: state.sessionXP + currentStep.xp,
                        },
                    });
                }, 1000);
            }
        } else if (currentStep && !matchesStep && !parseResult.action.startsWith('show')) {
            // Wrong command for current step (but not a show command)
            dispatch({
                type: ACTIONS.ADD_OUTPUT,
                payload: {
                    type: 'warning',
                    content: `💡 Hint: ${currentStep.hint}`
                },
            });
        }
    }, [state, currentLevel, currentStep]);

    // Actions
    const startLevel = useCallback((levelId) => {
        dispatch({ type: ACTIONS.START_LEVEL, payload: levelId });
    }, []);

    const switchDevice = useCallback((deviceName) => {
        dispatch({ type: ACTIONS.SWITCH_DEVICE, payload: deviceName });
    }, []);

    const toggleMode = useCallback(() => {
        dispatch({ type: ACTIONS.TOGGLE_MODE });
    }, []);

    const clearTerminal = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_TERMINAL });
    }, []);

    const resetLevel = useCallback(() => {
        dispatch({ type: ACTIONS.RESET_LEVEL });
    }, []);

    const goHome = useCallback(() => {
        dispatch({ type: ACTIONS.GO_HOME });
    }, []);

    const resetHearts = useCallback(() => {
        dispatch({ type: ACTIONS.RESET_HEARTS });
    }, []);

    // Computed values
    const currentDevice = state.devices[state.currentDevice];
    const currentPrompt = currentDevice ? getPrompt(currentDevice.hostname, currentDevice.mode) : '>';
    const isLevelComplete = (levelId) => state.completedLevels.includes(levelId);
    const isLevelUnlocked = (levelId) => state.unlockedLevels.includes(levelId);
    const levelProgress = currentLevel ?
        ((state.currentStepIndex) / currentLevel.steps.length) * 100 : 0;

    const value = {
        state,
        currentDevice,
        currentPrompt,
        currentLevel,
        currentStep,
        levelProgress,
        isLevelComplete,
        isLevelUnlocked,
        executeCommand,
        startLevel,
        switchDevice,
        toggleMode,
        clearTerminal,
        resetLevel,
        goHome,
        resetHearts,
    };

    return (
        <LabContext.Provider value={value}>
            {children}
        </LabContext.Provider>
    );
};

// Hook
export const useLab = () => {
    const context = useContext(LabContext);
    if (!context) {
        throw new Error('useLab must be used within a LabProvider');
    }
    return context;
};

export default LabContext;
