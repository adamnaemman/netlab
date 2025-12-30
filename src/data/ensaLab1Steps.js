// ENSA Lab Activity 1 - OSPFv2, NAT, ACL Configuration
// Based on Skills Assessment topology with R1, R2, S1, S2

export const ensaLab1Steps = [
    // ========== SWITCH S1 - BASIC CONFIG ==========
    { device: 'S1', part: 1, partName: 'S1 - Basic Config', command: 'enable', description: 'Enter privileged mode', hint: 'Type "enable"', xp: 5 },
    { device: 'S1', part: 1, partName: 'S1 - Basic Config', command: 'configure terminal', alternates: ['conf t'], description: 'Enter global config', hint: 'Type "conf t"', xp: 5 },
    { device: 'S1', part: 1, partName: 'S1 - Basic Config', command: 'no ip domain-lookup', description: 'Disable DNS lookup', hint: 'Type "no ip domain-lookup"', xp: 5 },
    { device: 'S1', part: 1, partName: 'S1 - Basic Config', command: 'hostname S1', description: 'Set hostname', hint: 'Type "hostname S1"', xp: 10 },
    { device: 'S1', part: 1, partName: 'S1 - Basic Config', command: 'service password-encryption', description: 'Encrypt passwords', hint: 'Type "service password-encryption"', xp: 5 },
    { device: 'S1', part: 1, partName: 'S1 - Basic Config', command: 'enable secret class', description: 'Set enable secret', hint: 'Type "enable secret class"', xp: 10 },
    { device: 'S1', part: 1, partName: 'S1 - Basic Config', command: 'banner motd #Unauthorized access is strictly prohibited.#', alternates: ['banner motd #unauthorized access is strictly prohibited.#'], description: 'Set banner', hint: 'Type "banner motd #Unauthorized access is strictly prohibited.#"', xp: 10 },

    // S1 - VLAN 99 SVI
    { device: 'S1', part: 2, partName: 'S1 - Management SVI', command: 'vlan 99', description: 'Create VLAN 99', hint: 'Type "vlan 99"', xp: 10 },
    { device: 'S1', part: 2, partName: 'S1 - Management SVI', command: 'name Management', description: 'Name VLAN 99', hint: 'Type "name Management"', xp: 5 },
    { device: 'S1', part: 2, partName: 'S1 - Management SVI', command: 'exit', description: 'Exit VLAN config', hint: 'Type "exit"', xp: 5 },
    { device: 'S1', part: 2, partName: 'S1 - Management SVI', command: 'interface vlan 99', alternates: ['int vlan 99'], description: 'Enter SVI config', hint: 'Type "interface vlan 99"', xp: 10 },
    { device: 'S1', part: 2, partName: 'S1 - Management SVI', command: 'ip address 192.168.1.2 255.255.255.0', description: 'Set SVI IP', hint: 'IP: 192.168.1.2/24', xp: 15 },
    { device: 'S1', part: 2, partName: 'S1 - Management SVI', command: 'no shutdown', alternates: ['no shut'], description: 'Enable SVI', hint: 'Type "no shutdown"', xp: 5 },
    { device: 'S1', part: 2, partName: 'S1 - Management SVI', command: 'exit', description: 'Exit SVI', hint: 'Type "exit"', xp: 5 },
    { device: 'S1', part: 2, partName: 'S1 - Management SVI', command: 'ip default-gateway 192.168.1.1', description: 'Set default gateway', hint: 'Type "ip default-gateway 192.168.1.1"', xp: 15 },

    // S1 - Assign ports to VLAN 99
    { device: 'S1', part: 3, partName: 'S1 - Port Config', command: 'interface f0/6', alternates: ['int f0/6'], description: 'Enter F0/6 for PC-A', hint: 'Type "interface f0/6"', xp: 10 },
    { device: 'S1', part: 3, partName: 'S1 - Port Config', command: 'switchport mode access', description: 'Set access mode', hint: 'Type "switchport mode access"', xp: 10 },
    { device: 'S1', part: 3, partName: 'S1 - Port Config', command: 'switchport access vlan 99', description: 'Assign to VLAN 99', hint: 'Type "switchport access vlan 99"', xp: 10 },
    { device: 'S1', part: 3, partName: 'S1 - Port Config', command: 'exit', description: 'Exit F0/6', hint: 'Type "exit"', xp: 5 },

    // S1 - Console Line
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'line console 0', alternates: ['line con 0'], description: 'Enter console config', hint: 'Type "line console 0"', xp: 5 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'password cisco', description: 'Set console password', hint: 'Type "password cisco"', xp: 10 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'logging synchronous', description: 'Enable logging sync', hint: 'Type "logging synchronous"', xp: 10 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'exit', description: 'Exit console', hint: 'Type "exit"', xp: 5 },

    // S1 - VTY Lines
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'line vty 0 15', description: 'Enter VTY config', hint: 'Type "line vty 0 15"', xp: 5 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'password cisco', description: 'Set VTY password', hint: 'Type "password cisco"', xp: 10 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'transport input telnet', description: 'Allow telnet', hint: 'Type "transport input telnet"', xp: 10 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'exit', description: 'Exit VTY', hint: 'Type "exit"', xp: 5 },
    { device: 'S1', part: 4, partName: 'S1 - Line Config', command: 'end', description: 'Return to priv mode', hint: 'Type "end"', xp: 5 },

    // ========== SWITCH S2 - BASIC CONFIG ==========
    { device: 'S2', part: 5, partName: 'S2 - Basic Config', command: 'enable', description: 'Enter privileged mode', hint: 'Type "enable"', xp: 5 },
    { device: 'S2', part: 5, partName: 'S2 - Basic Config', command: 'configure terminal', alternates: ['conf t'], description: 'Enter global config', hint: 'Type "conf t"', xp: 5 },
    { device: 'S2', part: 5, partName: 'S2 - Basic Config', command: 'no ip domain-lookup', description: 'Disable DNS lookup', hint: 'Type "no ip domain-lookup"', xp: 5 },
    { device: 'S2', part: 5, partName: 'S2 - Basic Config', command: 'hostname S2', description: 'Set hostname', hint: 'Type "hostname S2"', xp: 10 },
    { device: 'S2', part: 5, partName: 'S2 - Basic Config', command: 'service password-encryption', description: 'Encrypt passwords', hint: 'Type "service password-encryption"', xp: 5 },
    { device: 'S2', part: 5, partName: 'S2 - Basic Config', command: 'enable secret class', description: 'Set enable secret', hint: 'Type "enable secret class"', xp: 10 },
    { device: 'S2', part: 5, partName: 'S2 - Basic Config', command: 'banner motd #Unauthorized access is strictly prohibited.#', alternates: ['banner motd #unauthorized access is strictly prohibited.#'], description: 'Set banner', hint: 'Type the banner command', xp: 10 },

    // S2 - SVI
    { device: 'S2', part: 6, partName: 'S2 - Management SVI', command: 'interface vlan 1', alternates: ['int vlan 1'], description: 'Enter SVI VLAN 1', hint: 'Type "interface vlan 1"', xp: 10 },
    { device: 'S2', part: 6, partName: 'S2 - Management SVI', command: 'ip address 10.67.1.2 255.255.255.0', description: 'Set SVI IP', hint: 'IP: 10.67.1.2/24', xp: 15 },
    { device: 'S2', part: 6, partName: 'S2 - Management SVI', command: 'no shutdown', alternates: ['no shut'], description: 'Enable SVI', hint: 'Type "no shutdown"', xp: 5 },
    { device: 'S2', part: 6, partName: 'S2 - Management SVI', command: 'exit', description: 'Exit SVI', hint: 'Type "exit"', xp: 5 },
    { device: 'S2', part: 6, partName: 'S2 - Management SVI', command: 'ip default-gateway 10.67.1.1', description: 'Set default gateway', hint: 'Type "ip default-gateway 10.67.1.1"', xp: 15 },

    // S2 - Console & VTY
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'line console 0', alternates: ['line con 0'], description: 'Enter console config', hint: 'Type "line console 0"', xp: 5 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'password cisco', description: 'Set console password', hint: 'Type "password cisco"', xp: 10 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'logging synchronous', description: 'Enable logging sync', hint: 'Type "logging synchronous"', xp: 10 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'exit', description: 'Exit console', hint: 'Type "exit"', xp: 5 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'line vty 0 15', description: 'Enter VTY config', hint: 'Type "line vty 0 15"', xp: 5 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'password cisco', description: 'Set VTY password', hint: 'Type "password cisco"', xp: 10 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'transport input telnet', description: 'Allow telnet', hint: 'Type "transport input telnet"', xp: 10 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'exit', description: 'Exit VTY', hint: 'Type "exit"', xp: 5 },
    { device: 'S2', part: 7, partName: 'S2 - Line Config', command: 'end', description: 'Return to priv mode', hint: 'Type "end"', xp: 5 },

    // ========== ROUTER R1 - BASIC CONFIG ==========
    { device: 'R1', part: 8, partName: 'R1 - Basic Config', command: 'enable', description: 'Enter privileged mode', hint: 'Type "enable"', xp: 5 },
    { device: 'R1', part: 8, partName: 'R1 - Basic Config', command: 'configure terminal', alternates: ['conf t'], description: 'Enter global config', hint: 'Type "conf t"', xp: 5 },
    { device: 'R1', part: 8, partName: 'R1 - Basic Config', command: 'no ip domain-lookup', description: 'Disable DNS lookup', hint: 'Type "no ip domain-lookup"', xp: 5 },
    { device: 'R1', part: 8, partName: 'R1 - Basic Config', command: 'hostname R1', description: 'Set hostname', hint: 'Type "hostname R1"', xp: 10 },
    { device: 'R1', part: 8, partName: 'R1 - Basic Config', command: 'service password-encryption', description: 'Encrypt passwords', hint: 'Type "service password-encryption"', xp: 5 },
    { device: 'R1', part: 8, partName: 'R1 - Basic Config', command: 'enable secret class', description: 'Set enable secret', hint: 'Type "enable secret class"', xp: 10 },
    { device: 'R1', part: 8, partName: 'R1 - Basic Config', command: 'banner motd #Unauthorized access is strictly prohibited.#', alternates: ['banner motd #unauthorized access is strictly prohibited.#'], description: 'Set banner', hint: 'Type the banner command', xp: 10 },

    // R1 - Console & VTY
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'line console 0', alternates: ['line con 0'], description: 'Enter console config', hint: 'Type "line console 0"', xp: 5 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'password cisco', description: 'Set console password', hint: 'Type "password cisco"', xp: 10 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'logging synchronous', description: 'Enable logging sync', hint: 'Type "logging synchronous"', xp: 10 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'exit', description: 'Exit console', hint: 'Type "exit"', xp: 5 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'line vty 0 4', description: 'Enter VTY config', hint: 'Type "line vty 0 4"', xp: 5 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'password cisco', description: 'Set VTY password', hint: 'Type "password cisco"', xp: 10 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'transport input telnet', description: 'Allow telnet', hint: 'Type "transport input telnet"', xp: 10 },
    { device: 'R1', part: 9, partName: 'R1 - Line Config', command: 'exit', description: 'Exit VTY', hint: 'Type "exit"', xp: 5 },

    // R1 - Interface Config
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'interface g0/0/0', alternates: ['int g0/0/0'], description: 'Enter G0/0/0 to R2', hint: 'Type "interface g0/0/0"', xp: 10 },
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'ip address 10.67.254.2 255.255.255.252', description: 'Set IP to R2 link', hint: 'IP: 10.67.254.2/30', xp: 15 },
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'no shutdown', alternates: ['no shut'], description: 'Enable interface', hint: 'Type "no shutdown"', xp: 5 },
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'interface g0/0/1', alternates: ['int g0/0/1'], description: 'Enter G0/0/1 to S1', hint: 'Type "interface g0/0/1"', xp: 10 },
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'ip address 192.168.1.1 255.255.255.0', description: 'Set LAN IP', hint: 'IP: 192.168.1.1/24', xp: 15 },
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'no shutdown', alternates: ['no shut'], description: 'Enable interface', hint: 'Type "no shutdown"', xp: 5 },
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'interface loopback 0', alternates: ['int lo0', 'interface loopback0'], description: 'Create Loopback0', hint: 'Type "interface loopback 0"', xp: 10 },
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'ip address 10.52.0.1 255.255.255.248', description: 'Set Loopback IP', hint: 'IP: 10.52.0.1/29', xp: 15 },
    { device: 'R1', part: 10, partName: 'R1 - Interfaces', command: 'exit', description: 'Exit loopback', hint: 'Type "exit"', xp: 5 },

    // R1 - OSPF Configuration
    { device: 'R1', part: 11, partName: 'R1 - OSPFv2', command: 'router ospf 1', description: 'Enter OSPF config', hint: 'Type "router ospf 1"', xp: 15 },
    { device: 'R1', part: 11, partName: 'R1 - OSPFv2', command: 'router-id 1.1.1.1', description: 'Set Router ID', hint: 'Type "router-id 1.1.1.1"', xp: 15 },
    { device: 'R1', part: 11, partName: 'R1 - OSPFv2', command: 'network 10.67.254.0 0.0.0.3 area 0', description: 'Advertise link to R2', hint: 'Type "network 10.67.254.0 0.0.0.3 area 0"', xp: 20 },
    { device: 'R1', part: 11, partName: 'R1 - OSPFv2', command: 'network 192.168.1.0 0.0.0.255 area 0', description: 'Advertise LAN', hint: 'Type "network 192.168.1.0 0.0.0.255 area 0"', xp: 20 },
    { device: 'R1', part: 11, partName: 'R1 - OSPFv2', command: 'network 10.52.0.0 0.0.0.7 area 0', description: 'Advertise Loopback', hint: 'Type "network 10.52.0.0 0.0.0.7 area 0"', xp: 20 },
    { device: 'R1', part: 11, partName: 'R1 - OSPFv2', command: 'passive-interface g0/0/1', description: 'Set passive on LAN', hint: 'Type "passive-interface g0/0/1"', xp: 15 },
    { device: 'R1', part: 11, partName: 'R1 - OSPFv2', command: 'exit', description: 'Exit OSPF config', hint: 'Type "exit"', xp: 5 },
    { device: 'R1', part: 11, partName: 'R1 - OSPFv2', command: 'end', description: 'Return to priv mode', hint: 'Type "end"', xp: 5 },

    // ========== ROUTER R2 - BASIC CONFIG ==========
    { device: 'R2', part: 12, partName: 'R2 - Basic Config', command: 'enable', description: 'Enter privileged mode', hint: 'Type "enable"', xp: 5 },
    { device: 'R2', part: 12, partName: 'R2 - Basic Config', command: 'configure terminal', alternates: ['conf t'], description: 'Enter global config', hint: 'Type "conf t"', xp: 5 },
    { device: 'R2', part: 12, partName: 'R2 - Basic Config', command: 'no ip domain-lookup', description: 'Disable DNS lookup', hint: 'Type "no ip domain-lookup"', xp: 5 },
    { device: 'R2', part: 12, partName: 'R2 - Basic Config', command: 'hostname R2', description: 'Set hostname', hint: 'Type "hostname R2"', xp: 10 },
    { device: 'R2', part: 12, partName: 'R2 - Basic Config', command: 'service password-encryption', description: 'Encrypt passwords', hint: 'Type "service password-encryption"', xp: 5 },
    { device: 'R2', part: 12, partName: 'R2 - Basic Config', command: 'enable secret class', description: 'Set enable secret', hint: 'Type "enable secret class"', xp: 10 },
    { device: 'R2', part: 12, partName: 'R2 - Basic Config', command: 'banner motd #Unauthorized access is strictly prohibited.#', alternates: ['banner motd #unauthorized access is strictly prohibited.#'], description: 'Set banner', hint: 'Type the banner command', xp: 10 },

    // R2 - Console & VTY
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'line console 0', alternates: ['line con 0'], description: 'Enter console config', hint: 'Type "line console 0"', xp: 5 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'password cisco', description: 'Set console password', hint: 'Type "password cisco"', xp: 10 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'logging synchronous', description: 'Enable logging sync', hint: 'Type "logging synchronous"', xp: 10 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'exit', description: 'Exit console', hint: 'Type "exit"', xp: 5 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'line vty 0 4', description: 'Enter VTY config', hint: 'Type "line vty 0 4"', xp: 5 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'password cisco', description: 'Set VTY password', hint: 'Type "password cisco"', xp: 10 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'transport input telnet', description: 'Allow telnet', hint: 'Type "transport input telnet"', xp: 10 },
    { device: 'R2', part: 13, partName: 'R2 - Line Config', command: 'exit', description: 'Exit VTY', hint: 'Type "exit"', xp: 5 },

    // R2 - Interface Config
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'interface g0/0/0', alternates: ['int g0/0/0'], description: 'Enter G0/0/0 to R1', hint: 'Type "interface g0/0/0"', xp: 10 },
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'ip address 10.67.254.1 255.255.255.252', description: 'Set IP to R1 link', hint: 'IP: 10.67.254.1/30', xp: 15 },
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'no shutdown', alternates: ['no shut'], description: 'Enable interface', hint: 'Type "no shutdown"', xp: 5 },
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'interface g0/0/1', alternates: ['int g0/0/1'], description: 'Enter G0/0/1 to S2', hint: 'Type "interface g0/0/1"', xp: 10 },
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'ip address 10.67.1.1 255.255.255.0', description: 'Set LAN IP', hint: 'IP: 10.67.1.1/24', xp: 15 },
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'no shutdown', alternates: ['no shut'], description: 'Enable interface', hint: 'Type "no shutdown"', xp: 5 },
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'interface loopback 0', alternates: ['int lo0', 'interface loopback0'], description: 'Create Loopback0', hint: 'Type "interface loopback 0"', xp: 10 },
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'ip address 209.165.201.1 255.255.255.224', description: 'Set Loopback IP (simulated Internet)', hint: 'IP: 209.165.201.1/27', xp: 15 },
    { device: 'R2', part: 14, partName: 'R2 - Interfaces', command: 'exit', description: 'Exit loopback', hint: 'Type "exit"', xp: 5 },

    // R2 - OSPF Configuration
    { device: 'R2', part: 15, partName: 'R2 - OSPFv2', command: 'router ospf 1', description: 'Enter OSPF config', hint: 'Type "router ospf 1"', xp: 15 },
    { device: 'R2', part: 15, partName: 'R2 - OSPFv2', command: 'router-id 2.2.2.2', description: 'Set Router ID', hint: 'Type "router-id 2.2.2.2"', xp: 15 },
    { device: 'R2', part: 15, partName: 'R2 - OSPFv2', command: 'network 10.67.254.0 0.0.0.3 area 0', description: 'Advertise link to R1', hint: 'Type "network 10.67.254.0 0.0.0.3 area 0"', xp: 20 },
    { device: 'R2', part: 15, partName: 'R2 - OSPFv2', command: 'network 10.67.1.0 0.0.0.255 area 0', description: 'Advertise LAN', hint: 'Type "network 10.67.1.0 0.0.0.255 area 0"', xp: 20 },
    { device: 'R2', part: 15, partName: 'R2 - OSPFv2', command: 'passive-interface g0/0/1', description: 'Set passive on LAN', hint: 'Type "passive-interface g0/0/1"', xp: 15 },
    { device: 'R2', part: 15, partName: 'R2 - OSPFv2', command: 'default-information originate', description: 'Advertise default route', hint: 'Type "default-information originate"', xp: 20 },
    { device: 'R2', part: 15, partName: 'R2 - OSPFv2', command: 'exit', description: 'Exit OSPF config', hint: 'Type "exit"', xp: 5 },

    // R2 - Default Route (for NAT)
    { device: 'R2', part: 16, partName: 'R2 - Default Route', command: 'ip route 0.0.0.0 0.0.0.0 loopback 0', alternates: ['ip route 0.0.0.0 0.0.0.0 lo0'], description: 'Set default route to Internet', hint: 'Type "ip route 0.0.0.0 0.0.0.0 loopback 0"', xp: 20 },

    // R2 - NAT Configuration
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'access-list 1 permit 192.168.1.0 0.0.0.255', description: 'Create ACL for NAT', hint: 'Type "access-list 1 permit 192.168.1.0 0.0.0.255"', xp: 20 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'access-list 1 permit 10.67.1.0 0.0.0.255', description: 'Add second network', hint: 'Type "access-list 1 permit 10.67.1.0 0.0.0.255"', xp: 15 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'ip nat inside source list 1 interface loopback 0 overload', alternates: ['ip nat inside source list 1 int lo0 overload'], description: 'Enable PAT', hint: 'Type "ip nat inside source list 1 interface loopback 0 overload"', xp: 25 },

    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'interface g0/0/0', alternates: ['int g0/0/0'], description: 'Enter G0/0/0', hint: 'Type "interface g0/0/0"', xp: 5 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'ip nat inside', description: 'Set NAT inside', hint: 'Type "ip nat inside"', xp: 15 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'interface g0/0/1', alternates: ['int g0/0/1'], description: 'Enter G0/0/1', hint: 'Type "interface g0/0/1"', xp: 5 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'ip nat inside', description: 'Set NAT inside', hint: 'Type "ip nat inside"', xp: 15 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'interface loopback 0', alternates: ['int lo0'], description: 'Enter Loopback', hint: 'Type "interface loopback 0"', xp: 5 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'ip nat outside', description: 'Set NAT outside', hint: 'Type "ip nat outside"', xp: 15 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'exit', description: 'Exit loopback', hint: 'Type "exit"', xp: 5 },
    { device: 'R2', part: 17, partName: 'R2 - NAT Config', command: 'end', description: 'Lab Complete!', hint: 'Type "end"', xp: 10 },
];

// Lab metadata
export const ensaLab1Info = {
    title: 'Lab Activity 1',
    description: 'Configure Single-Area OSPFv2, NAT with PAT, and basic network settings',
    objectives: [
        'Part 1: Initialize and Configure Basic Device Settings',
        'Part 2: Configure Single Area OSPFv2',
        'Part 3: Configure NAT with PAT (overload)',
        'Part 4: Verify connectivity'
    ],
    devices: ['S1', 'S2', 'R1', 'R2'],
    topology: {
        routers: [
            { id: 'R1', interfaces: ['G0/0/0 (10.67.254.2/30)', 'G0/0/1 (192.168.1.1/24)', 'Lo0 (10.52.0.1/29)'] },
            { id: 'R2', interfaces: ['G0/0/0 (10.67.254.1/30)', 'G0/0/1 (10.67.1.1/24)', 'Lo0 (209.165.201.1/27)'] }
        ],
        switches: [
            { id: 'S1', interfaces: ['VLAN 99 (192.168.1.2/24)'], gateway: '192.168.1.1' },
            { id: 'S2', interfaces: ['VLAN 1 (10.67.1.2/24)'], gateway: '10.67.1.1' }
        ]
    }
};
