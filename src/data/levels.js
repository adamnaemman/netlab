// Enhanced level definitions organized into Units with multiple levels each
// Unit 1: Basic Device Configuration (10 levels)
// Unit 2: VLAN Configuration (10 levels)

export const units = [
    {
        id: 1,
        name: 'Basic Device Configuration',
        description: 'Learn to configure routers and switches from scratch',
        icon: '🖥️',
        color: '#58cc02',
        levels: [
            {
                id: '1-1',
                name: 'Hello, Router!',
                description: 'Enter your first command',
                difficulty: 'Beginner',
                totalXP: 15,
                scenario: "You just powered on a brand new router. Let's access it!",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'router', command: 'enable', alternateCommands: [], hint: 'Type "enable" to get admin access', xp: 15 },
                ],
            },
            {
                id: '1-2',
                name: 'Config Mode',
                description: 'Enter configuration mode',
                difficulty: 'Beginner',
                totalXP: 20,
                scenario: "Now let's learn to enter global configuration mode.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'router', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'router', command: 'conf t', alternateCommands: ['configure terminal'], hint: 'Type "conf t" or "configure terminal"', xp: 15 },
                ],
            },
            {
                id: '1-3',
                name: 'Name Your Router',
                description: 'Set a hostname',
                difficulty: 'Beginner',
                totalXP: 30,
                scenario: "Give your router a name so you can identify it.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'router', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'router', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'hostname', description: 'Set hostname to "R1"', device: 'router', command: 'hostname R1', hint: 'Type "hostname R1"', xp: 20 },
                ],
            },
            {
                id: '1-4',
                name: 'Interface Basics',
                description: 'Navigate to an interface',
                difficulty: 'Beginner',
                totalXP: 35,
                scenario: "Interfaces are the ports of your router. Let's configure one!",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'router', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'router', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'interface', description: 'Enter interface G0/0', device: 'router', command: 'int g0/0', alternateCommands: ['interface g0/0', 'interface gigabitethernet0/0'], hint: 'Type "int g0/0"', xp: 25 },
                ],
            },
            {
                id: '1-5',
                name: 'Your First IP',
                description: 'Assign an IP address',
                difficulty: 'Beginner',
                totalXP: 50,
                scenario: "Every interface needs an IP address to communicate.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'router', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'router', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'interface', description: 'Enter interface G0/0', device: 'router', command: 'int g0/0', hint: 'Type "int g0/0"', xp: 10 },
                    { id: 'ip-address', description: 'Set IP 192.168.1.1/24', device: 'router', command: 'ip address 192.168.1.1 255.255.255.0', hint: 'Type "ip address 192.168.1.1 255.255.255.0"', xp: 30 },
                ],
            },
            {
                id: '1-6',
                name: 'Wake Up!',
                description: 'Enable an interface',
                difficulty: 'Beginner',
                totalXP: 55,
                scenario: "Interfaces are disabled by default. Let's turn it on!",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'router', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'router', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'interface', description: 'Enter interface G0/0', device: 'router', command: 'int g0/0', hint: 'Type "int g0/0"', xp: 5 },
                    { id: 'ip-address', description: 'Set IP 192.168.1.1/24', device: 'router', command: 'ip address 192.168.1.1 255.255.255.0', hint: 'Type the IP address command', xp: 15 },
                    { id: 'no-shutdown', description: 'Enable the interface', device: 'router', command: 'no shutdown', alternateCommands: ['no shut'], hint: 'Type "no shutdown"', xp: 25 },
                ],
            },
            {
                id: '1-7',
                name: 'Check Your Work',
                description: 'View running configuration',
                difficulty: 'Beginner',
                totalXP: 40,
                scenario: "Learn to verify your configuration with show commands.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'router', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'show-run', description: 'View running config', device: 'router', command: 'show run', alternateCommands: ['show running-config'], hint: 'Type "show run"', xp: 35 },
                ],
            },
            {
                id: '1-8',
                name: 'Name the Switch',
                description: 'Configure a switch hostname',
                difficulty: 'Beginner',
                totalXP: 45,
                scenario: "Switches need names too! Configure SW1.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode on Switch', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'hostname', description: 'Set hostname to "SW1"', device: 'switch', command: 'hostname SW1', hint: 'Type "hostname SW1"', xp: 35 },
                ],
            },
            {
                id: '1-9',
                name: 'Switch Interface',
                description: 'Navigate switch interfaces',
                difficulty: 'Beginner',
                totalXP: 50,
                scenario: "Switches have FastEthernet interfaces. Let's explore!",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'interface', description: 'Enter interface F0/1', device: 'switch', command: 'int f0/1', alternateCommands: ['interface f0/1', 'interface fastethernet0/1'], hint: 'Type "int f0/1"', xp: 40 },
                ],
            },
            {
                id: '1-10',
                name: 'Full Router Setup',
                description: 'Complete router configuration',
                difficulty: 'Intermediate',
                totalXP: 75,
                scenario: "Put it all together! Complete router setup from scratch.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'router', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'router', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'hostname', description: 'Set hostname to "R1"', device: 'router', command: 'hostname R1', hint: 'Type "hostname R1"', xp: 10 },
                    { id: 'interface', description: 'Enter interface G0/0', device: 'router', command: 'int g0/0', hint: 'Type "int g0/0"', xp: 10 },
                    { id: 'ip-address', description: 'Set IP 192.168.1.1/24', device: 'router', command: 'ip address 192.168.1.1 255.255.255.0', hint: 'Type the IP command', xp: 20 },
                    { id: 'no-shutdown', description: 'Enable the interface', device: 'router', command: 'no shutdown', hint: 'Type "no shutdown"', xp: 25 },
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'VLAN Configuration',
        description: 'Create and manage VLANs on switches',
        icon: '🔀',
        color: '#1cb0f6',
        levels: [
            {
                id: '2-1',
                name: 'What is a VLAN?',
                description: 'Create your first VLAN',
                difficulty: 'Beginner',
                totalXP: 30,
                scenario: "VLANs separate network traffic. Let's create one!",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'vlan10', description: 'Create VLAN 10', device: 'switch', command: 'vlan 10', hint: 'Type "vlan 10"', xp: 20 },
                ],
            },
            {
                id: '2-2',
                name: 'Name Your VLAN',
                description: 'Give the VLAN a descriptive name',
                difficulty: 'Beginner',
                totalXP: 35,
                scenario: "Name your VLAN so everyone knows what it's for.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'vlan10', description: 'Create VLAN 10', device: 'switch', command: 'vlan 10', hint: 'Type "vlan 10"', xp: 5 },
                    { id: 'name', description: 'Name it "Sales"', device: 'switch', command: 'name Sales', hint: 'Type "name Sales"', xp: 20 },
                ],
            },
            {
                id: '2-3',
                name: 'Second VLAN',
                description: 'Create VLAN 20 for Engineering',
                difficulty: 'Beginner',
                totalXP: 40,
                scenario: "One department down, let's add Engineering!",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'vlan20', description: 'Create VLAN 20', device: 'switch', command: 'vlan 20', hint: 'Type "vlan 20"', xp: 10 },
                    { id: 'name', description: 'Name it "Engineering"', device: 'switch', command: 'name Engineering', hint: 'Type "name Engineering"', xp: 20 },
                ],
            },
            {
                id: '2-4',
                name: 'Access Mode',
                description: 'Set port to access mode',
                difficulty: 'Beginner',
                totalXP: 45,
                scenario: "Access ports connect end devices to a single VLAN.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'interface', description: 'Enter interface F0/1', device: 'switch', command: 'int f0/1', hint: 'Type "int f0/1"', xp: 10 },
                    { id: 'mode', description: 'Set to access mode', device: 'switch', command: 'switchport mode access', hint: 'Type "switchport mode access"', xp: 25 },
                ],
            },
            {
                id: '2-5',
                name: 'Assign to VLAN',
                description: 'Put a port in VLAN 10',
                difficulty: 'Beginner',
                totalXP: 50,
                scenario: "Connect a computer to the Sales VLAN.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'interface', description: 'Enter interface F0/1', device: 'switch', command: 'int f0/1', hint: 'Type "int f0/1"', xp: 5 },
                    { id: 'access-vlan', description: 'Assign to VLAN 10', device: 'switch', command: 'switchport access vlan 10', hint: 'Type "switchport access vlan 10"', xp: 35 },
                ],
            },
            {
                id: '2-6',
                name: 'View VLANs',
                description: 'Check VLAN configuration',
                difficulty: 'Beginner',
                totalXP: 35,
                scenario: "Verify your VLAN setup with show commands.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'show-vlan', description: 'View VLAN brief', device: 'switch', command: 'show vlan brief', alternateCommands: ['show vlan'], hint: 'Type "show vlan brief"', xp: 30 },
                ],
            },
            {
                id: '2-7',
                name: 'Multiple Ports',
                description: 'Configure another port for VLAN 20',
                difficulty: 'Intermediate',
                totalXP: 55,
                scenario: "Add the Engineering team's computer to VLAN 20.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'interface', description: 'Enter interface F0/2', device: 'switch', command: 'int f0/2', alternateCommands: ['interface f0/2'], hint: 'Type "int f0/2"', xp: 5 },
                    { id: 'mode', description: 'Set to access mode', device: 'switch', command: 'switchport mode access', hint: 'Type "switchport mode access"', xp: 15 },
                    { id: 'access-vlan', description: 'Assign to VLAN 20', device: 'switch', command: 'switchport access vlan 20', hint: 'Type "switchport access vlan 20"', xp: 25 },
                ],
            },
            {
                id: '2-8',
                name: 'Trunk Mode',
                description: 'Configure a trunk port',
                difficulty: 'Intermediate',
                totalXP: 60,
                scenario: "Trunk ports carry multiple VLANs between switches.",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'interface', description: 'Enter interface G0/1', device: 'switch', command: 'int g0/1', hint: 'Type "int g0/1"', xp: 10 },
                    { id: 'trunk', description: 'Set to trunk mode', device: 'switch', command: 'switchport mode trunk', hint: 'Type "switchport mode trunk"', xp: 40 },
                ],
            },
            {
                id: '2-9',
                name: 'Full VLAN Setup',
                description: 'Create 2 VLANs and assign ports',
                difficulty: 'Intermediate',
                totalXP: 80,
                scenario: "Complete VLAN configuration challenge!",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'vlan10', description: 'Create VLAN 10', device: 'switch', command: 'vlan 10', hint: 'Type "vlan 10"', xp: 10 },
                    { id: 'name10', description: 'Name it "Sales"', device: 'switch', command: 'name Sales', hint: 'Type "name Sales"', xp: 10 },
                    { id: 'vlan20', description: 'Create VLAN 20', device: 'switch', command: 'vlan 20', hint: 'Type "vlan 20"', xp: 10 },
                    { id: 'name20', description: 'Name it "Engineering"', device: 'switch', command: 'name Engineering', hint: 'Type "name Engineering"', xp: 10 },
                    { id: 'interface', description: 'Enter interface F0/1', device: 'switch', command: 'int f0/1', hint: 'Type "int f0/1"', xp: 10 },
                    { id: 'access-vlan', description: 'Assign to VLAN 10', device: 'switch', command: 'switchport access vlan 10', hint: 'Type "switchport access vlan 10"', xp: 20 },
                ],
            },
            {
                id: '2-10',
                name: 'VLAN Master',
                description: 'Complete network segmentation',
                difficulty: 'Advanced',
                totalXP: 100,
                scenario: "Master challenge: Full VLAN + Trunk configuration!",
                steps: [
                    { id: 'enable', description: 'Enter Privileged Mode', device: 'switch', command: 'enable', hint: 'Type "enable"', xp: 5 },
                    { id: 'conf-t', description: 'Enter Config Mode', device: 'switch', command: 'conf t', hint: 'Type "conf t"', xp: 5 },
                    { id: 'hostname', description: 'Set hostname to "SW1"', device: 'switch', command: 'hostname SW1', hint: 'Type "hostname SW1"', xp: 10 },
                    { id: 'vlan10', description: 'Create VLAN 10', device: 'switch', command: 'vlan 10', hint: 'Type "vlan 10"', xp: 10 },
                    { id: 'name10', description: 'Name it "Sales"', device: 'switch', command: 'name Sales', hint: 'Type "name Sales"', xp: 10 },
                    { id: 'interface-f1', description: 'Enter interface F0/1', device: 'switch', command: 'int f0/1', hint: 'Type "int f0/1"', xp: 5 },
                    { id: 'access-vlan10', description: 'Assign to VLAN 10', device: 'switch', command: 'switchport access vlan 10', hint: 'Type "switchport access vlan 10"', xp: 15 },
                    { id: 'interface-g1', description: 'Enter interface G0/1', device: 'switch', command: 'int g0/1', hint: 'Type "int g0/1"', xp: 10 },
                    { id: 'trunk', description: 'Set to trunk mode', device: 'switch', command: 'switchport mode trunk', hint: 'Type "switchport mode trunk"', xp: 30 },
                ],
            },
        ],
    },
];

// Flat list of all levels for compatibility
export const levels = units.flatMap(unit =>
    unit.levels.map(level => ({
        ...level,
        unitId: unit.id,
        unitName: unit.name,
        unitColor: unit.color,
        unitIcon: unit.icon,
    }))
);

export const getLevelById = (id) => levels.find((level) => level.id === id);

export const getUnitById = (id) => units.find((unit) => unit.id === id);

export const getNextLevel = (currentId) => {
    const currentIndex = levels.findIndex((level) => level.id === currentId);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
};

export const getTotalXP = () => levels.reduce((sum, level) => sum + level.totalXP, 0);
