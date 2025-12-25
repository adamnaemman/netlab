import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { getUserLevel, getXPForNextLevel } from '../data/achievements';

const GameContext = createContext(null);

// Action types
const ACTIONS = {
    LOAD_PROGRESS: 'LOAD_PROGRESS',
    ADD_XP: 'ADD_XP',
    LOSE_HEART: 'LOSE_HEART',
    RESTORE_HEARTS: 'RESTORE_HEARTS',
    COMPLETE_LESSON: 'COMPLETE_LESSON',
    COMPLETE_EXERCISE: 'COMPLETE_EXERCISE',
    SET_CURRENT_LESSON: 'SET_CURRENT_LESSON',
    UPDATE_STREAK: 'UPDATE_STREAK',
    UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
    SET_VIEW: 'SET_VIEW',
    RESET_LESSON_PROGRESS: 'RESET_LESSON_PROGRESS',
};

// Initial state
const createInitialState = () => ({
    // User progress
    xp: 0,
    hearts: 5,
    maxHearts: 5,
    streak: 0,
    lastActiveDate: null,

    // Learning progress
    completedLessons: [],
    lessonProgress: {}, // { lessonId: { exerciseIndex, mistakes } }
    unlockedUnits: [1], // Unit IDs that are unlocked

    // Current session
    currentView: 'home', // 'home', 'lesson', 'profile'
    currentLessonId: null,
    currentExerciseIndex: 0,
    sessionMistakes: 0,
    sessionXP: 0,

    // Achievements
    unlockedAchievements: [],

    // Stats
    totalCommandsTyped: 0,
    perfectLessons: 0,
    dailyXP: 0,
    dailyGoal: 20,
});

// Load state from localStorage
const loadState = () => {
    try {
        const saved = localStorage.getItem('networkLabProgress');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Check streak
            const today = new Date().toDateString();
            const lastActive = parsed.lastActiveDate;

            if (lastActive) {
                const lastDate = new Date(lastActive);
                const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

                if (daysDiff > 1) {
                    // Streak broken
                    parsed.streak = 0;
                } else if (daysDiff === 1) {
                    // Continue streak
                    parsed.dailyXP = 0;
                }
            }

            return { ...createInitialState(), ...parsed, lastActiveDate: today };
        }
    } catch (e) {
        console.error('Failed to load progress:', e);
    }
    return createInitialState();
};

// Reducer
const gameReducer = (state, action) => {
    let newState;

    switch (action.type) {
        case ACTIONS.LOAD_PROGRESS:
            return { ...state, ...action.payload };

        case ACTIONS.ADD_XP:
            newState = {
                ...state,
                xp: state.xp + action.payload,
                sessionXP: state.sessionXP + action.payload,
                dailyXP: state.dailyXP + action.payload,
            };
            break;

        case ACTIONS.LOSE_HEART:
            newState = {
                ...state,
                hearts: Math.max(0, state.hearts - 1),
                sessionMistakes: state.sessionMistakes + 1,
            };
            break;

        case ACTIONS.RESTORE_HEARTS:
            newState = {
                ...state,
                hearts: state.maxHearts,
            };
            break;

        case ACTIONS.COMPLETE_LESSON: {
            const { lessonId, xpEarned, isPerfect } = action.payload;
            const completedLessons = state.completedLessons.includes(lessonId)
                ? state.completedLessons
                : [...state.completedLessons, lessonId];

            // Unlock next unit if needed
            const unitId = parseInt(lessonId.split('-')[0]);
            const nextUnitId = unitId + 1;
            const unlockedUnits = state.unlockedUnits.includes(nextUnitId)
                ? state.unlockedUnits
                : [...state.unlockedUnits, nextUnitId];

            newState = {
                ...state,
                completedLessons,
                unlockedUnits,
                xp: state.xp + xpEarned,
                sessionXP: state.sessionXP + xpEarned,
                dailyXP: state.dailyXP + xpEarned,
                perfectLessons: isPerfect ? state.perfectLessons + 1 : state.perfectLessons,
                currentView: 'home',
                currentLessonId: null,
                currentExerciseIndex: 0,
                sessionMistakes: 0,
            };
            break;
        }

        case ACTIONS.COMPLETE_EXERCISE:
            newState = {
                ...state,
                currentExerciseIndex: state.currentExerciseIndex + 1,
                lessonProgress: {
                    ...state.lessonProgress,
                    [state.currentLessonId]: {
                        exerciseIndex: state.currentExerciseIndex + 1,
                        mistakes: state.sessionMistakes,
                    },
                },
            };
            break;

        case ACTIONS.SET_CURRENT_LESSON:
            newState = {
                ...state,
                currentLessonId: action.payload,
                currentExerciseIndex: 0,
                sessionMistakes: 0,
                sessionXP: 0,
                currentView: 'lesson',
            };
            break;

        case ACTIONS.UPDATE_STREAK: {
            const today = new Date().toDateString();
            if (state.lastActiveDate !== today) {
                newState = {
                    ...state,
                    streak: state.streak + 1,
                    lastActiveDate: today,
                    dailyXP: 0,
                };
            } else {
                newState = state;
            }
            break;
        }

        case ACTIONS.UNLOCK_ACHIEVEMENT:
            if (state.unlockedAchievements.includes(action.payload)) {
                return state;
            }
            newState = {
                ...state,
                unlockedAchievements: [...state.unlockedAchievements, action.payload],
            };
            break;

        case ACTIONS.SET_VIEW:
            newState = {
                ...state,
                currentView: action.payload,
            };
            break;

        case ACTIONS.RESET_LESSON_PROGRESS:
            newState = {
                ...state,
                currentExerciseIndex: 0,
                sessionMistakes: 0,
                sessionXP: 0,
                hearts: state.maxHearts,
            };
            break;

        default:
            return state;
    }

    // Save to localStorage
    try {
        const toSave = {
            xp: newState.xp,
            hearts: newState.hearts,
            streak: newState.streak,
            lastActiveDate: newState.lastActiveDate,
            completedLessons: newState.completedLessons,
            unlockedUnits: newState.unlockedUnits,
            unlockedAchievements: newState.unlockedAchievements,
            totalCommandsTyped: newState.totalCommandsTyped,
            perfectLessons: newState.perfectLessons,
            dailyXP: newState.dailyXP,
            dailyGoal: newState.dailyGoal,
        };
        localStorage.setItem('networkLabProgress', JSON.stringify(toSave));
    } catch (e) {
        console.error('Failed to save progress:', e);
    }

    return newState;
};

// Provider
export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, null, loadState);

    // Update streak on mount
    useEffect(() => {
        dispatch({ type: ACTIONS.UPDATE_STREAK });
    }, []);

    // Actions
    const addXP = useCallback((amount) => {
        dispatch({ type: ACTIONS.ADD_XP, payload: amount });
    }, []);

    const loseHeart = useCallback(() => {
        dispatch({ type: ACTIONS.LOSE_HEART });
    }, []);

    const restoreHearts = useCallback(() => {
        dispatch({ type: ACTIONS.RESTORE_HEARTS });
    }, []);

    const completeLesson = useCallback((lessonId, xpEarned, isPerfect) => {
        dispatch({
            type: ACTIONS.COMPLETE_LESSON,
            payload: { lessonId, xpEarned, isPerfect },
        });
    }, []);

    const completeExercise = useCallback(() => {
        dispatch({ type: ACTIONS.COMPLETE_EXERCISE });
    }, []);

    const startLesson = useCallback((lessonId) => {
        dispatch({ type: ACTIONS.SET_CURRENT_LESSON, payload: lessonId });
    }, []);

    const setView = useCallback((view) => {
        dispatch({ type: ACTIONS.SET_VIEW, payload: view });
    }, []);

    const resetLessonProgress = useCallback(() => {
        dispatch({ type: ACTIONS.RESET_LESSON_PROGRESS });
    }, []);

    const unlockAchievement = useCallback((achievementId) => {
        dispatch({ type: ACTIONS.UNLOCK_ACHIEVEMENT, payload: achievementId });
    }, []);

    // Computed values
    const userLevel = getUserLevel(state.xp);
    const nextLevelProgress = getXPForNextLevel(state.xp);
    const isLessonCompleted = (lessonId) => state.completedLessons.includes(lessonId);
    const isUnitUnlocked = (unitId) => state.unlockedUnits.includes(unitId);

    const value = {
        state,
        userLevel,
        nextLevelProgress,
        isLessonCompleted,
        isUnitUnlocked,
        addXP,
        loseHeart,
        restoreHearts,
        completeLesson,
        completeExercise,
        startLesson,
        setView,
        resetLessonProgress,
        unlockAchievement,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

// Hook
export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

export default GameContext;
