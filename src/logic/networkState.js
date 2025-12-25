import { commandModes } from '../data/commands';
import { levels } from '../data/levels';

/**
 * Initial state for a network device
 */
export const createDeviceState = (type, name) => ({
    type, // 'router' or 'switch'
    hostname: name,
    mode: commandModes.USER,
    currentInterface: null,
    currentVlan: null,
    interfaces: {},
    vlans: {},
    routes: [],
});

/**
 * Initial state for the lab
 */
export const createInitialLabState = () => ({
    currentDevice: 'router',
    currentLevel: 1,
    completedObjectives: [],
    totalProgress: 0,
    isGuidedMode: true,
    devices: {
        router: createDeviceState('router', 'Router'),
        switch: createDeviceState('switch', 'Switch'),
    },
    commandHistory: [],
    outputHistory: [],
});

/**
 * Calculate progress based on completed objectives for current level
 */
export const calculateProgress = (state) => {
    const level = levels.find(l => l.id === state.currentLevel);
    if (!level) return 0;

    const completedPoints = level.objectives
        .filter(obj => state.completedObjectives.includes(obj.id))
        .reduce((sum, obj) => sum + obj.points, 0);

    const totalPoints = level.objectives.reduce((sum, obj) => sum + obj.points, 0);

    return Math.round((completedPoints / totalPoints) * 100);
};

/**
 * Check if an objective is completed based on current state
 */
export const checkObjectiveCompletion = (state, objectiveId) => {
    const device = state.devices[state.currentDevice];

    switch (objectiveId) {
        case 'hostname':
            return device.type === 'router' && device.hostname === 'R1';
        case 'switch-hostname':
            return state.devices.switch.hostname === 'SW1';
        case 'router-ip': {
            const intf = device.interfaces['GigabitEthernet0/0'];
            return intf?.ip === '192.168.1.1' && intf?.enabled;
        }
        case 'switch-ip': {
            const vlanIntf = state.devices.switch.interfaces['Vlan1'];
            return vlanIntf?.ip === '192.168.1.2' && vlanIntf?.enabled;
        }
        case 'vlan10':
            return state.devices.switch.vlans[10]?.name === 'Sales';
        case 'vlan20':
            return state.devices.switch.vlans[20]?.name === 'Engineering';
        case 'assign-port-vlan10': {
            const port = state.devices.switch.interfaces['FastEthernet0/1'];
            return port?.mode === 'access' && port?.accessVlan === 10;
        }
        case 'assign-port-vlan20': {
            const port = state.devices.switch.interfaces['FastEthernet0/2'];
            return port?.mode === 'access' && port?.accessVlan === 20;
        }
        case 'trunk-port': {
            const port = state.devices.switch.interfaces['GigabitEthernet0/1'];
            return port?.mode === 'trunk';
        }
        case 'subint-vlan10': {
            const subint = state.devices.router.interfaces['GigabitEthernet0/0.10'];
            return subint?.encapsulation === 10 && subint?.ip === '192.168.10.1';
        }
        case 'subint-vlan20': {
            const subint = state.devices.router.interfaces['GigabitEthernet0/0.20'];
            return subint?.encapsulation === 20 && subint?.ip === '192.168.20.1';
        }
        case 'enable-routing': {
            const intf = state.devices.router.interfaces['GigabitEthernet0/0'];
            return intf?.enabled;
        }
        default:
            return false;
    }
};

/**
 * Get newly completed objectives after a state change
 */
export const getNewlyCompletedObjectives = (prevState, newState) => {
    const level = levels.find(l => l.id === newState.currentLevel);
    if (!level) return [];

    return level.objectives
        .filter(obj =>
            !prevState.completedObjectives.includes(obj.id) &&
            checkObjectiveCompletion(newState, obj.id)
        )
        .map(obj => obj.id);
};

/**
 * Execute a command action and return the new state
 */
export const executeAction = (state, action, params) => {
    const device = state.devices[state.currentDevice];
    let newDevice = { ...device };
    let output = '';
    let isError = false;

    switch (action) {
        case 'changeMode':
            newDevice.mode = params.targetMode;
            newDevice.currentInterface = null;
            newDevice.currentVlan = null;
            break;

        case 'exitMode':
            switch (device.mode) {
                case commandModes.USER:
                    output = 'Already at user mode';
                    break;
                case commandModes.PRIVILEGED:
                    newDevice.mode = commandModes.USER;
                    break;
                case commandModes.CONFIG:
                    newDevice.mode = commandModes.PRIVILEGED;
                    break;
                case commandModes.INTERFACE:
                case commandModes.SUBINTERFACE:
                    newDevice.mode = commandModes.CONFIG;
                    newDevice.currentInterface = null;
                    break;
                case commandModes.VLAN:
                    newDevice.mode = commandModes.CONFIG;
                    newDevice.currentVlan = null;
                    break;
                default:
                    newDevice.mode = commandModes.PRIVILEGED;
            }
            break;

        case 'setHostname':
            newDevice.hostname = params.hostname;
            break;

        case 'selectInterface':
            newDevice.mode = commandModes.INTERFACE;
            newDevice.currentInterface = params.interface;
            // Initialize interface if it doesn't exist
            if (!newDevice.interfaces[params.interface]) {
                newDevice.interfaces = {
                    ...newDevice.interfaces,
                    [params.interface]: { enabled: false, ip: null, mask: null, mode: null, accessVlan: null },
                };
            }
            break;

        case 'selectSubinterface':
            newDevice.mode = commandModes.SUBINTERFACE;
            newDevice.currentInterface = params.interface;
            if (!newDevice.interfaces[params.interface]) {
                newDevice.interfaces = {
                    ...newDevice.interfaces,
                    [params.interface]: { enabled: false, ip: null, mask: null, encapsulation: null },
                };
            }
            break;

        case 'setIpAddress':
            if (!device.currentInterface) {
                output = '% No interface selected';
                isError = true;
            } else {
                newDevice.interfaces = {
                    ...newDevice.interfaces,
                    [device.currentInterface]: {
                        ...newDevice.interfaces[device.currentInterface],
                        ip: params.ip,
                        mask: params.mask,
                    },
                };
            }
            break;

        case 'enableInterface':
            if (!device.currentInterface) {
                output = '% No interface selected';
                isError = true;
            } else {
                newDevice.interfaces = {
                    ...newDevice.interfaces,
                    [device.currentInterface]: {
                        ...newDevice.interfaces[device.currentInterface],
                        enabled: true,
                    },
                };
            }
            break;

        case 'disableInterface':
            if (!device.currentInterface) {
                output = '% No interface selected';
                isError = true;
            } else {
                newDevice.interfaces = {
                    ...newDevice.interfaces,
                    [device.currentInterface]: {
                        ...newDevice.interfaces[device.currentInterface],
                        enabled: false,
                    },
                };
            }
            break;

        case 'createVlan':
            newDevice.mode = commandModes.VLAN;
            newDevice.currentVlan = params.vlanId;
            if (!newDevice.vlans[params.vlanId]) {
                newDevice.vlans = {
                    ...newDevice.vlans,
                    [params.vlanId]: { id: params.vlanId, name: `VLAN${params.vlanId}` },
                };
            }
            break;

        case 'setVlanName':
            if (device.currentVlan) {
                newDevice.vlans = {
                    ...newDevice.vlans,
                    [device.currentVlan]: {
                        ...newDevice.vlans[device.currentVlan],
                        name: params.name,
                    },
                };
            }
            break;

        case 'setSwitchportMode':
            if (!device.currentInterface) {
                output = '% No interface selected';
                isError = true;
            } else {
                newDevice.interfaces = {
                    ...newDevice.interfaces,
                    [device.currentInterface]: {
                        ...newDevice.interfaces[device.currentInterface],
                        mode: params.mode,
                    },
                };
            }
            break;

        case 'setAccessVlan':
            if (!device.currentInterface) {
                output = '% No interface selected';
                isError = true;
            } else {
                newDevice.interfaces = {
                    ...newDevice.interfaces,
                    [device.currentInterface]: {
                        ...newDevice.interfaces[device.currentInterface],
                        accessVlan: params.vlanId,
                    },
                };
            }
            break;

        case 'setEncapsulation':
            if (!device.currentInterface) {
                output = '% No interface selected';
                isError = true;
            } else {
                newDevice.interfaces = {
                    ...newDevice.interfaces,
                    [device.currentInterface]: {
                        ...newDevice.interfaces[device.currentInterface],
                        encapsulation: params.vlanId,
                    },
                };
            }
            break;

        case 'showRunning':
            output = generateRunningConfig(device);
            break;

        case 'showIpRoute':
            output = generateRoutingTable(newDevice);
            break;

        case 'showVlan':
            output = generateVlanTable(device);
            break;

        case 'showInterfaces':
            output = generateInterfaceBrief(device);
            break;

        case 'showHelp':
            // Handled in terminal component
            break;

        default:
            output = '% Unknown action';
            isError = true;
    }

    const newDevices = {
        ...state.devices,
        [state.currentDevice]: newDevice,
    };

    return {
        newDevices,
        output,
        isError,
    };
};

/**
 * Generate running configuration output
 */
const generateRunningConfig = (device) => {
    const lines = [
        '!',
        `hostname ${device.hostname}`,
        '!',
    ];

    // Add interface configurations
    Object.entries(device.interfaces).forEach(([name, config]) => {
        lines.push(`interface ${name}`);
        if (config.ip) {
            lines.push(` ip address ${config.ip} ${config.mask}`);
        }
        if (config.encapsulation) {
            lines.push(` encapsulation dot1Q ${config.encapsulation}`);
        }
        if (config.mode) {
            lines.push(` switchport mode ${config.mode}`);
        }
        if (config.accessVlan) {
            lines.push(` switchport access vlan ${config.accessVlan}`);
        }
        if (!config.enabled) {
            lines.push(' shutdown');
        }
        lines.push('!');
    });

    // Add VLAN configurations
    Object.entries(device.vlans).forEach(([id, vlan]) => {
        lines.push(`vlan ${id}`);
        lines.push(` name ${vlan.name}`);
        lines.push('!');
    });

    return lines.join('\n');
};

/**
 * Generate routing table output
 */
const generateRoutingTable = (device) => {
    const lines = [
        'Codes: C - connected, S - static, R - RIP, M - mobile, B - BGP',
        '       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area',
        '',
        'Gateway of last resort is not set',
        '',
    ];

    Object.entries(device.interfaces).forEach(([name, config]) => {
        if (config.ip && config.enabled) {
            const network = config.ip.split('.').slice(0, 3).join('.') + '.0';
            lines.push(`C    ${network}/24 is directly connected, ${name}`);
        }
    });

    if (lines.length === 5) {
        lines.push('No routes configured');
    }

    return lines.join('\n');
};

/**
 * Generate VLAN table output
 */
const generateVlanTable = (device) => {
    const lines = [
        'VLAN Name                             Status    Ports',
        '---- -------------------------------- --------- -------------------------------',
        '1    default                          active    ',
    ];

    Object.entries(device.vlans).forEach(([id, vlan]) => {
        const ports = Object.entries(device.interfaces)
            .filter(([_, config]) => config.accessVlan === parseInt(id))
            .map(([name]) => name.replace(/FastEthernet/, 'Fa').replace(/GigabitEthernet/, 'Gi'))
            .join(', ');
        lines.push(`${id.padEnd(5)}${vlan.name.padEnd(33)}active    ${ports}`);
    });

    return lines.join('\n');
};

/**
 * Generate interface brief output
 */
const generateInterfaceBrief = (device) => {
    const lines = [
        'Interface              IP-Address      OK? Method Status                Protocol',
    ];

    Object.entries(device.interfaces).forEach(([name, config]) => {
        const shortName = name.replace(/GigabitEthernet/, 'Gi').replace(/FastEthernet/, 'Fa');
        const ip = config.ip || 'unassigned';
        const status = config.enabled ? 'up' : 'administratively down';
        const protocol = config.enabled && config.ip ? 'up' : 'down';
        lines.push(`${shortName.padEnd(23)}${ip.padEnd(16)}YES  manual ${status.padEnd(22)}${protocol}`);
    });

    if (Object.keys(device.interfaces).length === 0) {
        lines.push('No interfaces configured');
    }

    return lines.join('\n');
};
