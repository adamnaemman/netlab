// SRWE v7.00 Complete Lab Steps - All commands from the official configuration scripts

export const labSteps = [
    // ========== ROUTER R1 - BASIC CONFIG ==========
    { device: 'R1', part: 1, partName: 'R1 - Basic Config', command: 'enable', description: 'Enter privileged EXEC mode', hint: 'Type "enable"', xp: 5 },
    { device: 'R1', part: 1, partName: 'R1 - Basic Config', command: 'configure terminal', alternates: ['conf t'], description: 'Enter global config mode', hint: 'Type "configure terminal"', xp: 5 },
    { device: 'R1', part: 1, partName: 'R1 - Basic Config', command: 'no ip domain-lookup', alternates: ['no ip domain lookup'], description: 'Disable DNS lookup', hint: 'Type "no ip domain-lookup"', xp: 5 },
    { device: 'R1', part: 1, partName: 'R1 - Basic Config', command: 'hostname R1', description: 'Set hostname to R1', hint: 'Type "hostname R1"', xp: 10 },
    { device: 'R1', part: 1, partName: 'R1 - Basic Config', command: 'banner motd #Unauthorized Access is Prohibited!#', alternates: ['banner motd #unauthorized access is prohibited!#'], description: 'Set MOTD banner', hint: 'Type "banner motd #Unauthorized Access is Prohibited!#"', xp: 10 },
    { device: 'R1', part: 1, partName: 'R1 - Basic Config', command: 'enable secret ciscoenpass', description: 'Set enable secret', hint: 'Type "enable secret ciscoenpass"', xp: 10 },
    { device: 'R1', part: 1, partName: 'R1 - Basic Config', command: 'service password-encryption', description: 'Encrypt passwords', hint: 'Type "service password-encryption"', xp: 5 },
    { device: 'R1', part: 1, partName: 'R1 - Basic Config', command: 'security passwords min-length 10', description: 'Set min password length', hint: 'Type "security passwords min-length 10"', xp: 10 },

    // R1 - Console Line
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'line console 0', alternates: ['line con 0'], description: 'Enter console line config', hint: 'Type "line console 0"', xp: 5 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'password ciscoconpass', description: 'Set console password', hint: 'Type "password ciscoconpass"', xp: 10 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'exit', description: 'Exit line config', hint: 'Type "exit"', xp: 5 },

    // R1 - SSH Config
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'username admin secret admin1pass', description: 'Create admin user', hint: 'Type "username admin secret admin1pass"', xp: 10 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'ip domain-name ccna-ptsa.com', alternates: ['ip domain name ccna-ptsa.com'], description: 'Set domain name for SSH', hint: 'Type "ip domain-name ccna-ptsa.com"', xp: 10 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'crypto key generate rsa', description: 'Generate RSA keys', hint: 'Type "crypto key generate rsa" then enter 1024', xp: 15 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: '1024', description: 'Set key modulus to 1024', hint: 'Enter "1024" for key size', xp: 5 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'ip ssh version 2', description: 'Set SSH version 2', hint: 'Type "ip ssh version 2"', xp: 10 },

    // R1 - VTY Lines
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'line vty 0 15', description: 'Enter VTY line config', hint: 'Type "line vty 0 15"', xp: 5 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'login local', description: 'Use local database for login', hint: 'Type "login local"', xp: 10 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'transport input ssh', description: 'Allow only SSH', hint: 'Type "transport input ssh"', xp: 10 },
    { device: 'R1', part: 2, partName: 'R1 - Console & VTY', command: 'exit', description: 'Exit VTY config', hint: 'Type "exit"', xp: 5 },

    // R1 - IPv6 & Loopback
    { device: 'R1', part: 3, partName: 'R1 - IPv6 & Loopback', command: 'ipv6 unicast-routing', description: 'Enable IPv6 routing', hint: 'Type "ipv6 unicast-routing"', xp: 15 },
    { device: 'R1', part: 3, partName: 'R1 - IPv6 & Loopback', command: 'interface Loopback0', alternates: ['int loopback0', 'int lo0', 'interface loopback 0'], description: 'Create Loopback0 interface', hint: 'Type "interface Loopback0"', xp: 10 },
    { device: 'R1', part: 3, partName: 'R1 - IPv6 & Loopback', command: 'ip address 209.165.201.1 255.255.255.224', description: 'Set Loopback IPv4 address', hint: 'IP: 209.165.201.1/27', xp: 15 },
    { device: 'R1', part: 3, partName: 'R1 - IPv6 & Loopback', command: 'ipv6 address 2001:db8:acad:209::1/64', description: 'Set Loopback IPv6 address', hint: 'Type "ipv6 address 2001:db8:acad:209::1/64"', xp: 15 },
    { device: 'R1', part: 3, partName: 'R1 - IPv6 & Loopback', command: 'exit', description: 'Exit interface config', hint: 'Type "exit"', xp: 5 },

    // R1 - Subinterfaces
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'interface g0/0/1.2', alternates: ['int g0/0/1.2'], description: 'Create subinterface for VLAN 2', hint: 'Type "interface g0/0/1.2"', xp: 10 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'encapsulation dot1Q 2', description: 'Set 802.1Q for VLAN 2', hint: 'Type "encapsulation dot1Q 2"', xp: 10 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'ip address 10.19.8.1 255.255.255.192', description: 'Set IPv4 for VLAN 2', hint: 'IP: 10.19.8.1/26', xp: 15 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'ipv6 address 2001:db8:acad:a::1/64', description: 'Set IPv6 for VLAN 2', hint: 'Type "ipv6 address 2001:db8:acad:a::1/64"', xp: 15 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'exit', description: 'Exit subinterface', hint: 'Type "exit"', xp: 5 },

    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'interface g0/0/1.3', alternates: ['int g0/0/1.3'], description: 'Create subinterface for VLAN 3', hint: 'Type "interface g0/0/1.3"', xp: 10 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'encapsulation dot1Q 3', description: 'Set 802.1Q for VLAN 3', hint: 'Type "encapsulation dot1Q 3"', xp: 10 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'ip address 10.19.8.65 255.255.255.224', description: 'Set IPv4 for VLAN 3', hint: 'IP: 10.19.8.65/27', xp: 15 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'ipv6 address 2001:db8:acad:b::1/64', description: 'Set IPv6 for VLAN 3', hint: 'Type "ipv6 address 2001:db8:acad:b::1/64"', xp: 15 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'exit', description: 'Exit subinterface', hint: 'Type "exit"', xp: 5 },

    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'interface g0/0/1.4', alternates: ['int g0/0/1.4'], description: 'Create subinterface for VLAN 4', hint: 'Type "interface g0/0/1.4"', xp: 10 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'encapsulation dot1Q 4', description: 'Set 802.1Q for VLAN 4', hint: 'Type "encapsulation dot1Q 4"', xp: 10 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'ip address 10.19.8.97 255.255.255.248', description: 'Set IPv4 for VLAN 4', hint: 'IP: 10.19.8.97/29', xp: 15 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'exit', description: 'Exit subinterface', hint: 'Type "exit"', xp: 5 },

    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'interface g0/0/1.6', alternates: ['int g0/0/1.6'], description: 'Create native VLAN subinterface', hint: 'Type "interface g0/0/1.6"', xp: 10 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'encapsulation dot1Q 6 native', description: 'Set native VLAN 6', hint: 'Type "encapsulation dot1Q 6 native"', xp: 15 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'exit', description: 'Exit subinterface', hint: 'Type "exit"', xp: 5 },

    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'interface g0/0/1', alternates: ['int g0/0/1'], description: 'Enter main interface', hint: 'Type "interface g0/0/1"', xp: 5 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'no shutdown', alternates: ['no shut'], description: 'Enable the interface', hint: 'Type "no shutdown"', xp: 10 },
    { device: 'R1', part: 4, partName: 'R1 - Subinterfaces', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    // R1 - DHCP Pools
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'ip dhcp excluded-address 10.19.8.1 10.19.8.52', description: 'Exclude addresses for pool A', hint: 'Type "ip dhcp excluded-address 10.19.8.1 10.19.8.52"', xp: 15 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'ip dhcp pool CCNA-A', description: 'Create DHCP pool CCNA-A', hint: 'Type "ip dhcp pool CCNA-A"', xp: 10 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'network 10.19.8.0 255.255.255.192', description: 'Set network for pool A', hint: 'Type "network 10.19.8.0 255.255.255.192"', xp: 15 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'default-router 10.19.8.1', description: 'Set default gateway for pool A', hint: 'Type "default-router 10.19.8.1"', xp: 15 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'exit', description: 'Exit DHCP pool config', hint: 'Type "exit"', xp: 5 },

    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'ip dhcp excluded-address 10.19.8.65 10.19.8.84', description: 'Exclude addresses for pool B', hint: 'Type "ip dhcp excluded-address 10.19.8.65 10.19.8.84"', xp: 15 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'ip dhcp pool CCNA-B', description: 'Create DHCP pool CCNA-B', hint: 'Type "ip dhcp pool CCNA-B"', xp: 10 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'network 10.19.8.64 255.255.255.224', description: 'Set network for pool B', hint: 'Type "network 10.19.8.64 255.255.255.224"', xp: 15 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'default-router 10.19.8.65', description: 'Set default gateway for pool B', hint: 'Type "default-router 10.19.8.65"', xp: 15 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'exit', description: 'Exit DHCP pool config', hint: 'Type "exit"', xp: 5 },
    { device: 'R1', part: 5, partName: 'R1 - DHCP Config', command: 'end', description: 'Return to privileged mode', hint: 'Type "end"', xp: 5 },

    // ========== SWITCH S1 ==========
    { device: 'S1', part: 6, partName: 'S1 - Basic Config', command: 'enable', description: 'Enter privileged mode', hint: 'Type "enable"', xp: 5 },
    { device: 'S1', part: 6, partName: 'S1 - Basic Config', command: 'configure terminal', alternates: ['conf t'], description: 'Enter global config', hint: 'Type "conf t"', xp: 5 },
    { device: 'S1', part: 6, partName: 'S1 - Basic Config', command: 'no ip domain-lookup', description: 'Disable DNS lookup', hint: 'Type "no ip domain-lookup"', xp: 5 },
    { device: 'S1', part: 6, partName: 'S1 - Basic Config', command: 'hostname S1', description: 'Set hostname', hint: 'Type "hostname S1"', xp: 10 },
    { device: 'S1', part: 6, partName: 'S1 - Basic Config', command: 'banner motd #Unauthorized Access is Prohibited!#', alternates: ['banner motd #unauthorized access is prohibited!#'], description: 'Set MOTD banner', hint: 'Type the banner command', xp: 10 },
    { device: 'S1', part: 6, partName: 'S1 - Basic Config', command: 'enable secret ciscoenpass', description: 'Set enable secret', hint: 'Type "enable secret ciscoenpass"', xp: 10 },
    { device: 'S1', part: 6, partName: 'S1 - Basic Config', command: 'service password-encryption', description: 'Encrypt passwords', hint: 'Type "service password-encryption"', xp: 5 },

    // S1 - Console
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'line console 0', alternates: ['line con 0'], description: 'Enter console config', hint: 'Type "line console 0"', xp: 5 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'password ciscoconpass', description: 'Set console password', hint: 'Type "password ciscoconpass"', xp: 10 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'exit', description: 'Exit console config', hint: 'Type "exit"', xp: 5 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'username admin secret admin1pass', description: 'Create admin user', hint: 'Type "username admin secret admin1pass"', xp: 10 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'ip domain-name ccna-ptsa.com', description: 'Set domain name', hint: 'Type "ip domain-name ccna-ptsa.com"', xp: 10 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'crypto key generate rsa', description: 'Generate RSA keys', hint: 'Type "crypto key generate rsa"', xp: 10 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: '1024', description: 'Key size 1024', hint: 'Enter "1024"', xp: 5 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'ip ssh version 2', description: 'Set SSH v2', hint: 'Type "ip ssh version 2"', xp: 10 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'line vty 0 15', description: 'Enter VTY config', hint: 'Type "line vty 0 15"', xp: 5 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'login local', description: 'Use local auth', hint: 'Type "login local"', xp: 10 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'transport input ssh', description: 'SSH only', hint: 'Type "transport input ssh"', xp: 10 },
    { device: 'S1', part: 7, partName: 'S1 - Console & SSH', command: 'exit', description: 'Exit VTY config', hint: 'Type "exit"', xp: 5 },

    // S1 - VLANs
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'vlan 2', description: 'Create VLAN 2', hint: 'Type "vlan 2"', xp: 10 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'name Bikes', description: 'Name VLAN 2', hint: 'Type "name Bikes"', xp: 5 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'vlan 3', description: 'Create VLAN 3', hint: 'Type "vlan 3"', xp: 10 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'name Trikes', description: 'Name VLAN 3', hint: 'Type "name Trikes"', xp: 5 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'vlan 4', description: 'Create VLAN 4', hint: 'Type "vlan 4"', xp: 10 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'name Management', description: 'Name VLAN 4', hint: 'Type "name Management"', xp: 5 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'vlan 5', description: 'Create VLAN 5', hint: 'Type "vlan 5"', xp: 10 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'name Parking', description: 'Name VLAN 5', hint: 'Type "name Parking"', xp: 5 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'vlan 6', description: 'Create VLAN 6', hint: 'Type "vlan 6"', xp: 10 },
    { device: 'S1', part: 8, partName: 'S1 - VLANs', command: 'name Native', description: 'Name VLAN 6', hint: 'Type "name Native"', xp: 5 },

    // S1 - SVI
    { device: 'S1', part: 9, partName: 'S1 - Management', command: 'interface vlan 4', alternates: ['int vlan 4'], description: 'Enter SVI config', hint: 'Type "interface vlan 4"', xp: 10 },
    { device: 'S1', part: 9, partName: 'S1 - Management', command: 'ip address 10.19.8.98 255.255.255.248', description: 'Set SVI IP', hint: 'IP: 10.19.8.98/29', xp: 15 },
    { device: 'S1', part: 9, partName: 'S1 - Management', command: 'no shutdown', alternates: ['no shut'], description: 'Enable SVI', hint: 'Type "no shutdown"', xp: 5 },
    { device: 'S1', part: 9, partName: 'S1 - Management', command: 'exit', description: 'Exit SVI', hint: 'Type "exit"', xp: 5 },
    { device: 'S1', part: 9, partName: 'S1 - Management', command: 'ip default-gateway 10.19.8.97', description: 'Set default gateway', hint: 'Type "ip default-gateway 10.19.8.97"', xp: 15 },

    // S1 - EtherChannel
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'interface range f0/1-2', alternates: ['int range f0/1-2'], description: 'Select F0/1-2', hint: 'Type "interface range f0/1-2"', xp: 10 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'switchport mode trunk', description: 'Set trunk mode', hint: 'Type "switchport mode trunk"', xp: 10 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'switchport trunk native vlan 6', description: 'Set native VLAN', hint: 'Type "switchport trunk native vlan 6"', xp: 10 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'switchport trunk allowed vlan 2,3,4,5,6', description: 'Allow VLANs', hint: 'Type "switchport trunk allowed vlan 2,3,4,5,6"', xp: 15 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'channel-group 1 mode active', description: 'Add to EtherChannel', hint: 'Type "channel-group 1 mode active"', xp: 15 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    // S1 - Port-Channel
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'interface port-channel 1', alternates: ['int port-channel 1', 'int po1'], description: 'Config Po1', hint: 'Type "interface port-channel 1"', xp: 10 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'switchport mode trunk', description: 'Set trunk mode', hint: 'Type "switchport mode trunk"', xp: 10 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'switchport trunk native vlan 6', description: 'Set native VLAN', hint: 'Type "switchport trunk native vlan 6"', xp: 10 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'switchport trunk allowed vlan 2,3,4,5,6', description: 'Allow VLANs', hint: 'Type "switchport trunk allowed vlan 2,3,4,5,6"', xp: 10 },
    { device: 'S1', part: 10, partName: 'S1 - EtherChannel', command: 'exit', description: 'Exit Po1', hint: 'Type "exit"', xp: 5 },

    // S1 - Trunk to R1
    { device: 'S1', part: 11, partName: 'S1 - Trunk F0/5', command: 'interface f0/5', alternates: ['int f0/5'], description: 'Config F0/5 to R1', hint: 'Type "interface f0/5"', xp: 10 },
    { device: 'S1', part: 11, partName: 'S1 - Trunk F0/5', command: 'switchport mode trunk', description: 'Set trunk mode', hint: 'Type "switchport mode trunk"', xp: 10 },
    { device: 'S1', part: 11, partName: 'S1 - Trunk F0/5', command: 'switchport trunk native vlan 6', description: 'Set native VLAN', hint: 'Type "switchport trunk native vlan 6"', xp: 10 },
    { device: 'S1', part: 11, partName: 'S1 - Trunk F0/5', command: 'switchport trunk allowed vlan 2,3,4,5,6', description: 'Allow VLANs', hint: 'Type "switchport trunk allowed vlan 2,3,4,5,6"', xp: 10 },
    { device: 'S1', part: 11, partName: 'S1 - Trunk F0/5', command: 'exit', description: 'Exit F0/5', hint: 'Type "exit"', xp: 5 },

    // S1 - Access Port F0/6
    { device: 'S1', part: 12, partName: 'S1 - Access F0/6', command: 'interface f0/6', alternates: ['int f0/6'], description: 'Config F0/6 for PC-A', hint: 'Type "interface f0/6"', xp: 10 },
    { device: 'S1', part: 12, partName: 'S1 - Access F0/6', command: 'switchport mode access', description: 'Set access mode', hint: 'Type "switchport mode access"', xp: 10 },
    { device: 'S1', part: 12, partName: 'S1 - Access F0/6', command: 'switchport access vlan 2', description: 'Assign VLAN 2', hint: 'Type "switchport access vlan 2"', xp: 10 },
    { device: 'S1', part: 12, partName: 'S1 - Access F0/6', command: 'switchport port-security', description: 'Enable port-security', hint: 'Type "switchport port-security"', xp: 15 },
    { device: 'S1', part: 12, partName: 'S1 - Access F0/6', command: 'switchport port-security maximum 3', description: 'Set max MAC 3', hint: 'Type "switchport port-security maximum 3"', xp: 10 },
    { device: 'S1', part: 12, partName: 'S1 - Access F0/6', command: 'exit', description: 'Exit F0/6', hint: 'Type "exit"', xp: 5 },

    // S1 - Unused Ports
    { device: 'S1', part: 13, partName: 'S1 - Unused Ports', command: 'interface range f0/3-4,f0/7-24,g0/1-2', alternates: ['int range f0/3-4,f0/7-24,g0/1-2'], description: 'Select unused ports', hint: 'Type "interface range f0/3-4,f0/7-24,g0/1-2"', xp: 10 },
    { device: 'S1', part: 13, partName: 'S1 - Unused Ports', command: 'switchport mode access', description: 'Set access mode', hint: 'Type "switchport mode access"', xp: 5 },
    { device: 'S1', part: 13, partName: 'S1 - Unused Ports', command: 'switchport access vlan 5', description: 'Assign to Parking', hint: 'Type "switchport access vlan 5"', xp: 10 },
    { device: 'S1', part: 13, partName: 'S1 - Unused Ports', command: 'shutdown', alternates: ['shut'], description: 'Shutdown ports', hint: 'Type "shutdown"', xp: 10 },
    { device: 'S1', part: 13, partName: 'S1 - Unused Ports', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },
    { device: 'S1', part: 13, partName: 'S1 - Unused Ports', command: 'end', description: 'Return to priv mode', hint: 'Type "end"', xp: 5 },

    // ========== SWITCH S2 ==========
    { device: 'S2', part: 14, partName: 'S2 - Basic Config', command: 'enable', description: 'Enter privileged mode', hint: 'Type "enable"', xp: 5 },
    { device: 'S2', part: 14, partName: 'S2 - Basic Config', command: 'configure terminal', alternates: ['conf t'], description: 'Enter global config', hint: 'Type "conf t"', xp: 5 },
    { device: 'S2', part: 14, partName: 'S2 - Basic Config', command: 'no ip domain-lookup', description: 'Disable DNS lookup', hint: 'Type "no ip domain-lookup"', xp: 5 },
    { device: 'S2', part: 14, partName: 'S2 - Basic Config', command: 'hostname S2', description: 'Set hostname', hint: 'Type "hostname S2"', xp: 10 },
    { device: 'S2', part: 14, partName: 'S2 - Basic Config', command: 'banner motd #Unauthorized Access is Prohibited!#', alternates: ['banner motd #unauthorized access is prohibited!#'], description: 'Set banner', hint: 'Type the banner command', xp: 10 },
    { device: 'S2', part: 14, partName: 'S2 - Basic Config', command: 'enable secret ciscoenpass', description: 'Set enable secret', hint: 'Type "enable secret ciscoenpass"', xp: 10 },
    { device: 'S2', part: 14, partName: 'S2 - Basic Config', command: 'service password-encryption', description: 'Encrypt passwords', hint: 'Type "service password-encryption"', xp: 5 },

    // S2 - Console & SSH
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'line console 0', alternates: ['line con 0'], description: 'Enter console config', hint: 'Type "line console 0"', xp: 5 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'password ciscoconpass', description: 'Set console password', hint: 'Type "password ciscoconpass"', xp: 10 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'login', description: 'Enable login', hint: 'Type "login"', xp: 5 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'exit', description: 'Exit console', hint: 'Type "exit"', xp: 5 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'username admin secret admin1pass', description: 'Create admin user', hint: 'Type "username admin secret admin1pass"', xp: 10 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'ip domain-name ccna-ptsa.com', description: 'Set domain name', hint: 'Type "ip domain-name ccna-ptsa.com"', xp: 10 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'crypto key generate rsa', description: 'Generate RSA keys', hint: 'Type "crypto key generate rsa"', xp: 10 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: '1024', description: 'Key size 1024', hint: 'Enter "1024"', xp: 5 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'ip ssh version 2', description: 'Set SSH v2', hint: 'Type "ip ssh version 2"', xp: 10 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'line vty 0 15', description: 'Enter VTY config', hint: 'Type "line vty 0 15"', xp: 5 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'login local', description: 'Use local auth', hint: 'Type "login local"', xp: 10 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'transport input ssh', description: 'SSH only', hint: 'Type "transport input ssh"', xp: 10 },
    { device: 'S2', part: 15, partName: 'S2 - Console & SSH', command: 'exit', description: 'Exit VTY', hint: 'Type "exit"', xp: 5 },

    // S2 - VLANs
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'vlan 2', description: 'Create VLAN 2', hint: 'Type "vlan 2"', xp: 10 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'name Bikes', description: 'Name VLAN 2', hint: 'Type "name Bikes"', xp: 5 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'vlan 3', description: 'Create VLAN 3', hint: 'Type "vlan 3"', xp: 10 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'name Trikes', description: 'Name VLAN 3', hint: 'Type "name Trikes"', xp: 5 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'vlan 4', description: 'Create VLAN 4', hint: 'Type "vlan 4"', xp: 10 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'name Management', description: 'Name VLAN 4', hint: 'Type "name Management"', xp: 5 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'vlan 5', description: 'Create VLAN 5', hint: 'Type "vlan 5"', xp: 10 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'name Parking', description: 'Name VLAN 5', hint: 'Type "name Parking"', xp: 5 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'vlan 6', description: 'Create VLAN 6', hint: 'Type "vlan 6"', xp: 10 },
    { device: 'S2', part: 16, partName: 'S2 - VLANs', command: 'name Native', description: 'Name VLAN 6', hint: 'Type "name Native"', xp: 5 },

    // S2 - SVI
    { device: 'S2', part: 17, partName: 'S2 - Management', command: 'interface vlan 4', alternates: ['int vlan 4'], description: 'Enter SVI config', hint: 'Type "interface vlan 4"', xp: 10 },
    { device: 'S2', part: 17, partName: 'S2 - Management', command: 'ip address 10.19.8.99 255.255.255.248', description: 'Set SVI IP', hint: 'IP: 10.19.8.99/29', xp: 15 },
    { device: 'S2', part: 17, partName: 'S2 - Management', command: 'no shutdown', alternates: ['no shut'], description: 'Enable SVI', hint: 'Type "no shutdown"', xp: 5 },
    { device: 'S2', part: 17, partName: 'S2 - Management', command: 'exit', description: 'Exit SVI', hint: 'Type "exit"', xp: 5 },
    { device: 'S2', part: 17, partName: 'S2 - Management', command: 'ip default-gateway 10.19.8.97', description: 'Set default gateway', hint: 'Type "ip default-gateway 10.19.8.97"', xp: 15 },

    // S2 - EtherChannel
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'interface range f0/1-2', alternates: ['int range f0/1-2'], description: 'Select F0/1-2', hint: 'Type "interface range f0/1-2"', xp: 10 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'switchport mode trunk', description: 'Set trunk mode', hint: 'Type "switchport mode trunk"', xp: 10 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'switchport trunk native vlan 6', description: 'Set native VLAN', hint: 'Type "switchport trunk native vlan 6"', xp: 10 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'switchport trunk allowed vlan 2,3,4,5,6', description: 'Allow VLANs', hint: 'Type "switchport trunk allowed vlan 2,3,4,5,6"', xp: 10 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'channel-group 1 mode active', description: 'Add to EtherChannel', hint: 'Type "channel-group 1 mode active"', xp: 15 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },

    // S2 - Port-Channel
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'interface port-channel 1', alternates: ['int port-channel 1', 'int po1'], description: 'Config Po1', hint: 'Type "interface port-channel 1"', xp: 10 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'switchport mode trunk', description: 'Set trunk mode', hint: 'Type "switchport mode trunk"', xp: 10 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'switchport trunk native vlan 6', description: 'Set native VLAN', hint: 'Type "switchport trunk native vlan 6"', xp: 10 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'switchport trunk allowed vlan 2,3,4,5,6', description: 'Allow VLANs', hint: 'Type "switchport trunk allowed vlan 2,3,4,5,6"', xp: 10 },
    { device: 'S2', part: 18, partName: 'S2 - EtherChannel', command: 'exit', description: 'Exit Po1', hint: 'Type "exit"', xp: 5 },

    // S2 - Access Port F0/18
    { device: 'S2', part: 19, partName: 'S2 - Access F0/18', command: 'interface f0/18', alternates: ['int f0/18'], description: 'Config F0/18 for PC-B', hint: 'Type "interface f0/18"', xp: 10 },
    { device: 'S2', part: 19, partName: 'S2 - Access F0/18', command: 'switchport mode access', description: 'Set access mode', hint: 'Type "switchport mode access"', xp: 10 },
    { device: 'S2', part: 19, partName: 'S2 - Access F0/18', command: 'switchport access vlan 3', description: 'Assign VLAN 3', hint: 'Type "switchport access vlan 3"', xp: 10 },
    { device: 'S2', part: 19, partName: 'S2 - Access F0/18', command: 'switchport port-security', description: 'Enable port-security', hint: 'Type "switchport port-security"', xp: 15 },
    { device: 'S2', part: 19, partName: 'S2 - Access F0/18', command: 'switchport port-security maximum 3', description: 'Set max MAC 3', hint: 'Type "switchport port-security maximum 3"', xp: 10 },
    { device: 'S2', part: 19, partName: 'S2 - Access F0/18', command: 'exit', description: 'Exit F0/18', hint: 'Type "exit"', xp: 5 },

    // S2 - Unused Ports
    { device: 'S2', part: 20, partName: 'S2 - Unused Ports', command: 'interface range f0/3-17,f0/19-24,g0/1-2', alternates: ['int range f0/3-17,f0/19-24,g0/1-2'], description: 'Select unused ports', hint: 'Type "interface range f0/3-17,f0/19-24,g0/1-2"', xp: 10 },
    { device: 'S2', part: 20, partName: 'S2 - Unused Ports', command: 'switchport mode access', description: 'Set access mode', hint: 'Type "switchport mode access"', xp: 5 },
    { device: 'S2', part: 20, partName: 'S2 - Unused Ports', command: 'switchport access vlan 5', description: 'Assign to Parking', hint: 'Type "switchport access vlan 5"', xp: 10 },
    { device: 'S2', part: 20, partName: 'S2 - Unused Ports', command: 'shutdown', alternates: ['shut'], description: 'Shutdown ports', hint: 'Type "shutdown"', xp: 10 },
    { device: 'S2', part: 20, partName: 'S2 - Unused Ports', command: 'exit', description: 'Exit interface', hint: 'Type "exit"', xp: 5 },
    { device: 'S2', part: 20, partName: 'S2 - Unused Ports', command: 'end', description: 'Complete config!', hint: 'Type "end"', xp: 5 },
];
