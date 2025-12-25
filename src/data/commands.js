// Command patterns and definitions for the CLI parser
export const commandModes = {
    USER: 'user',
    PRIVILEGED: 'privileged',
    CONFIG: 'config',
    INTERFACE: 'interface',
    VLAN: 'vlan',
    SUBINTERFACE: 'subinterface',
};

export const modePrompts = {
    [commandModes.USER]: '>',
    [commandModes.PRIVILEGED]: '#',
    [commandModes.CONFIG]: '(config)#',
    [commandModes.INTERFACE]: '(config-if)#',
    [commandModes.VLAN]: '(config-vlan)#',
    [commandModes.SUBINTERFACE]: '(config-subif)#',
};

export const commandPatterns = {
    // Mode transition commands
    enable: {
        pattern: /^enable$/i,
        validModes: [commandModes.USER],
        action: 'changeMode',
        targetMode: commandModes.PRIVILEGED,
        description: 'Enter privileged EXEC mode',
    },
    disable: {
        pattern: /^disable$/i,
        validModes: [commandModes.PRIVILEGED, commandModes.CONFIG],
        action: 'changeMode',
        targetMode: commandModes.USER,
        description: 'Return to user EXEC mode',
    },
    configTerminal: {
        pattern: /^conf(?:igure)?(?:\s+t(?:erminal)?)?$/i,
        validModes: [commandModes.PRIVILEGED],
        action: 'changeMode',
        targetMode: commandModes.CONFIG,
        description: 'Enter global configuration mode',
    },
    exit: {
        pattern: /^exit$/i,
        validModes: 'all',
        action: 'exitMode',
        description: 'Exit current mode',
    },
    end: {
        pattern: /^end$/i,
        validModes: [commandModes.CONFIG, commandModes.INTERFACE, commandModes.VLAN, commandModes.SUBINTERFACE],
        action: 'changeMode',
        targetMode: commandModes.PRIVILEGED,
        description: 'Return to privileged EXEC mode',
    },

    // Configuration commands
    hostname: {
        pattern: /^hostname\s+(\S+)$/i,
        validModes: [commandModes.CONFIG],
        action: 'setHostname',
        description: 'Set device hostname',
    },
    interface: {
        pattern: /^int(?:erface)?\s+((?:g(?:igabit)?(?:e(?:thernet)?)?|f(?:ast)?(?:e(?:thernet)?)?|vlan)\s*[\d\/]+)$/i,
        validModes: [commandModes.CONFIG, commandModes.VLAN, commandModes.INTERFACE],
        action: 'selectInterface',
        description: 'Enter interface configuration mode',
    },
    ipAddress: {
        pattern: /^ip\s+add(?:ress)?\s+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i,
        validModes: [commandModes.INTERFACE, commandModes.SUBINTERFACE],
        action: 'setIpAddress',
        description: 'Assign IP address to interface',
    },
    noShutdown: {
        pattern: /^no\s+shut(?:down)?$/i,
        validModes: [commandModes.INTERFACE, commandModes.SUBINTERFACE],
        action: 'enableInterface',
        description: 'Enable interface',
    },
    shutdown: {
        pattern: /^shut(?:down)?$/i,
        validModes: [commandModes.INTERFACE, commandModes.SUBINTERFACE],
        action: 'disableInterface',
        description: 'Disable interface',
    },

    // VLAN commands
    vlan: {
        pattern: /^vlan\s+(\d+)$/i,
        validModes: [commandModes.CONFIG, commandModes.VLAN],
        action: 'createVlan',
        description: 'Create or enter VLAN configuration mode',
    },
    vlanName: {
        pattern: /^name\s+(.+)$/i,
        validModes: [commandModes.VLAN],
        action: 'setVlanName',
        description: 'Set VLAN name',
    },
    switchportMode: {
        pattern: /^switchport\s+mode\s+(access|trunk)$/i,
        validModes: [commandModes.INTERFACE],
        action: 'setSwitchportMode',
        description: 'Set switchport mode',
    },
    switchportAccessVlan: {
        pattern: /^switchport\s+access\s+vlan\s+(\d+)$/i,
        validModes: [commandModes.INTERFACE],
        action: 'setAccessVlan',
        description: 'Assign port to VLAN',
    },

    // Inter-VLAN Routing commands
    encapsulation: {
        pattern: /^encapsulation\s+dot1q\s+(\d+)$/i,
        validModes: [commandModes.SUBINTERFACE],
        action: 'setEncapsulation',
        description: 'Set 802.1Q encapsulation for subinterface',
    },

    // Show commands
    showRunning: {
        pattern: /^show\s+run(?:ning)?(?:-config)?$/i,
        validModes: [commandModes.PRIVILEGED, commandModes.CONFIG],
        action: 'showRunning',
        description: 'Display running configuration',
    },
    showIpRoute: {
        pattern: /^show\s+ip\s+route$/i,
        validModes: [commandModes.PRIVILEGED, commandModes.CONFIG],
        action: 'showIpRoute',
        description: 'Display IP routing table',
    },
    showVlan: {
        pattern: /^show\s+vlan(?:\s+brief)?$/i,
        validModes: [commandModes.PRIVILEGED, commandModes.CONFIG],
        action: 'showVlan',
        description: 'Display VLAN information',
    },
    showInterfaces: {
        pattern: /^show\s+ip\s+int(?:erface)?\s+brief$/i,
        validModes: [commandModes.PRIVILEGED, commandModes.CONFIG],
        action: 'showInterfaces',
        description: 'Display interface status',
    },

    // Help
    help: {
        pattern: /^\?$/,
        validModes: 'all',
        action: 'showHelp',
        description: 'Display available commands',
    },
};

export const getAvailableCommands = (mode) => {
    return Object.entries(commandPatterns)
        .filter(([_, cmd]) => cmd.validModes === 'all' || cmd.validModes.includes(mode))
        .map(([name, cmd]) => ({ name, ...cmd }));
};
