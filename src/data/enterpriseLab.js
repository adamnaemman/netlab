// Enterprise Networking Workshop - Complete Lab Data
// Extracted from official lab images - WITH PREREQUISITE COMMANDS

export const enterpriseLabData = {
    title: "Enterprise Networking Workshop",
    topology: "R1 -- S1 -- S2 -- R2",
    addressingTable: [
        { device: "R1", interface: "G0/0/1", ip: "10.53.0.1", mask: "255.255.255.0" },
        { device: "R1", interface: "Loopback1", ip: "172.16.1.1", mask: "255.255.255.0" },
        { device: "R2", interface: "G0/0/1", ip: "10.53.0.2", mask: "255.255.255.0" },
        { device: "R2", interface: "Loopback1", ip: "192.168.1.1", mask: "255.255.255.0" },
    ],
    objectives: [
        "Part 1: Build the Network and Configure Basic Device Settings",
        "Part 2: Configure and Verify Single-Area OSPFv2 for basic operation",
        "Part 3: Optimize and Verify the Single-Area OSPFv2 configuration"
    ],
    labSteps: [
        // ===================== PART 1: Basic Device Settings =====================
        // R1 Setup
        { id: 1, part: 1, step: '1', device: 'R1', command: 'enable', desc: 'Enter privileged EXEC mode on R1', xp: 3 },
        { id: 2, part: 1, step: '1', device: 'R1', command: 'configure terminal', alternates: ['conf t', 'config t'], desc: 'Enter global config mode on R1', xp: 3 },
        { id: 3, part: 1, step: '2a', device: 'R1', command: 'hostname R1', desc: 'Assign device name to R1', xp: 5 },
        { id: 4, part: 1, step: '2b', device: 'R1', command: 'no ip domain lookup', alternates: ['no ip domain-lookup'], desc: 'Disable DNS lookup on R1', xp: 5 },
        { id: 5, part: 1, step: '2c', device: 'R1', command: 'enable secret class', desc: 'Assign class as privileged EXEC password on R1', xp: 5 },
        { id: 6, part: 1, step: '2d', device: 'R1', command: 'line console 0', desc: 'Enter console line config on R1', xp: 3 },
        { id: 7, part: 1, step: '2d', device: 'R1', command: 'password cisco', desc: 'Set console password on R1', xp: 5 },
        { id: 8, part: 1, step: '2d', device: 'R1', command: 'login', desc: 'Enable login on R1 console', xp: 3 },
        { id: 9, part: 1, step: '2e', device: 'R1', command: 'line vty 0 4', desc: 'Enter VTY line config on R1', xp: 3 },
        { id: 10, part: 1, step: '2e', device: 'R1', command: 'password cisco', desc: 'Set VTY password on R1', xp: 5 },
        { id: 11, part: 1, step: '2e', device: 'R1', command: 'login', desc: 'Enable login on R1 VTY', xp: 3 },
        { id: 12, part: 1, step: '2f', device: 'R1', command: 'service password-encryption', desc: 'Encrypt plaintext passwords on R1', xp: 5 },
        { id: 13, part: 1, step: '2g', device: 'R1', command: 'banner motd $ Authorized Users Only! $', alternates: ['banner motd $Authorized Users Only!$', 'banner motd # Authorized Users Only! #'], desc: 'Create warning banner on R1', xp: 5 },
        { id: 14, part: 1, step: '2h', device: 'R1', command: 'end', desc: 'Return to privileged mode', xp: 2 },
        { id: 15, part: 1, step: '2h', device: 'R1', command: 'copy running-config startup-config', alternates: ['copy run start', 'wr', 'write'], desc: 'Save configuration on R1', xp: 10 },

        // R2 Setup
        { id: 16, part: 1, step: '1', device: 'R2', command: 'enable', desc: 'Enter privileged EXEC mode on R2', xp: 3 },
        { id: 17, part: 1, step: '1', device: 'R2', command: 'configure terminal', alternates: ['conf t', 'config t'], desc: 'Enter global config mode on R2', xp: 3 },
        { id: 18, part: 1, step: '2a', device: 'R2', command: 'hostname R2', desc: 'Assign device name to R2', xp: 5 },
        { id: 19, part: 1, step: '2b', device: 'R2', command: 'no ip domain lookup', alternates: ['no ip domain-lookup'], desc: 'Disable DNS lookup on R2', xp: 5 },
        { id: 20, part: 1, step: '2c', device: 'R2', command: 'enable secret class', desc: 'Assign class as privileged EXEC password on R2', xp: 5 },
        { id: 21, part: 1, step: '2d', device: 'R2', command: 'line console 0', desc: 'Enter console line config on R2', xp: 3 },
        { id: 22, part: 1, step: '2d', device: 'R2', command: 'password cisco', desc: 'Set console password on R2', xp: 5 },
        { id: 23, part: 1, step: '2d', device: 'R2', command: 'login', desc: 'Enable login on R2 console', xp: 3 },
        { id: 24, part: 1, step: '2e', device: 'R2', command: 'line vty 0 4', desc: 'Enter VTY line config on R2', xp: 3 },
        { id: 25, part: 1, step: '2e', device: 'R2', command: 'password cisco', desc: 'Set VTY password on R2', xp: 5 },
        { id: 26, part: 1, step: '2e', device: 'R2', command: 'login', desc: 'Enable login on R2 VTY', xp: 3 },
        { id: 27, part: 1, step: '2f', device: 'R2', command: 'service password-encryption', desc: 'Encrypt plaintext passwords on R2', xp: 5 },
        { id: 28, part: 1, step: '2g', device: 'R2', command: 'banner motd $ Authorized Users Only! $', alternates: ['banner motd $Authorized Users Only!$', 'banner motd # Authorized Users Only! #'], desc: 'Create warning banner on R2', xp: 5 },
        { id: 29, part: 1, step: '2h', device: 'R2', command: 'end', desc: 'Return to privileged mode', xp: 2 },
        { id: 30, part: 1, step: '2h', device: 'R2', command: 'copy running-config startup-config', alternates: ['copy run start', 'wr', 'write'], desc: 'Save configuration on R2', xp: 10 },

        // S1 Setup
        { id: 31, part: 1, step: '3', device: 'S1', command: 'enable', desc: 'Enter privileged EXEC mode on S1', xp: 3 },
        { id: 32, part: 1, step: '3', device: 'S1', command: 'configure terminal', alternates: ['conf t', 'config t'], desc: 'Enter global config mode on S1', xp: 3 },
        { id: 33, part: 1, step: '3a', device: 'S1', command: 'hostname S1', desc: 'Assign device name to S1', xp: 5 },
        { id: 34, part: 1, step: '3b', device: 'S1', command: 'no ip domain lookup', alternates: ['no ip domain-lookup'], desc: 'Disable DNS lookup on S1', xp: 5 },
        { id: 35, part: 1, step: '3c', device: 'S1', command: 'enable secret class', desc: 'Assign class as privileged EXEC password on S1', xp: 5 },
        { id: 36, part: 1, step: '3d', device: 'S1', command: 'line console 0', desc: 'Enter console line config on S1', xp: 3 },
        { id: 37, part: 1, step: '3d', device: 'S1', command: 'password cisco', desc: 'Set console password on S1', xp: 5 },
        { id: 38, part: 1, step: '3d', device: 'S1', command: 'login', desc: 'Enable login on S1 console', xp: 3 },
        { id: 39, part: 1, step: '3e', device: 'S1', command: 'line vty 0 15', desc: 'Enter VTY line config on S1', xp: 3 },
        { id: 40, part: 1, step: '3e', device: 'S1', command: 'password cisco', desc: 'Set VTY password on S1', xp: 5 },
        { id: 41, part: 1, step: '3e', device: 'S1', command: 'login', desc: 'Enable login on S1 VTY', xp: 3 },
        { id: 42, part: 1, step: '3f', device: 'S1', command: 'service password-encryption', desc: 'Encrypt plaintext passwords on S1', xp: 5 },
        { id: 43, part: 1, step: '3g', device: 'S1', command: 'banner motd $ Authorized Users Only! $', alternates: ['banner motd $Authorized Users Only!$'], desc: 'Create warning banner on S1', xp: 5 },
        { id: 44, part: 1, step: '3h', device: 'S1', command: 'end', desc: 'Return to privileged mode', xp: 2 },
        { id: 45, part: 1, step: '3h', device: 'S1', command: 'copy running-config startup-config', alternates: ['copy run start', 'wr', 'write'], desc: 'Save configuration on S1', xp: 10 },

        // S2 Setup
        { id: 46, part: 1, step: '3', device: 'S2', command: 'enable', desc: 'Enter privileged EXEC mode on S2', xp: 3 },
        { id: 47, part: 1, step: '3', device: 'S2', command: 'configure terminal', alternates: ['conf t', 'config t'], desc: 'Enter global config mode on S2', xp: 3 },
        { id: 48, part: 1, step: '3a', device: 'S2', command: 'hostname S2', desc: 'Assign device name to S2', xp: 5 },
        { id: 49, part: 1, step: '3b', device: 'S2', command: 'no ip domain lookup', alternates: ['no ip domain-lookup'], desc: 'Disable DNS lookup on S2', xp: 5 },
        { id: 50, part: 1, step: '3c', device: 'S2', command: 'enable secret class', desc: 'Assign class as privileged EXEC password on S2', xp: 5 },
        { id: 51, part: 1, step: '3d', device: 'S2', command: 'line console 0', desc: 'Enter console line config on S2', xp: 3 },
        { id: 52, part: 1, step: '3d', device: 'S2', command: 'password cisco', desc: 'Set console password on S2', xp: 5 },
        { id: 53, part: 1, step: '3d', device: 'S2', command: 'login', desc: 'Enable login on S2 console', xp: 3 },
        { id: 54, part: 1, step: '3e', device: 'S2', command: 'line vty 0 15', desc: 'Enter VTY line config on S2', xp: 3 },
        { id: 55, part: 1, step: '3e', device: 'S2', command: 'password cisco', desc: 'Set VTY password on S2', xp: 5 },
        { id: 56, part: 1, step: '3e', device: 'S2', command: 'login', desc: 'Enable login on S2 VTY', xp: 3 },
        { id: 57, part: 1, step: '3f', device: 'S2', command: 'service password-encryption', desc: 'Encrypt plaintext passwords on S2', xp: 5 },
        { id: 58, part: 1, step: '3g', device: 'S2', command: 'banner motd $ Authorized Users Only! $', alternates: ['banner motd $Authorized Users Only!$'], desc: 'Create warning banner on S2', xp: 5 },
        { id: 59, part: 1, step: '3h', device: 'S2', command: 'end', desc: 'Return to privileged mode', xp: 2 },
        { id: 60, part: 1, step: '3h', device: 'S2', command: 'copy running-config startup-config', alternates: ['copy run start', 'wr', 'write'], desc: 'Save configuration on S2', xp: 10 },

        // ===================== PART 2: OSPFv2 Configuration =====================
        // R1 Interface Configuration
        { id: 61, part: 2, step: '1', device: 'R1', command: 'configure terminal', alternates: ['conf t', 'config t'], desc: 'Enter global config mode on R1', xp: 3 },
        { id: 62, part: 2, step: '1a', device: 'R1', command: 'interface g0/0/1', alternates: ['int g0/0/1', 'interface gigabitethernet0/0/1'], desc: 'Enter interface G0/0/1 config on R1', xp: 3 },
        { id: 63, part: 2, step: '1a', device: 'R1', command: 'ip address 10.53.0.1 255.255.255.0', desc: 'Assign IP address to R1 G0/0/1', xp: 10 },
        { id: 64, part: 2, step: '1a', device: 'R1', command: 'no shutdown', alternates: ['no shut'], desc: 'Enable R1 G0/0/1 interface', xp: 3 },
        { id: 65, part: 2, step: '1a', device: 'R1', command: 'exit', desc: 'Exit interface config', xp: 2 },
        { id: 66, part: 2, step: '1a', device: 'R1', command: 'interface loopback 1', alternates: ['int lo1', 'interface loopback1', 'int loopback 1'], desc: 'Create Loopback 1 on R1', xp: 5 },
        { id: 67, part: 2, step: '1a', device: 'R1', command: 'ip address 172.16.1.1 255.255.255.0', desc: 'Assign IP to R1 Loopback 1', xp: 10 },
        { id: 68, part: 2, step: '1a', device: 'R1', command: 'exit', desc: 'Exit interface config', xp: 2 },

        // R2 Interface Configuration
        { id: 69, part: 2, step: '1', device: 'R2', command: 'configure terminal', alternates: ['conf t', 'config t'], desc: 'Enter global config mode on R2', xp: 3 },
        { id: 70, part: 2, step: '1a', device: 'R2', command: 'interface g0/0/1', alternates: ['int g0/0/1'], desc: 'Enter interface G0/0/1 config on R2', xp: 3 },
        { id: 71, part: 2, step: '1a', device: 'R2', command: 'ip address 10.53.0.2 255.255.255.0', desc: 'Assign IP address to R2 G0/0/1', xp: 10 },
        { id: 72, part: 2, step: '1a', device: 'R2', command: 'no shutdown', alternates: ['no shut'], desc: 'Enable R2 G0/0/1 interface', xp: 3 },
        { id: 73, part: 2, step: '1a', device: 'R2', command: 'exit', desc: 'Exit interface config', xp: 2 },
        { id: 74, part: 2, step: '1a', device: 'R2', command: 'interface loopback 1', alternates: ['int lo1', 'interface loopback1', 'int loopback 1'], desc: 'Create Loopback 1 on R2', xp: 5 },
        { id: 75, part: 2, step: '1a', device: 'R2', command: 'ip address 192.168.1.1 255.255.255.0', desc: 'Assign IP to R2 Loopback 1', xp: 10 },
        { id: 76, part: 2, step: '1a', device: 'R2', command: 'exit', desc: 'Exit interface config', xp: 2 },

        // OSPF Configuration
        { id: 77, part: 2, step: '1b', device: 'R1', command: 'router ospf 56', desc: 'Enter OSPF config mode on R1', xp: 10 },
        { id: 78, part: 2, step: '1c', device: 'R1', command: 'router-id 1.1.1.1', desc: 'Configure static router ID on R1', xp: 10 },
        { id: 79, part: 2, step: '1d', device: 'R1', command: 'network 10.53.0.0 0.0.0.255 area 0', desc: 'Configure network statement on R1', xp: 15 },
        { id: 80, part: 2, step: '1b', device: 'R2', command: 'router ospf 56', desc: 'Enter OSPF config mode on R2', xp: 10 },
        { id: 81, part: 2, step: '1c', device: 'R2', command: 'router-id 2.2.2.2', desc: 'Configure static router ID on R2', xp: 10 },
        { id: 82, part: 2, step: '1d', device: 'R2', command: 'network 10.53.0.0 0.0.0.255 area 0', desc: 'Configure network statement on R2', xp: 15 },

        // ===================== PART 3: Optimize OSPFv2 =====================
        // Step 1a: OSPF Priority on R1
        { id: 83, part: 3, step: '1a', device: 'R1', command: 'interface g0/0/1', alternates: ['int g0/0/1'], desc: 'Enter interface G0/0/1 config on R1', xp: 3 },
        { id: 84, part: 3, step: '1a', device: 'R1', command: 'ip ospf priority 50', desc: 'Set OSPF priority to 50 on R1 G0/0/1', xp: 10 },
        // Step 1b: OSPF Hello Timer
        { id: 85, part: 3, step: '1b', device: 'R1', command: 'ip ospf hello-interval 30', desc: 'Set OSPF hello interval to 30 on R1', xp: 10 },
        { id: 86, part: 3, step: '1b', device: 'R2', command: 'interface g0/0/1', alternates: ['int g0/0/1'], desc: 'Enter interface G0/0/1 config on R2', xp: 3 },
        { id: 87, part: 3, step: '1b', device: 'R2', command: 'ip ospf hello-interval 30', desc: 'Set OSPF hello interval to 30 on R2', xp: 10 },
        // Step 1c: Default route and propagate
        { id: 88, part: 3, step: '1c', device: 'R1', command: 'exit', desc: 'Exit interface config', xp: 2 },
        { id: 89, part: 3, step: '1c', device: 'R1', command: 'ip route 0.0.0.0 0.0.0.0 loopback 1', alternates: ['ip route 0.0.0.0 0.0.0.0 loopack 1'], desc: 'Configure default static route on R1', xp: 15 },
        { id: 90, part: 3, step: '1c', device: 'R1', command: 'router ospf 56', desc: 'Enter OSPF config mode on R1', xp: 5 },
        { id: 91, part: 3, step: '1c', device: 'R1', command: 'default-information originate', desc: 'Propagate default route into OSPF', xp: 15 },
        // Step 1d: Point-to-point on R2 Loopback
        { id: 92, part: 3, step: '1d', device: 'R2', command: 'exit', desc: 'Exit interface config', xp: 2 },
        { id: 93, part: 3, step: '1d', device: 'R2', command: 'interface loopback 1', alternates: ['int lo1'], desc: 'Enter Loopback 1 config on R2', xp: 3 },
        { id: 94, part: 3, step: '1d', device: 'R2', command: 'ip ospf network point-to-point', desc: 'Configure OSPF network type as point-to-point', xp: 10 },
        { id: 95, part: 3, step: '1d', device: 'R2', command: 'exit', desc: 'Exit interface config', xp: 2 },
        // Step 1e: Passive interface & R2 Loopback in OSPF
        { id: 96, part: 3, step: '1e', device: 'R2', command: 'router ospf 56', desc: 'Enter OSPF config mode on R2', xp: 5 },
        { id: 97, part: 3, step: '1e', device: 'R2', command: 'network 192.168.1.0 0.0.0.255 area 0', desc: 'Advertise R2 Loopback 1 into OSPF area 0', xp: 10 },
        { id: 98, part: 3, step: '1e', device: 'R2', command: 'passive-interface loopback 1', alternates: ['passive-interface loopback1', 'passive-interface lo1'], desc: 'Configure passive interface on R2 Loopback 1', xp: 10 },
        // Step 1f: Reference bandwidth
        { id: 99, part: 3, step: '1f', device: 'R1', command: 'router ospf 56', desc: 'Enter OSPF config mode on R1', xp: 3 },
        { id: 100, part: 3, step: '1f', device: 'R1', command: 'auto-cost reference-bandwidth 1000', desc: 'Change reference bandwidth to 1Gbps on R1', xp: 15 },
        { id: 101, part: 3, step: '1f', device: 'R1', command: 'end', desc: 'Return to privileged mode', xp: 2 },
        { id: 102, part: 3, step: '1f', device: 'R1', command: 'clear ip ospf process', desc: 'Clear OSPF process on R1', xp: 5 },
        { id: 103, part: 3, step: '1f', device: 'R2', command: 'router ospf 56', desc: 'Enter OSPF config mode on R2', xp: 3 },
        { id: 104, part: 3, step: '1f', device: 'R2', command: 'auto-cost reference-bandwidth 1000', desc: 'Change reference bandwidth to 1Gbps on R2', xp: 15 },
        { id: 105, part: 3, step: '1f', device: 'R2', command: 'end', desc: 'Return to privileged mode', xp: 2 },
        { id: 106, part: 3, step: '1f', device: 'R2', command: 'clear ip ospf process', desc: 'Clear OSPF process on R2', xp: 5 },
        // Verification commands
        { id: 107, part: 3, step: '1g', device: 'R1', command: 'show ip ospf neighbor', alternates: ['sh ip ospf neighbor'], desc: 'Verify OSPF adjacency on R1', xp: 10 },
        { id: 108, part: 3, step: '1h', device: 'R1', command: 'ping 192.168.1.1', desc: 'Ping R2 Loopback 1 from R1', xp: 10 },
        { id: 109, part: 3, step: '2a', device: 'R1', command: 'show ip ospf interface g0/0/1', alternates: ['sh ip ospf int g0/0/1'], desc: 'Verify OSPF interface settings on R1', xp: 10 },
        { id: 110, part: 3, step: '2b', device: 'R1', command: 'show ip route ospf', alternates: ['sh ip route ospf'], desc: 'Verify OSPF routes on R1', xp: 10 },
        { id: 111, part: 3, step: '2c', device: 'R2', command: 'show ip route ospf', alternates: ['sh ip route ospf'], desc: 'Verify OSPF routes on R2', xp: 10 },
        { id: 112, part: 3, step: '2d', device: 'R2', command: 'ping 172.16.1.1', desc: 'Ping R1 Loopback 1 from R2', xp: 10 },
    ]
};

export const totalXP = enterpriseLabData.labSteps.reduce((sum, s) => sum + s.xp, 0);
export const totalSteps = enterpriseLabData.labSteps.length;
