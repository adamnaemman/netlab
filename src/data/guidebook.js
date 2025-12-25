// Guidebook data - explanations for commands in each unit
// Like Duolingo's "Tips" feature that explains grammar/vocabulary

export const guidebook = [
    {
        unitId: 1,
        unitName: 'Basic Device Configuration',
        unitIcon: '🖥️',
        unitColor: '#58cc02',
        description: 'Learn the fundamental commands to configure Cisco routers and switches.',
        sections: [
            {
                title: 'Getting Started',
                icon: '🚀',
                content: `When you first connect to a Cisco device, you start in **User EXEC mode**. This mode has limited access and is indicated by the \`>\` prompt.`,
                commands: [
                    {
                        command: 'enable',
                        shortcut: 'en',
                        description: 'Enter Privileged EXEC mode (admin access)',
                        example: 'Router> enable\nRouter#',
                        tip: 'The prompt changes from > to # when you enter privileged mode.',
                    },
                ],
            },
            {
                title: 'Configuration Mode',
                icon: '⚙️',
                content: `To make changes to the device, you need to enter **Global Configuration mode**. This is where you can change settings that affect the entire device.`,
                commands: [
                    {
                        command: 'configure terminal',
                        shortcut: 'conf t',
                        description: 'Enter Global Configuration mode',
                        example: 'Router# configure terminal\nRouter(config)#',
                        tip: 'The prompt shows (config) when you\'re in global configuration mode.',
                    },
                    {
                        command: 'exit',
                        shortcut: null,
                        description: 'Go back one mode level',
                        example: 'Router(config)# exit\nRouter#',
                        tip: 'Use exit to go back. Use end or Ctrl+Z to go directly to privileged mode.',
                    },
                ],
            },
            {
                title: 'Naming Your Device',
                icon: '🏷️',
                content: `Every network device should have a unique name (hostname) to identify it. This helps when managing multiple devices.`,
                commands: [
                    {
                        command: 'hostname <name>',
                        shortcut: null,
                        description: 'Set the device hostname',
                        example: 'Router(config)# hostname R1\nR1(config)#',
                        tip: 'The hostname appears in the prompt. Choose descriptive names like R1, SW-Floor2, etc.',
                    },
                ],
            },
            {
                title: 'Working with Interfaces',
                icon: '🔌',
                content: `Interfaces are the physical or virtual ports on a device. Each interface can be configured separately.`,
                commands: [
                    {
                        command: 'interface <type><number>',
                        shortcut: 'int',
                        description: 'Enter interface configuration mode',
                        example: 'Router(config)# interface g0/0\nRouter(config-if)#',
                        tip: 'Common shortcuts: g = GigabitEthernet, f = FastEthernet. Example: int g0/0',
                    },
                    {
                        command: 'ip address <ip> <mask>',
                        shortcut: null,
                        description: 'Assign an IP address to an interface',
                        example: 'Router(config-if)# ip address 192.168.1.1 255.255.255.0',
                        tip: 'The subnet mask 255.255.255.0 is equivalent to /24 (256 addresses).',
                    },
                    {
                        command: 'no shutdown',
                        shortcut: 'no shut',
                        description: 'Enable the interface (turn it on)',
                        example: 'Router(config-if)# no shutdown\n%LINK-3-UPDOWN: Interface is up',
                        tip: 'Interfaces are disabled by default. Always remember to use "no shutdown"!',
                    },
                ],
            },
            {
                title: 'Verifying Configuration',
                icon: '🔍',
                content: `After making changes, you should verify your configuration using "show" commands.`,
                commands: [
                    {
                        command: 'show running-config',
                        shortcut: 'show run',
                        description: 'Display the current active configuration',
                        example: 'Router# show run\nBuilding configuration...',
                        tip: 'This shows all configurations currently in RAM (not saved yet).',
                    },
                    {
                        command: 'show ip interface brief',
                        shortcut: 'show ip int br',
                        description: 'Quick overview of all interfaces and their status',
                        example: 'Router# show ip int br\nInterface    IP-Address    Status',
                        tip: 'Great for checking if interfaces are up and have correct IPs.',
                    },
                ],
            },
        ],
    },
    {
        unitId: 2,
        unitName: 'VLAN Configuration',
        unitIcon: '🔀',
        unitColor: '#1cb0f6',
        description: 'Learn to create and manage Virtual LANs to segment your network.',
        sections: [
            {
                title: 'What are VLANs?',
                icon: '📚',
                content: `A **VLAN (Virtual Local Area Network)** allows you to divide a single physical switch into multiple logical networks. Devices on different VLANs cannot communicate directly without a router.`,
                commands: [],
            },
            {
                title: 'Creating VLANs',
                icon: '➕',
                content: `VLANs are identified by numbers (1-4094). VLAN 1 is the default VLAN. You create new VLANs in global configuration mode.`,
                commands: [
                    {
                        command: 'vlan <id>',
                        shortcut: null,
                        description: 'Create a VLAN and enter VLAN configuration mode',
                        example: 'Switch(config)# vlan 10\nSwitch(config-vlan)#',
                        tip: 'Common VLAN IDs: 10=Sales, 20=Engineering, 30=Management, 99=Native.',
                    },
                    {
                        command: 'name <description>',
                        shortcut: null,
                        description: 'Give the VLAN a descriptive name',
                        example: 'Switch(config-vlan)# name Sales',
                        tip: 'Names make it easier to identify VLANs. Use department or purpose names.',
                    },
                ],
            },
            {
                title: 'Access Ports',
                icon: '🖥️',
                content: `**Access ports** connect end devices (computers, printers) to a single VLAN. All traffic on an access port belongs to one VLAN.`,
                commands: [
                    {
                        command: 'switchport mode access',
                        shortcut: null,
                        description: 'Set the port as an access port',
                        example: 'Switch(config-if)# switchport mode access',
                        tip: 'Access ports are for end devices. Trunk ports are for switch-to-switch links.',
                    },
                    {
                        command: 'switchport access vlan <id>',
                        shortcut: null,
                        description: 'Assign the port to a specific VLAN',
                        example: 'Switch(config-if)# switchport access vlan 10',
                        tip: 'If the VLAN doesn\'t exist, it will be created automatically.',
                    },
                ],
            },
            {
                title: 'Trunk Ports',
                icon: '🔗',
                content: `**Trunk ports** carry traffic for multiple VLANs between switches. They use tagging (802.1Q) to identify which VLAN each frame belongs to.`,
                commands: [
                    {
                        command: 'switchport mode trunk',
                        shortcut: null,
                        description: 'Set the port as a trunk port',
                        example: 'Switch(config-if)# switchport mode trunk',
                        tip: 'Use trunks between switches and between switches and routers.',
                    },
                    {
                        command: 'switchport trunk allowed vlan <list>',
                        shortcut: null,
                        description: 'Specify which VLANs can pass through the trunk',
                        example: 'Switch(config-if)# switchport trunk allowed vlan 10,20,30',
                        tip: 'By default, all VLANs are allowed. Restricting improves security.',
                    },
                ],
            },
            {
                title: 'Verifying VLANs',
                icon: '🔍',
                content: `Always verify your VLAN configuration to ensure devices are in the correct VLANs.`,
                commands: [
                    {
                        command: 'show vlan brief',
                        shortcut: 'show vlan br',
                        description: 'Display all VLANs and their assigned ports',
                        example: 'Switch# show vlan brief\nVLAN Name    Status    Ports',
                        tip: 'This shows which ports belong to which VLAN.',
                    },
                    {
                        command: 'show interfaces trunk',
                        shortcut: null,
                        description: 'Display trunk port information',
                        example: 'Switch# show interfaces trunk',
                        tip: 'Shows which VLANs are allowed on each trunk.',
                    },
                ],
            },
        ],
    },
];

export const getGuidebookByUnit = (unitId) =>
    guidebook.find(g => g.unitId === unitId);
