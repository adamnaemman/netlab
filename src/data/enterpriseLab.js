export const enterpriseLabData = {
    title: "Enterprise Networking Workshop",
    topology: "R1 -- S1 -- S2 -- R2",
    addressingTable: [
        { device: "R1", interface: "G0/0/1", ip: "10.53.0.1", mask: "255.255.255.0" },
        { device: "R1", interface: "Loopback1", ip: "172.16.1.1", mask: "255.255.255.0" },
        { device: "R2", interface: "G0/0/1", ip: "10.53.0.2", mask: "255.255.255.0" },
        { device: "R2", interface: "Loopback1", ip: "192.168.1.1", mask: "255.255.255.0" },
    ],
    taskSteps: {
        part1: "Cabling and Basic Settings",
        part2: "OSPFv2 Configuration",
        part3: "Optimization"
    }
};
