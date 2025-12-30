import { useState, useRef, useEffect } from 'react';
import { labSteps } from '../data/labSteps';
import { getExplanation } from '../data/commandExplanations';

const LabActivity = ({ onClose, onComplete }) => {
    const [currentDevice, setCurrentDevice] = useState('R1');
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [terminalHistory, setTerminalHistory] = useState({
        R1: [{ type: 'output', text: 'Router>' }],
        S1: [{ type: 'output', text: 'Switch>' }],
        S2: [{ type: 'output', text: 'Switch>' }]
    });
    const [deviceModes, setDeviceModes] = useState({
        R1: 'user',
        S1: 'user',
        S2: 'user'
    });
    const [deviceHostnames, setDeviceHostnames] = useState({
        R1: 'Router',
        S1: 'Switch',
        S2: 'Switch'
    });
    const [input, setInput] = useState('');
    const [xpEarned, setXpEarned] = useState(0);
    // Command history untuk setiap device (macam Packet Tracer)
    const [commandHistory, setCommandHistory] = useState({
        R1: [],
        S1: [],
        S2: []
    });
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [expandedReference, setExpandedReference] = useState(null);
    const [copiedDevice, setCopiedDevice] = useState(null);
    const [zoom, setZoom] = useState(1);


    const desktopTerminalRef = useRef(null);
    const mobileTerminalRef = useRef(null);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const topologyContainerRef = useRef(null);


    const currentStepData = labSteps[currentStep];
    const totalSteps = labSteps.length;
    const progress = (completedSteps.length / totalSteps) * 100;
    const totalXP = labSteps.reduce((sum, s) => sum + s.xp, 0);

    const deviceConfigs = {
        R1: `enable
configure terminal
no ip domain-lookup
hostname R1
banner motd #Unauthorized Access is Prohibited!#
enable secret ciscoenpass
service password-encryption
security passwords min-length 10
line console 0
 password ciscoconpass
 login
 exit
username admin secret admin1pass
ip domain-name ccna-ptsa.com
crypto key generate rsa
 1024

ip ssh version 2
line vty 0 15
 login local
 transport input ssh
 exit
ipv6 unicast-routing
interface Loopback0
 ip address 209.165.201.1 255.255.255.224
 ipv6 address 2001:db8:acad:209::1/64
exit
interface g0/0/1.2
 encapsulation dot1Q 2
 ip address 10.19.8.1 255.255.255.192
 ipv6 address 2001:db8:acad:a::1/64
exit
interface g0/0/1.3
 encapsulation dot1Q 3
 ip address 10.19.8.65 255.255.255.224
 ipv6 address 2001:db8:acad:b::1/64
exit
interface g0/0/1.4
 encapsulation dot1Q 4
 ip address 10.19.8.97 255.255.255.248
exit
interface g0/0/1.6
 encapsulation dot1Q 6 native
exit
interface g0/0/1
 no shutdown
exit
ip dhcp excluded-address 10.19.8.1 10.19.8.52
ip dhcp pool CCNA-A
 network 10.19.8.0 255.255.255.192
 default-router 10.19.8.1
exit
ip dhcp excluded-address 10.19.8.65 10.19.8.84
ip dhcp pool CCNA-B
 network 10.19.8.64 255.255.255.224
 default-router 10.19.8.65
exit
end`,
        S1: `enable
configure terminal
no ip domain-lookup
hostname S1
banner motd #Unauthorized Access is Prohibited!#
enable secret ciscoenpass
service password-encryption
line console 0
 password ciscoconpass
 login
 exit
username admin secret admin1pass
ip domain-name ccna-ptsa.com
crypto key generate rsa
 1024
ip ssh version 2
line vty 0 15
 login local
 transport input ssh
 exit
vlan 2
 name Bikes
vlan 3
 name Trikes
vlan 4
 name Management
vlan 5
 name Parking
vlan 6
 name Native
interface vlan 4
 ip address 10.19.8.98 255.255.255.248
 no shutdown
exit
ip default-gateway 10.19.8.97
interface range f0/1-2
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
 channel-group 1 mode active
exit
interface port-channel 1
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
exit
interface f0/5
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
exit
interface f0/6
 switchport mode access
 switchport access vlan 2
 switchport port-security
 switchport port-security maximum 3
exit
interface range f0/3-4,f0/7-24,g0/1-2
 switchport mode access
 switchport access vlan 5
 shutdown
exit
end`,
        S2: `enable
configure terminal
no ip domain-lookup
hostname S2
banner motd #Unauthorized Access is Prohibited!#
enable secret ciscoenpass
service password-encryption
line console 0
 password ciscoconpass
 login
 exit
username admin secret admin1pass
ip domain-name ccna-ptsa.com
crypto key generate rsa
 1024
ip ssh version 2
line vty 0 15
 login local
 transport input ssh
 exit
vlan 2
 name Bikes
vlan 3
 name Trikes
vlan 4
 name Management
vlan 5
 name Parking
vlan 6
 name Native
interface vlan 4
 ip address 10.19.8.99 255.255.255.248
 no shutdown
exit
ip default-gateway 10.19.8.97
interface range f0/1-2
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
 channel-group 1 mode active
exit
interface port-channel 1
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
exit
interface f0/18
 switchport mode access
 switchport access vlan 3
 switchport port-security
 switchport port-security maximum 3
exit
interface range f0/3-17,f0/19-24,g0/1-2
 switchport mode access
 switchport access vlan 5
 shutdown
exit
end`
    };

    const copyConfig = (text, device) => {
        navigator.clipboard.writeText(text);
        setCopiedDevice(device);
        setTimeout(() => setCopiedDevice(null), 2000);
    };


    // Get device prompt based on mode (sama macam Cisco Packet Tracer)
    const getPrompt = (device) => {
        const hostname = deviceHostnames[device];
        const mode = deviceModes[device];
        switch (mode) {
            case 'user': return `${hostname}>`;
            case 'privileged': return `${hostname}#`;
            case 'config': return `${hostname}(config)#`;
            case 'interface': return `${hostname}(config-if)#`;
            case 'interface-range': return `${hostname}(config-if-range)#`;
            case 'subinterface': return `${hostname}(config-subif)#`;
            case 'vlan': return `${hostname}(config-vlan)#`;
            case 'line': return `${hostname}(config-line)#`;
            case 'router': return `${hostname}(config-router)#`;
            case 'dhcp': return `${hostname}(dhcp-config)#`;
            default: return `${hostname}>`;
        }
    };

    // Check if command matches expected
    const checkCommand = (inputCmd, expectedCmd, alternates = []) => {
        const normalizedInput = inputCmd.trim().toLowerCase();
        const normalizedExpected = expectedCmd.toLowerCase();

        if (normalizedInput === normalizedExpected) return true;
        if (alternates && alternates.some(alt => normalizedInput === alt.toLowerCase())) return true;

        return false;
    };

    // Handle command submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const step = labSteps[currentStep];
        const device = currentDevice;
        const prompt = getPrompt(device);
        const typedCommand = input.trim();

        // Simpan command ke history (untuk up arrow)
        setCommandHistory(prev => ({
            ...prev,
            [device]: [...prev[device], typedCommand]
        }));
        setHistoryIndex(-1); // Reset history index

        // Add command to terminal display
        setTerminalHistory(prev => ({
            ...prev,
            [device]: [...prev[device], { type: 'input', text: `${prompt} ${input}` }]
        }));

        // Check if correct device
        if (device !== step.device) {
            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], {
                    type: 'error',
                    text: `⚠️ Switch to ${step.device} to continue the lab`
                }]
            }));
            setInput('');
            return;
        }

        // Check command
        if (checkCommand(input, step.command, step.alternates)) {
            // Correct command!
            let newMode = deviceModes[device];
            let newHostname = deviceHostnames[device];

            // Update mode based on command
            // Update mode based on command (sama macam Cisco Packet Tracer)
            if (input.toLowerCase() === 'enable') {
                newMode = 'privileged';
            } else if (input.toLowerCase().match(/^conf(?:igure)?\s*t(?:erminal)?$/)) {
                newMode = 'config';
            } else if (input.toLowerCase().match(/^line\s+(console|con|vty)\s+/)) {
                // line console 0 atau line vty 0 15
                newMode = 'line';
            } else if (input.toLowerCase().match(/^int(?:erface)?\s+range\s+/)) {
                // interface range f0/1-2
                newMode = 'interface-range';
            } else if (input.toLowerCase().match(/^int(?:erface)?\s+/)) {
                if (input.toLowerCase().includes('.')) {
                    newMode = 'subinterface';
                } else {
                    newMode = 'interface';
                }
            } else if (input.toLowerCase().match(/^vlan\s+\d+$/)) {
                newMode = 'vlan';
            } else if (input.toLowerCase().match(/^ip\s+dhcp\s+pool\s+/)) {
                // ip dhcp pool CCNA-A
                newMode = 'dhcp';
            } else if (input.toLowerCase() === 'exit') {
                // Exit keluar dari current mode ke parent mode
                if (['vlan', 'interface', 'subinterface', 'interface-range', 'line', 'dhcp'].includes(newMode)) {
                    newMode = 'config';
                } else if (newMode === 'config') {
                    newMode = 'privileged';
                }
            } else if (input.toLowerCase() === 'end') {
                newMode = 'privileged';
            } else if (input.toLowerCase().match(/^hostname\s+(\S+)$/)) {
                newHostname = input.split(/\s+/)[1];
            }

            setDeviceModes(prev => ({ ...prev, [device]: newMode }));
            setDeviceHostnames(prev => ({ ...prev, [device]: newHostname }));
            setXpEarned(prev => prev + step.xp);

            // Success feedback
            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], {
                    type: 'success',
                    text: `✅ Correct! +${step.xp} XP`
                }]
            }));

            setCompletedSteps(prev => [...prev, currentStep]);

            // Move to next step
            if (currentStep < totalSteps - 1) {
                const nextStep = labSteps[currentStep + 1];
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                    if (nextStep.device !== device) {
                        setCurrentDevice(nextStep.device);
                    }
                }, 300);
            }
        } else {
            // Wrong command
            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], {
                    type: 'error',
                    text: `❌ Incorrect command. Check the hint below.`
                }]
            }));
        }

        setInput('');
    };

    // Auto-scroll terminal supaya input line sentiasa visible
    const scrollToBottom = () => {
        // Scroll desktop terminal
        if (desktopTerminalRef.current) {
            desktopTerminalRef.current.scrollTop = desktopTerminalRef.current.scrollHeight;
        }
        // Scroll mobile terminal
        if (mobileTerminalRef.current) {
            mobileTerminalRef.current.scrollTop = mobileTerminalRef.current.scrollHeight;
        }
    };

    // Scroll setiap kali history berubah atau device tukar
    useEffect(() => {
        scrollToBottom();
        // Scroll lagi selepas delay untuk pastikan DOM dah update
        const timer = setTimeout(scrollToBottom, 50);
        return () => clearTimeout(timer);
    }, [terminalHistory, currentDevice]);

    // Focus input bila tukar device
    useEffect(() => {
        inputRef.current?.focus();
        scrollToBottom();
    }, [currentDevice]);

    // Scroll bila input dapat focus
    const handleInputFocus = () => {
        scrollToBottom();
    };

    // Handle up/down arrow untuk command history (macam Packet Tracer)
    const handleKeyDown = (e) => {
        const history = commandHistory[currentDevice];

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;

            // Tekan up arrow - pergi ke command sebelumnya
            const newIndex = historyIndex === -1
                ? history.length - 1
                : Math.max(0, historyIndex - 1);

            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (history.length === 0 || historyIndex === -1) return;

            // Tekan down arrow - pergi ke command seterusnya
            const newIndex = historyIndex + 1;

            if (newIndex >= history.length) {
                // Dah sampai paling baru, clear input
                setHistoryIndex(-1);
                setInput('');
            } else {
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            }
        }
    };

    const deviceColors = {
        R1: '#58cc02',
        S1: '#1cb0f6',
        S2: '#ff9600'
    };

    const isLabComplete = currentStep >= totalSteps - 1 && completedSteps.includes(totalSteps - 1);

    useEffect(() => {
        const container = topologyContainerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0d1117' }}>
            {/* Header - Like GameHeader */}
            <div
                className="flex items-center justify-between px-4 py-3"
                style={{ backgroundColor: '#161b22', borderBottom: '3px solid #30363d' }}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all active:scale-95"
                        style={{ backgroundColor: '#21262d', color: '#8b949e' }}
                    >
                        ←
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🧪</span>
                        <div>
                            <h1 className="font-black" style={{ color: '#c9d1d9' }}>Lab Activity 2</h1>
                            <p className="text-xs" style={{ color: '#8b949e' }}>Inter-VLAN Routing Configuration</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-xs" style={{ color: '#8b949e' }}>Progress</p>
                        <p className="font-bold" style={{ color: '#58cc02' }}>{completedSteps.length}/{totalSteps}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs" style={{ color: '#8b949e' }}>XP Earned</p>
                        <p className="font-bold" style={{ color: '#ffc800' }}>⚡ {xpEarned}</p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2" style={{ backgroundColor: '#30363d' }}>
                <div
                    className="h-full transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #58cc02, #1cb0f6, #ff9600)'
                    }}
                />
            </div>

            {/* Main Layout - Desktop */}
            <div className="hidden lg:flex flex-1 overflow-hidden">
                {/* Left Side: Topology + Terminal */}
                <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
                    {/* Network Topology */}
                    <div
                        ref={topologyContainerRef}
                        className="rounded-xl p-4 flex-shrink-0"
                        style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold" style={{ color: '#c9d1d9' }}>
                                🗺️ Network Topology
                            </h3>
                            <div className="flex gap-4 items-center">
                                <div className="flex bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden mr-2">
                                    <button
                                        onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                                        className="px-2 py-1 hover:bg-[#30363d] text-[#8b949e] border-r border-[#30363d] transition-colors"
                                        title="Zoom In"
                                    >
                                        ➕
                                    </button>
                                    <button
                                        onClick={() => setZoom(1)}
                                        className="px-2 py-1 hover:bg-[#30363d] text-[#8b949e] border-r border-[#30363d] transition-colors text-[10px] font-bold"
                                        title="Reset Zoom"
                                    >
                                        RESET
                                    </button>
                                    <button
                                        onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                                        className="px-2 py-1 hover:bg-[#30363d] text-[#8b949e] transition-colors"
                                        title="Zoom Out"
                                    >
                                        ➖
                                    </button>
                                </div>
                                <div className="text-[10px] py-1 px-3 rounded-md border border-[#30363d] bg-black/30" style={{ color: '#8b949e' }}>
                                    <span className="font-bold" style={{ color: '#58a6ff' }}>{currentDevice}</span> is Active
                                </div>
                            </div>
                        </div>

                        <div className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#30363d]" style={{ maxHeight: '220px' }}>
                            <svg
                                viewBox="0 0 500 300"
                                className="w-full h-auto transition-transform duration-200 origin-top"
                                style={{
                                    maxHeight: zoom > 1 ? 'none' : '220px',
                                    transform: `scale(${zoom})`,
                                    cursor: zoom > 1 ? 'move' : 'default'
                                }}
                            >

                                {/* Connection Lines */}
                                {/* R1 to S1 (G0/0/1 to F0/5) */}
                                <line x1="250" y1="70" x2="150" y2="130" stroke={completedSteps.length >= 21 ? '#3fb950' : '#30363d'} strokeWidth="3" />
                                <text x="185" y="95" fill="#8b949e" fontSize="9">G0/0/1</text>
                                <text x="150" y="120" fill="#8b949e" fontSize="9">F0/5</text>

                                {/* S1 to S2 (F0/1-2 EtherChannel) */}
                                <line x1="190" y1="160" x2="310" y2="160" stroke="#30363d" strokeWidth="4" />
                                <line x1="190" y1="165" x2="310" y2="165" stroke="#30363d" strokeWidth="4" />
                                <text x="235" y="180" fill="#8b949e" fontSize="9">F0/1-2</text>

                                {/* S1 to PC-A (F0/6) */}
                                <line x1="120" y1="180" x2="80" y2="240" stroke={completedSteps.length >= 44 ? '#3fb950' : '#30363d'} strokeWidth="3" />
                                <text x="85" y="210" fill="#8b949e" fontSize="9">F0/6</text>

                                {/* S2 to PC-B (F0/18) */}
                                <line x1="380" y1="180" x2="420" y2="240" stroke={completedSteps.length >= 57 ? '#3fb950' : '#30363d'} strokeWidth="3" />
                                <text x="395" y="210" fill="#8b949e" fontSize="9">F0/18</text>

                                {/* R1 Router with Loopback */}
                                <g transform="translate(250, 45)" onClick={() => setCurrentDevice('R1')} style={{ cursor: 'pointer' }}>
                                    {currentStepData?.device === 'R1' && (
                                        <rect x="-52" y="-28" width="104" height="56" rx="12" fill="none" stroke="#58a6ff" strokeWidth="2" opacity="0.5" />
                                    )}
                                    <rect x="-48" y="-24" width="96" height="48" rx="10" fill={currentDevice === 'R1' ? '#58a6ff' : deviceColors.R1} />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{deviceHostnames.R1}</text>
                                    <text x="0" y="-32" textAnchor="middle" fill={currentDevice === 'R1' ? '#58a6ff' : '#8b949e'} fontSize="10">ROUTER</text>
                                    {/* Loopback indicator */}
                                    <circle cx="55" cy="-10" r="12" fill="#0d1117" stroke="#8b949e" strokeWidth="2" />
                                    <text x="55" y="-6" textAnchor="middle" fill="#8b949e" fontSize="8">Lo0</text>
                                </g>

                                {/* S1 Switch */}
                                <g transform="translate(150, 155)" onClick={() => setCurrentDevice('S1')} style={{ cursor: 'pointer' }}>
                                    {currentStepData?.device === 'S1' && (
                                        <rect x="-58" y="-23" width="116" height="46" rx="8" fill="none" stroke="#58a6ff" strokeWidth="2" opacity="0.5" />
                                    )}
                                    <rect x="-54" y="-19" width="108" height="38" rx="6" fill={currentDevice === 'S1' ? '#58a6ff' : deviceColors.S1} />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{deviceHostnames.S1}</text>
                                    <text x="0" y="-27" textAnchor="middle" fill={currentDevice === 'S1' ? '#58a6ff' : '#8b949e'} fontSize="10">SWITCH</text>
                                    {/* Port indicators */}
                                    {[-36, -18, 0, 18, 36].map((x, i) => (
                                        <rect key={i} x={x - 5} y="12" width="8" height="4" rx="1" fill="#0d1117" />
                                    ))}
                                </g>

                                {/* S2 Switch */}
                                <g transform="translate(350, 155)" onClick={() => setCurrentDevice('S2')} style={{ cursor: 'pointer' }}>
                                    {currentStepData?.device === 'S2' && (
                                        <rect x="-58" y="-23" width="116" height="46" rx="8" fill="none" stroke="#58a6ff" strokeWidth="2" opacity="0.5" />
                                    )}
                                    <rect x="-54" y="-19" width="108" height="38" rx="6" fill={currentDevice === 'S2' ? '#58a6ff' : deviceColors.S2} />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{deviceHostnames.S2}</text>
                                    <text x="0" y="-27" textAnchor="middle" fill={currentDevice === 'S2' ? '#58a6ff' : '#8b949e'} fontSize="10">SWITCH</text>
                                    {[-36, -18, 0, 18, 36].map((x, i) => (
                                        <rect key={i} x={x - 5} y="12" width="8" height="4" rx="1" fill="#0d1117" />
                                    ))}
                                </g>

                                {/* PC-A */}
                                <g transform="translate(80, 260)">
                                    <rect x="-32" y="-20" width="64" height="40" rx="4" fill="#484f58" />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">PC-A</text>
                                    <text x="0" y="30" textAnchor="middle" fill="#58cc02" fontSize="9">VLAN 2 (Bikes)</text>
                                </g>

                                {/* PC-B */}
                                <g transform="translate(420, 260)">
                                    <rect x="-32" y="-20" width="64" height="40" rx="4" fill="#484f58" />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">PC-B</text>
                                    <text x="0" y="30" textAnchor="middle" fill="#ff9600" fontSize="9">VLAN 3 (Trikes)</text>
                                </g>

                                {/* Legend */}
                                <g transform="translate(10, 285)">
                                    <circle cx="5" cy="0" r="4" fill="#3fb950" />
                                    <text x="15" y="4" fill="#8b949e" fontSize="9">Configured</text>
                                    <circle cx="100" cy="0" r="4" fill="#58a6ff" />
                                    <text x="110" y="4" fill="#8b949e" fontSize="9">Active</text>
                                    <circle cx="170" cy="0" r="4" fill="#484f58" />
                                    <text x="180" y="4" fill="#8b949e" fontSize="9">Not yet</text>
                                </g>
                            </svg>
                        </div>
                    </div>


                    {/* CLI Terminal */}
                    <div
                        className="flex-1 rounded-xl overflow-hidden flex flex-col min-h-0"
                        style={{ border: '3px solid #58cc02' }}
                    >
                        <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#161b22' }}>
                            <span className="text-xl">⌨️</span>
                            <h2 className="font-black" style={{ color: '#58cc02' }}>CLI TERMINAL</h2>
                            <div className="ml-auto flex gap-2">
                                {['R1', 'S1', 'S2'].map(device => (
                                    <button
                                        key={device}
                                        onClick={() => setCurrentDevice(device)}
                                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                                        style={{
                                            backgroundColor: currentDevice === device ? deviceColors[device] : '#21262d',
                                            color: 'white',
                                            opacity: currentStepData?.device === device ? 1 : 0.6
                                        }}
                                    >
                                        {device}
                                        {currentStepData?.device === device && <span className="ml-1 animate-pulse">●</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Current Task */}
                        <div
                            className="px-4 py-3 flex items-center justify-between"
                            style={{ backgroundColor: '#1a2733', borderTop: '1px solid #30363d' }}
                        >
                            <div className="flex-1">
                                <p className="text-xs font-bold" style={{ color: '#8b949e' }}>
                                    Step {currentStep + 1} of {totalSteps} • {currentStepData?.partName}
                                </p>
                                <p className="font-bold" style={{ color: '#c9d1d9' }}>
                                    {currentStepData?.description}
                                </p>
                            </div>
                            <span
                                className="px-3 py-1 rounded-lg text-xs font-bold ml-2"
                                style={{ backgroundColor: '#ffc800', color: '#0d1117' }}
                            >
                                +{currentStepData?.xp || 0} XP
                            </span>
                        </div>

                        {/* Hint */}
                        <div
                            className="px-4 py-2"
                            style={{ backgroundColor: '#0d1117', borderTop: '1px solid #30363d' }}
                        >
                            <p className="text-sm" style={{ color: '#8b949e' }}>
                                💡 <span style={{ color: '#58cc02' }}>{currentStepData?.hint}</span>
                            </p>
                        </div>

                        {/* Terminal Output */}
                        <div
                            ref={desktopTerminalRef}
                            className="flex-1 p-4 font-mono text-sm overflow-y-auto"
                            style={{ backgroundColor: '#0d1117' }}
                            onClick={() => inputRef.current?.focus()}
                        >
                            {terminalHistory[currentDevice].map((line, i) => (
                                <div
                                    key={i}
                                    style={{
                                        color: line.type === 'success' ? '#58cc02' :
                                            line.type === 'error' ? '#f85149' :
                                                line.type === 'output' ? '#8b949e' : '#c9d1d9'
                                    }}
                                >
                                    {line.text}
                                </div>
                            ))}

                            {/* Input Line */}
                            <form onSubmit={handleSubmit} className="flex items-center">
                                <span style={{ color: '#8b949e' }}>{getPrompt(currentDevice)}</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={handleInputFocus}
                                    className="flex-1 bg-transparent outline-none ml-1"
                                    style={{ color: '#c9d1d9', caretColor: '#58cc02' }}
                                    autoFocus
                                    spellCheck={false}
                                />
                            </form>
                            {/* Scroll anchor - always stays at bottom */}
                            <div ref={bottomRef} style={{ height: 1 }} />
                        </div>
                    </div>
                </div>

                {/* Right Side: Flashcard & Progress Sidebar */}
                <div
                    className="w-80 flex-shrink-0 p-4 overflow-y-auto"
                    style={{ backgroundColor: '#161b22', borderLeft: '2px solid #30363d' }}
                >
                    {/* Flashcard - Command Explanation */}
                    {currentStepData && (() => {
                        const explanation = getExplanation(currentStepData.command);
                        return (
                            <div
                                className="mb-4 rounded-xl overflow-hidden"
                                style={{ backgroundColor: '#0d1117', border: '2px solid #58cc02' }}
                            >
                                {/* Flashcard Header */}
                                <div className="px-4 py-3" style={{ backgroundColor: '#1a2c32' }}>
                                    <h3 className="font-bold text-lg" style={{ color: '#58cc02' }}>
                                        {explanation.title}
                                    </h3>
                                </div>

                                {/* Flashcard Content */}
                                <div className="p-4 space-y-3">
                                    {/* What */}
                                    <div>
                                        <p className="text-xs font-bold mb-1" style={{ color: '#f0883e' }}>
                                            📌 APA
                                        </p>
                                        <p className="text-sm" style={{ color: '#c9d1d9' }}>
                                            {explanation.what}
                                        </p>
                                    </div>

                                    {/* Why */}
                                    <div>
                                        <p className="text-xs font-bold mb-1" style={{ color: '#1cb0f6' }}>
                                            💡 KENAPA
                                        </p>
                                        <p className="text-sm" style={{ color: '#c9d1d9' }}>
                                            {explanation.why}
                                        </p>
                                    </div>

                                    {/* Syntax */}
                                    <div>
                                        <p className="text-xs font-bold mb-1" style={{ color: '#a371f7' }}>
                                            ⌨️ SYNTAX
                                        </p>
                                        <code
                                            className="block px-3 py-2 rounded text-sm"
                                            style={{ backgroundColor: '#161b22', color: '#7ee787' }}
                                        >
                                            {explanation.syntax}
                                        </code>
                                    </div>

                                    {/* Tip */}
                                    <div
                                        className="mt-3 px-3 py-2 rounded-lg"
                                        style={{ backgroundColor: '#1a2733', borderLeft: '3px solid #f0883e' }}
                                    >
                                        <p className="text-xs" style={{ color: '#8b949e' }}>
                                            💡 <span style={{ color: '#f0883e' }}>Tip:</span>{' '}
                                            <span style={{ color: '#c9d1d9' }}>{explanation.tip}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    <h3 className="font-bold mb-4" style={{ color: '#c9d1d9' }}>📊 Your Progress</h3>

                    {/* Group steps by part */}
                    {[...new Set(labSteps.map(s => s.part))].map(partNum => {
                        const partSteps = labSteps.filter(s => s.part === partNum);
                        const partName = partSteps[0].partName;
                        const startIdx = labSteps.findIndex(s => s.part === partNum);
                        const completedInPart = partSteps.filter((_, i) => completedSteps.includes(startIdx + i)).length;
                        const isCurrentPart = currentStepData?.part === partNum;

                        return (
                            <div key={partNum} className="mb-4">
                                <div
                                    className="flex items-center justify-between px-3 py-2 rounded-lg mb-2"
                                    style={{
                                        backgroundColor: isCurrentPart ? '#1a2c32' : '#0d1117',
                                        border: isCurrentPart ? '2px solid #58cc02' : '1px solid #30363d'
                                    }}
                                >
                                    <span className="text-xs font-bold" style={{ color: isCurrentPart ? '#58cc02' : '#8b949e' }}>
                                        {partName}
                                    </span>
                                    <span className="text-xs font-bold" style={{ color: completedInPart === partSteps.length ? '#58cc02' : '#ffc800' }}>
                                        {completedInPart}/{partSteps.length}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Reference Configurations Dropdown */}
                    <div className="mt-8 pt-6 border-t" style={{ borderColor: '#30363d' }}>
                        <h3 className="font-bold flex items-center gap-2 mb-4" style={{ color: '#c9d1d9' }}>
                            📋 Reference Configs
                        </h3>

                        <div className="space-y-3">
                            {['R1', 'S1', 'S2'].map(dev => (
                                <div
                                    key={dev}
                                    className="rounded-xl overflow-hidden"
                                    style={{
                                        backgroundColor: '#161b22',
                                        border: `1px solid ${expandedReference === dev ? deviceColors[dev] : '#30363d'}`
                                    }}
                                >
                                    <button
                                        onClick={() => setExpandedReference(expandedReference === dev ? null : dev)}
                                        className="w-full px-4 py-3 flex items-center justify-between text-left transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                                                style={{ backgroundColor: deviceColors[dev], color: 'white' }}
                                            >
                                                {dev === 'R1' ? '🌐' : '🔀'}
                                            </div>
                                            <span className="font-bold text-sm" style={{ color: '#c9d1d9' }}>{dev} Config</span>
                                        </div>
                                        <span style={{ color: '#8b949e', transform: expandedReference === dev ? 'rotate(180deg)' : 'none' }}>▼</span>
                                    </button>

                                    {expandedReference === dev && (
                                        <div className="px-3 pb-3">
                                            <div className="relative rounded-lg p-3" style={{ backgroundColor: '#0d1117' }}>
                                                <button
                                                    onClick={() => copyConfig(deviceConfigs[dev], dev)}
                                                    className="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold"
                                                    style={{
                                                        backgroundColor: copiedDevice === dev ? '#238636' : '#21262d',
                                                        color: 'white',
                                                        border: '1px solid #30363d'
                                                    }}
                                                >
                                                    {copiedDevice === dev ? '✓' : '📋 Copy'}
                                                </button>
                                                <pre className="text-[11px] font-mono leading-tight whitespace-pre-wrap overflow-x-auto h-40" style={{ color: '#7ee787' }}>
                                                    {deviceConfigs[dev]}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Address Table */}
                    <div className="mt-6 p-3 rounded-xl" style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}>
                        <h4 className="font-bold text-xs mb-2" style={{ color: '#8b949e' }}>VLAN Reference</h4>
                        <div className="space-y-1 text-xs font-mono">
                            <div className="flex justify-between"><span style={{ color: '#58cc02' }}>VLAN 2</span><span style={{ color: '#c9d1d9' }}>Bikes - 10.19.8.0/26</span></div>
                            <div className="flex justify-between"><span style={{ color: '#1cb0f6' }}>VLAN 3</span><span style={{ color: '#c9d1d9' }}>Trikes - 10.19.8.64/27</span></div>
                            <div className="flex justify-between"><span style={{ color: '#ff9600' }}>VLAN 4</span><span style={{ color: '#c9d1d9' }}>Mgmt - 10.19.8.96/29</span></div>
                            <div className="flex justify-between"><span style={{ color: '#ce82ff' }}>VLAN 6</span><span style={{ color: '#c9d1d9' }}>Native</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex-1 overflow-y-auto">
                {/* Mobile Topology */}
                <div className="p-4">
                    <div
                        className="rounded-xl p-3"
                        style={{ backgroundColor: '#161b22', border: '2px solid #1cb0f6' }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🗺️</span>
                            <span className="font-bold text-sm" style={{ color: '#1cb0f6' }}>TOPOLOGY</span>
                        </div>
                        <div className="flex justify-center gap-4 text-center">
                            {['R1', 'S1', 'S2'].map(device => (
                                <button
                                    key={device}
                                    onClick={() => setCurrentDevice(device)}
                                    className="px-4 py-2 rounded-lg font-bold text-sm"
                                    style={{
                                        backgroundColor: currentDevice === device ? deviceColors[device] : '#21262d',
                                        color: 'white',
                                        boxShadow: currentStepData?.device === device ? `0 0 10px ${deviceColors[device]}` : 'none'
                                    }}
                                >
                                    {device === 'R1' ? '🌐' : '🔀'} {device}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Terminal */}
                <div className="p-4 pt-0">
                    <div
                        className="rounded-xl overflow-hidden"
                        style={{ border: '3px solid #58cc02' }}
                    >
                        <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: '#161b22' }}>
                            <span className="text-lg">⌨️</span>
                            <span className="font-bold text-sm" style={{ color: '#58cc02' }}>CLI TERMINAL</span>
                        </div>

                        {/* Current Task */}
                        <div className="px-3 py-2" style={{ backgroundColor: '#1a2733' }}>
                            <p className="text-xs" style={{ color: '#8b949e' }}>Step {currentStep + 1}/{totalSteps}</p>
                            <p className="text-sm font-bold" style={{ color: '#c9d1d9' }}>{currentStepData?.description}</p>
                            <p className="text-xs mt-1" style={{ color: '#58cc02' }}>💡 {currentStepData?.hint}</p>
                        </div>

                        {/* Terminal */}
                        <div
                            ref={mobileTerminalRef}
                            className="h-48 p-3 font-mono text-xs overflow-y-auto"
                            style={{ backgroundColor: '#0d1117' }}
                            onClick={() => inputRef.current?.focus()}
                        >
                            {terminalHistory[currentDevice].map((line, i) => (
                                <div
                                    key={i}
                                    style={{
                                        color: line.type === 'success' ? '#58cc02' :
                                            line.type === 'error' ? '#f85149' : '#c9d1d9'
                                    }}
                                >
                                    {line.text}
                                </div>
                            ))}
                            <form onSubmit={handleSubmit} className="flex items-center">
                                <span style={{ color: '#8b949e' }}>{getPrompt(currentDevice)}</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={handleInputFocus}
                                    className="flex-1 bg-transparent outline-none ml-1"
                                    style={{ color: '#c9d1d9' }}
                                    autoFocus
                                    spellCheck={false}
                                />
                            </form>
                            {/* Scroll anchor - always stays at bottom */}
                            <div ref={bottomRef} style={{ height: 1 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lab Complete Modal */}
            {
                isLabComplete && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
                    >
                        <div
                            className="w-full max-w-md rounded-3xl p-8 text-center"
                            style={{ backgroundColor: '#161b22', border: '3px solid #58cc02' }}
                        >
                            <div className="text-6xl mb-4">🏆</div>
                            <h2 className="text-3xl font-black mb-2" style={{ color: '#58cc02' }}>
                                Lab Complete!
                            </h2>
                            <p className="text-xl mb-4" style={{ color: '#ffc800' }}>
                                ⚡ {xpEarned} XP Earned!
                            </p>
                            <p className="mb-6" style={{ color: '#c9d1d9' }}>
                                You successfully configured the SRWE inter-VLAN routing network!
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-xl font-black"
                                style={{ backgroundColor: '#58cc02', color: 'white', boxShadow: '0 4px 0 #46a302' }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default LabActivity;
