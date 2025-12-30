export const enterpriseLabData = {
    title: "Enterprise Networking Workshop",
    topology: "R1 -- S1 -- S2 -- R2",
    addressingTable: [
        { device: "R1", interface: "G0/0/1", ip: "10.53.0.1", mask: "255.255.255.0" },
        { device: "R1", interface: "Loopback1", ip: "172.16.1.1", mask: "255.255.255.0" },
        { device: "R2", interface: "G0/0/1", ip: "10.53.0.2", mask: "255.255.255.0" },
        { device: "R2", interface: "Loopback1", ip: "192.168.1.1", mask: "255.255.255.0" },
    ],
    taskSteps: [
        { id: 'h-r1', part: 'Part 1', title: 'Hostname R1', device: 'R1', command: 'hostname R1', desc: 'Assign device name to R1' },
        { id: 'h-r2', part: 'Part 1', title: 'Hostname R2', device: 'R2', command: 'hostname R2', desc: 'Assign device name to R2' },
        { id: 'dns-r1', part: 'Part 1', title: 'Disable DNS R1', device: 'R1', command: 'no ip domain-lookup', desc: 'Disable DNS lookup' },
        { id: 'sec-r1', part: 'Part 1', title: 'Enable Secret R1', device: 'R1', command: 'enable secret class', desc: 'Assign class as privileged password' },
        { id: 'con-p-r1', part: 'Part 1', title: 'Console Pass R1', device: 'R1', command: 'password cisco', desc: 'Assign cisco as console password' },
        { id: 'int-g1-r1', part: 'Part 2', title: 'IP Interface R1', device: 'R1', command: 'ip address 10.53.0.1 255.255.255.0', desc: 'Configure G0/0/1 address' },
        { id: 'ospf-r1', part: 'Part 2', title: 'Router OSPF R1', device: 'R1', command: 'router ospf 56', desc: 'Enter OSPF configuration mode' },
        { id: 'rid-r1', part: 'Part 2', title: 'Router ID R1', device: 'R1', command: 'router-id 1.1.1.1', desc: 'Configure static router ID' },
        { id: 'net-r1', part: 'Part 2', title: 'Network OSPF R1', device: 'R1', command: 'network 10.53.0.0 0.0.0.255 area 0', desc: 'Configure network statement' },
    ]
};
