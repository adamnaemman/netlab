import { commandPatterns, commandModes, modePrompts, getAvailableCommands } from '../data/commands';

/**
 * Parse a command string and return the matching command pattern and extracted parameters
 */
export const parseCommand = (input, currentMode) => {
    const trimmedInput = input.trim().toLowerCase();

    if (!trimmedInput) {
        return { success: false, error: 'No command entered' };
    }

    // Check for subinterface pattern (e.g., g0/0.10)
    const subinterfaceMatch = trimmedInput.match(/^int(?:erface)?\s+((?:g(?:igabit)?(?:e(?:thernet)?)?|f(?:ast)?(?:e(?:thernet)?)?)\s*[\d]+\/[\d]+\.[\d]+)$/i);
    if (subinterfaceMatch) {
        if (currentMode !== commandModes.CONFIG) {
            return { success: false, error: `Command not available in current mode` };
        }
        return {
            success: true,
            action: 'selectSubinterface',
            params: { interface: normalizeInterface(subinterfaceMatch[1]) },
        };
    }

    for (const [cmdName, cmdDef] of Object.entries(commandPatterns)) {
        const match = trimmedInput.match(cmdDef.pattern);

        if (match) {
            // Check if command is valid in current mode
            if (cmdDef.validModes !== 'all' && !cmdDef.validModes.includes(currentMode)) {
                return {
                    success: false,
                    error: `Command '${trimmedInput}' not available in current mode`,
                    suggestion: getSuggestion(currentMode, cmdName),
                };
            }

            // Extract parameters based on command type
            const params = extractParams(cmdName, match);

            return {
                success: true,
                command: cmdName,
                action: cmdDef.action,
                targetMode: cmdDef.targetMode,
                params,
            };
        }
    }

    return {
        success: false,
        error: `Unknown command: '${trimmedInput}'`,
        suggestion: 'Type ? for available commands',
    };
};

/**
 * Extract parameters from regex match groups
 */
const extractParams = (cmdName, match) => {
    const params = {};

    switch (cmdName) {
        case 'hostname':
            params.hostname = match[1];
            break;
        case 'interface':
            params.interface = normalizeInterface(match[1]);
            break;
        case 'ipAddress':
            params.ip = match[1];
            params.mask = match[2];
            break;
        case 'vlan':
            params.vlanId = parseInt(match[1], 10);
            break;
        case 'vlanName':
            params.name = match[1];
            break;
        case 'switchportMode':
            params.mode = match[1].toLowerCase();
            break;
        case 'switchportAccessVlan':
            params.vlanId = parseInt(match[1], 10);
            break;
        case 'encapsulation':
            params.vlanId = parseInt(match[1], 10);
            break;
        default:
            break;
    }

    return params;
};

/**
 * Normalize interface names to a consistent format
 */
export const normalizeInterface = (interfaceStr) => {
    const normalized = interfaceStr.toLowerCase().replace(/\s+/g, '');

    // Handle various interface formats
    if (normalized.match(/^g/)) {
        return normalized.replace(/^g(?:igabit)?e(?:thernet)?/, 'GigabitEthernet');
    }
    if (normalized.match(/^f/)) {
        return normalized.replace(/^f(?:ast)?e(?:thernet)?/, 'FastEthernet');
    }
    if (normalized.match(/^vlan/)) {
        return normalized.replace(/^vlan/, 'Vlan');
    }

    return interfaceStr;
};

/**
 * Get suggestion for incorrect mode
 */
const getSuggestion = (currentMode, attemptedCommand) => {
    const cmdDef = commandPatterns[attemptedCommand];
    if (!cmdDef || cmdDef.validModes === 'all') return null;

    const targetMode = cmdDef.validModes[0];

    switch (targetMode) {
        case commandModes.PRIVILEGED:
            return "First enter privileged mode with 'enable'";
        case commandModes.CONFIG:
            return "First enter config mode with 'conf t'";
        case commandModes.INTERFACE:
            return "First select an interface with 'interface <name>'";
        default:
            return null;
    }
};

/**
 * Get the prompt string for the current mode
 */
export const getPrompt = (hostname, mode) => {
    return `${hostname}${modePrompts[mode] || '>'}`;
};

/**
 * Get help text for current mode
 */
export const getHelpText = (currentMode) => {
    const commands = getAvailableCommands(currentMode);
    const lines = ['Available commands:', ''];

    commands.forEach(cmd => {
        const example = getCommandExample(cmd.name);
        lines.push(`  ${example.padEnd(30)} - ${cmd.description}`);
    });

    return lines.join('\n');
};

/**
 * Get example usage for a command
 */
const getCommandExample = (cmdName) => {
    const examples = {
        enable: 'enable',
        disable: 'disable',
        configTerminal: 'configure terminal',
        exit: 'exit',
        end: 'end',
        hostname: 'hostname <name>',
        interface: 'interface <type><number>',
        ipAddress: 'ip address <ip> <mask>',
        noShutdown: 'no shutdown',
        shutdown: 'shutdown',
        vlan: 'vlan <id>',
        vlanName: 'name <vlan-name>',
        switchportMode: 'switchport mode <access|trunk>',
        switchportAccessVlan: 'switchport access vlan <id>',
        encapsulation: 'encapsulation dot1q <vlan-id>',
        showRunning: 'show running-config',
        showIpRoute: 'show ip route',
        showVlan: 'show vlan brief',
        showInterfaces: 'show ip interface brief',
        help: '?',
    };

    return examples[cmdName] || cmdName;
};
