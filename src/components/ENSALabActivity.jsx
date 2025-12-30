import { useState, useRef, useEffect } from 'react';
import { ensaLab1Steps, ensaLab1Info } from '../data/ensaLab1Steps';
import { getExplanation } from '../data/commandExplanations';

const ENSALabActivity = ({ onClose, onComplete }) => {
    const [currentDevice, setCurrentDevice] = useState('S1');
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [terminalHistory, setTerminalHistory] = useState({
        R1: [{ type: 'output', text: 'Router>' }],
        R2: [{ type: 'output', text: 'Router>' }],
        S1: [{ type: 'output', text: 'Switch>' }],
        S2: [{ type: 'output', text: 'Switch>' }]
    });
    const [deviceModes, setDeviceModes] = useState({
        R1: 'user',
        R2: 'user',
        S1: 'user',
        S2: 'user'
    });
    const [deviceHostnames, setDeviceHostnames] = useState({
        R1: 'Router',
        R2: 'Router',
        S1: 'Switch',
        S2: 'Switch'
    });
    const [input, setInput] = useState('');
    const [xpEarned, setXpEarned] = useState(0);
    const [commandHistory, setCommandHistory] = useState({
        R1: [], R2: [], S1: [], S2: []
    });
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [expandedReference, setExpandedReference] = useState(null);
    const [copiedDeviceStatus, setCopiedDeviceStatus] = useState(null);
    const [zoom, setZoom] = useState(1);


    const desktopTerminalRef = useRef(null);
    const mobileTerminalRef = useRef(null);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const topologyContainerRef = useRef(null);


    const currentStepData = ensaLab1Steps[currentStep];
    const totalSteps = ensaLab1Steps.length;
    const progress = (completedSteps.length / totalSteps) * 100;
    const totalXP = ensaLab1Steps.reduce((sum, s) => sum + s.xp, 0);

    const deviceConfigs = {
        R1: `enable
configure terminal
no ip domain-lookup
hostname R1
service password-encryption
enable secret class
banner motd #Unauthorized access is strictly prohibited.#
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 4
 password cisco
 login
 transport input telnet
 exit
interface g0/0/0
 ip address 10.67.254.2 255.255.255.252
 no shutdown
exit
interface g0/0/1
 ip address 192.168.1.1 255.255.255.0
 no shutdown
exit
interface loopback 0
 ip address 10.52.0.1 255.255.255.248
exit
router ospf 1
 router-id 1.1.1.1
 network 10.67.254.0 0.0.0.3 area 0
 network 192.168.1.0 0.0.0.255 area 0
 network 10.52.0.0 0.0.0.7 area 0
 passive-interface g0/0/1
end`,
        R2: `enable
configure terminal
no ip domain-lookup
hostname R2
service password-encryption
enable secret class
banner motd #Unauthorized access is strictly prohibited.#
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 4
 password cisco
 login
 transport input telnet
 exit
interface g0/0/0
 ip address 10.67.254.1 255.255.255.252
 no shutdown
exit
interface g0/0/1
 ip address 10.67.1.1 255.255.255.0
 no shutdown
exit
interface loopback 0
 ip address 209.165.201.1 255.255.255.224
exit
router ospf 1
 router-id 2.2.2.2
 network 10.67.254.0 0.0.0.3 area 0
 network 10.67.1.0 0.0.0.255 area 0
 passive-interface g0/0/1
 default-information originate
exit
ip route 0.0.0.0 0.0.0.0 loopback 0
access-list 1 permit 192.168.1.0 0.0.0.255
access-list 1 permit 10.67.1.0 0.0.0.255
ip nat inside source list 1 interface loopback 0 overload
interface g0/0/0
 ip nat inside
interface g0/0/1
 ip nat inside
interface loopback 0
 ip nat outside
end`,
        S1: `enable
configure terminal
no ip domain-lookup
hostname S1
service password-encryption
enable secret class
banner motd #Unauthorized access is strictly prohibited.#
vlan 99
 name Management
exit
interface vlan 99
 ip address 192.168.1.2 255.255.255.0
 no shutdown
exit
ip default-gateway 192.168.1.1
interface f0/6
 switchport mode access
 switchport access vlan 99
 exit
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 15
 password cisco
 login
 transport input telnet
end`,
        S2: `enable
configure terminal
no ip domain-lookup
hostname S2
service password-encryption
enable secret class
banner motd #Unauthorized access is strictly prohibited.#
interface vlan 1
 ip address 10.67.1.2 255.255.255.0
 no shutdown
exit
ip default-gateway 10.67.1.1
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 15
 password cisco
 login
 transport input telnet
end`
    };

    const copyConfig = (text, device) => {
        navigator.clipboard.writeText(text);
        setCopiedDeviceStatus(device);
        setTimeout(() => setCopiedDeviceStatus(null), 2000);
    };


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

    const checkCommand = (inputCmd, expectedCmd, alternates = []) => {
        const normalizedInput = inputCmd.trim().toLowerCase();
        const normalizedExpected = expectedCmd.toLowerCase();
        if (normalizedInput === normalizedExpected) return true;
        if (alternates && alternates.some(alt => normalizedInput === alt.toLowerCase())) return true;
        return false;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const step = ensaLab1Steps[currentStep];
        const device = currentDevice;
        const prompt = getPrompt(device);
        const typedCommand = input.trim();

        setCommandHistory(prev => ({
            ...prev,
            [device]: [...prev[device], typedCommand]
        }));
        setHistoryIndex(-1);

        setTerminalHistory(prev => ({
            ...prev,
            [device]: [...prev[device], { type: 'input', text: `${prompt} ${input}` }]
        }));

        if (device !== step.device) {
            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], {
                    type: 'error',
                    text: `⚠️ Switch to ${step.device} to continue`
                }]
            }));
            setInput('');
            return;
        }

        if (checkCommand(input, step.command, step.alternates)) {
            let newMode = deviceModes[device];
            let newHostname = deviceHostnames[device];

            // Mode handling
            if (input.toLowerCase() === 'enable') {
                newMode = 'privileged';
            } else if (input.toLowerCase().match(/^conf(?:igure)?\s*t(?:erminal)?$/)) {
                newMode = 'config';
            } else if (input.toLowerCase().match(/^line\s+(console|con|vty)\s+/)) {
                newMode = 'line';
            } else if (input.toLowerCase().match(/^router\s+ospf\s+\d+$/)) {
                newMode = 'router';
            } else if (input.toLowerCase().match(/^int(?:erface)?\s+range\s+/)) {
                newMode = 'interface-range';
            } else if (input.toLowerCase().match(/^int(?:erface)?\s+/)) {
                if (input.toLowerCase().includes('.')) {
                    newMode = 'subinterface';
                } else {
                    newMode = 'interface';
                }
            } else if (input.toLowerCase().match(/^vlan\s+\d+$/)) {
                newMode = 'vlan';
            } else if (input.toLowerCase() === 'exit') {
                if (['vlan', 'interface', 'subinterface', 'interface-range', 'line', 'dhcp', 'router'].includes(newMode)) {
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

            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], {
                    type: 'success',
                    text: `✅ Correct! +${step.xp} XP`
                }]
            }));

            setCompletedSteps(prev => [...prev, currentStep]);

            if (currentStep < totalSteps - 1) {
                const nextStep = ensaLab1Steps[currentStep + 1];
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                    if (nextStep.device !== device) {
                        setCurrentDevice(nextStep.device);
                    }
                }, 300);
            }
        } else {
            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], {
                    type: 'error',
                    text: `❌ Incorrect. Check the hint.`
                }]
            }));
        }

        setInput('');
    };

    const scrollToBottom = () => {
        if (desktopTerminalRef.current) {
            desktopTerminalRef.current.scrollTop = desktopTerminalRef.current.scrollHeight;
        }
        if (mobileTerminalRef.current) {
            mobileTerminalRef.current.scrollTop = mobileTerminalRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
        const timer = setTimeout(scrollToBottom, 50);
        return () => clearTimeout(timer);
    }, [terminalHistory, currentDevice]);

    useEffect(() => {
        inputRef.current?.focus();
        scrollToBottom();
    }, [currentDevice]);

    const handleInputFocus = () => scrollToBottom();

    const handleKeyDown = (e) => {
        const history = commandHistory[currentDevice];
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (history.length === 0 || historyIndex === -1) return;
            const newIndex = historyIndex + 1;
            if (newIndex >= history.length) {
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
        R2: '#ff9600',
        S1: '#1cb0f6',
        S2: '#a855f7'
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
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3"
                style={{ backgroundColor: '#161b22', borderBottom: '3px solid #30363d' }}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#30363d', color: '#8b949e' }}
                    >
                        ✕
                    </button>
                    <div>
                        <h1 className="font-black text-lg" style={{ color: '#c9d1d9' }}>
                            🔄 Lab Activity 1
                        </h1>
                        <p className="text-xs" style={{ color: '#8b949e' }}>
                            Configure R1, R2, S1, S2 with OSPF and NAT
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="font-bold" style={{ color: '#58cc02' }}>
                            ⭐ {xpEarned} / {totalXP} XP
                        </div>
                        <div className="text-xs" style={{ color: '#8b949e' }}>
                            {completedSteps.length} / {totalSteps} steps
                        </div>
                    </div>
                    <div className="w-32 h-3 rounded-full" style={{ backgroundColor: '#30363d' }}>
                        <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${progress}%`, backgroundColor: '#58cc02' }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content - Desktop */}
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
                                <div className="flex gap-4 text-[10px]" style={{ color: '#8b949e' }}>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3fb950' }}></div>
                                        <span>OSPF Up</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#58a6ff' }}></div>
                                        <span>Active</span>
                                    </div>
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
                                {/* R1 to R2 (G0/0/0) */}
                                <line x1="150" y1="70" x2="350" y2="70" stroke={completedSteps.length >= 100 ? '#3fb950' : '#30363d'} strokeWidth="3" />
                                <text x="180" y="65" fill="#8b949e" fontSize="9">G0/0/0</text>
                                <text x="310" y="65" fill="#8b949e" fontSize="9">G0/0/0</text>

                                {/* R1 to S1 (G0/0/1 to F0/5) */}
                                <line x1="150" y1="70" x2="150" y2="160" stroke={completedSteps.length >= 75 ? '#3fb950' : '#30363d'} strokeWidth="3" />
                                <text x="130" y="105" fill="#8b949e" fontSize="9">G0/0/1</text>
                                <text x="130" y="145" fill="#8b949e" fontSize="9">F0/5</text>

                                {/* R2 to S2 (G0/0/1 to F0/5) */}
                                <line x1="350" y1="70" x2="350" y2="160" stroke={completedSteps.length >= 120 ? '#3fb950' : '#30363d'} strokeWidth="3" />
                                <text x="355" y="105" fill="#8b949e" fontSize="9">G0/0/1</text>
                                <text x="355" y="145" fill="#8b949e" fontSize="9">F0/5</text>

                                {/* S1 to PC-A (F0/6) */}
                                <line x1="150" y1="160" x2="80" y2="250" stroke={completedSteps.length >= 20 ? '#3fb950' : '#30363d'} strokeWidth="3" />
                                <text x="110" y="210" fill="#8b949e" fontSize="9">F0/6</text>

                                {/* S2 to PC-B (F0/18) */}
                                <line x1="350" y1="160" x2="420" y2="250" stroke={completedSteps.length >= 50 ? '#3fb950' : '#30363d'} strokeWidth="3" />
                                <text x="375" y="210" fill="#8b949e" fontSize="9">F0/18</text>

                                {/* R1 Router */}
                                <g transform="translate(150, 60)" onClick={() => setCurrentDevice('R1')} style={{ cursor: 'pointer' }}>
                                    {currentStepData?.device === 'R1' && (
                                        <rect x="-52" y="-28" width="104" height="56" rx="12" fill="none" stroke="#58a6ff" strokeWidth="2" opacity="0.5" />
                                    )}
                                    <rect x="-48" y="-24" width="96" height="48" rx="10" fill={currentDevice === 'R1' ? '#58a6ff' : deviceColors.R1} />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{deviceHostnames.R1}</text>
                                    <text x="0" y="-32" textAnchor="middle" fill={currentDevice === 'R1' ? '#58a6ff' : '#8b949e'} fontSize="10">R1</text>
                                    {/* Loopback indicator */}
                                    <circle cx="-55" cy="-10" r="10" fill="#0d1117" stroke="#8b949e" strokeWidth="1.5" />
                                    <text x="-55" y="-7" textAnchor="middle" fill="#8b949e" fontSize="7">Lo0</text>
                                </g>

                                {/* R2 Router */}
                                <g transform="translate(350, 60)" onClick={() => setCurrentDevice('R2')} style={{ cursor: 'pointer' }}>
                                    {currentStepData?.device === 'R2' && (
                                        <rect x="-52" y="-28" width="104" height="56" rx="12" fill="none" stroke="#58a6ff" strokeWidth="2" opacity="0.5" />
                                    )}
                                    <rect x="-48" y="-24" width="96" height="48" rx="10" fill={currentDevice === 'R2' ? '#58a6ff' : deviceColors.R2} />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{deviceHostnames.R2}</text>
                                    <text x="0" y="-32" textAnchor="middle" fill={currentDevice === 'R2' ? '#58a6ff' : '#8b949e'} fontSize="10">R2</text>
                                    {/* Loopback (Internet) */}
                                    <circle cx="55" cy="-10" r="10" fill="#0d1117" stroke="#ff9600" strokeWidth="1.5" />
                                    <text x="55" y="-7" textAnchor="middle" fill="#ff9600" fontSize="7">WAN</text>
                                </g>

                                {/* S1 Switch */}
                                <g transform="translate(150, 175)" onClick={() => setCurrentDevice('S1')} style={{ cursor: 'pointer' }}>
                                    {currentStepData?.device === 'S1' && (
                                        <rect x="-58" y="-23" width="116" height="46" rx="8" fill="none" stroke="#58a6ff" strokeWidth="2" opacity="0.5" />
                                    )}
                                    <rect x="-54" y="-19" width="108" height="38" rx="6" fill={currentDevice === 'S1' ? '#58a6ff' : deviceColors.S1} />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{deviceHostnames.S1}</text>
                                    <text x="0" y="-27" textAnchor="middle" fill={currentDevice === 'S1' ? '#58a6ff' : '#8b949e'} fontSize="10">S1</text>
                                </g>

                                {/* S2 Switch */}
                                <g transform="translate(350, 175)" onClick={() => setCurrentDevice('S2')} style={{ cursor: 'pointer' }}>
                                    {currentStepData?.device === 'S2' && (
                                        <rect x="-58" y="-23" width="116" height="46" rx="8" fill="none" stroke="#58a6ff" strokeWidth="2" opacity="0.5" />
                                    )}
                                    <rect x="-54" y="-19" width="108" height="38" rx="6" fill={currentDevice === 'S2' ? '#58a6ff' : deviceColors.S2} />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{deviceHostnames.S2}</text>
                                    <text x="0" y="-27" textAnchor="middle" fill={currentDevice === 'S2' ? '#58a6ff' : '#8b949e'} fontSize="10">S2</text>
                                </g>

                                {/* PC-A */}
                                <g transform="translate(80, 265)">
                                    <rect x="-25" y="-15" width="50" height="30" rx="4" fill="#484f58" />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">PC-A</text>
                                </g>

                                {/* PC-B */}
                                <g transform="translate(420, 265)">
                                    <rect x="-25" y="-15" width="50" height="30" rx="4" fill="#484f58" />
                                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">PC-B</text>
                                </g>
                            </svg>
                        </div>
                    </div>


                    {/* Terminal Section */}
                    <div
                        className="flex-1 rounded-xl overflow-hidden flex flex-col min-h-0"
                        style={{ border: `3px solid ${deviceColors[currentDevice]}` }}
                    >
                        {/* Device Tabs (Duplicate for easy access) */}
                        <div className="flex gap-2 px-4 py-2" style={{ backgroundColor: '#161b22', borderBottom: '1px solid #30363d' }}>
                            {['S1', 'S2', 'R1', 'R2'].map((device) => (
                                <button
                                    key={device}
                                    onClick={() => setCurrentDevice(device)}
                                    className="px-3 py-1 rounded-lg font-bold text-xs transition-all"
                                    style={{
                                        backgroundColor: currentDevice === device ? deviceColors[device] : '#30363d',
                                        color: currentDevice === device ? '#000' : '#8b949e',
                                        opacity: currentStepData?.device === device ? 1 : 0.6
                                    }}
                                >
                                    {device}
                                </button>
                            ))}
                        </div>

                        {/* Current Task */}
                        <div
                            className="px-4 py-3 flex items-center justify-between"
                            style={{ backgroundColor: '#1a2733', borderBottom: '1px solid #30363d' }}
                        >
                            <div className="flex-1">
                                <p className="text-xs font-bold" style={{ color: '#8b949e' }}>
                                    Step {currentStep + 1} of {totalSteps} • {currentStepData?.partName}
                                </p>
                                <p className="font-bold text-sm" style={{ color: '#c9d1d9' }}>
                                    {currentStepData?.description}
                                </p>
                                <p className="text-xs mt-1" style={{ color: '#58cc02' }}>
                                    💡 {currentStepData?.hint}
                                </p>
                            </div>
                            <span
                                className="px-3 py-1 rounded-lg text-xs font-bold ml-2"
                                style={{ backgroundColor: '#ffc800', color: '#0d1117' }}
                            >
                                +{currentStepData?.xp || 0} XP
                            </span>
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
                            <div ref={bottomRef} style={{ height: 1 }} />
                        </div>
                    </div>
                </div>

                {/* Right Side - Flashcard & Progress */}
                <div
                    className="w-80 flex-shrink-0 p-4 overflow-y-auto"
                    style={{ backgroundColor: '#161b22', borderLeft: '2px solid #30363d' }}
                >
                    {/* Flashcard */}
                    {currentStepData && (() => {
                        const explanation = getExplanation(currentStepData.command);
                        return (
                            <div
                                className="mb-4 rounded-xl overflow-hidden"
                                style={{ backgroundColor: '#0d1117', border: '2px solid #1cb0f6' }}
                            >
                                <div className="px-4 py-3" style={{ backgroundColor: '#1a2c32' }}>
                                    <h3 className="font-bold text-lg" style={{ color: '#1cb0f6' }}>
                                        {explanation.title}
                                    </h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <p className="text-xs font-bold mb-1" style={{ color: '#f0883e' }}>📌 APA</p>
                                        <p className="text-sm" style={{ color: '#c9d1d9' }}>{explanation.what}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1" style={{ color: '#1cb0f6' }}>💡 KENAPA</p>
                                        <p className="text-sm" style={{ color: '#c9d1d9' }}>{explanation.why}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1" style={{ color: '#a371f7' }}>⌨️ SYNTAX</p>
                                        <code className="block px-3 py-2 rounded text-sm" style={{ backgroundColor: '#161b22', color: '#7ee787' }}>
                                            {explanation.syntax}
                                        </code>
                                    </div>
                                    <div className="mt-3 px-3 py-2 rounded-lg" style={{ backgroundColor: '#1a2733', borderLeft: '3px solid #f0883e' }}>
                                        <p className="text-xs" style={{ color: '#8b949e' }}>
                                            💡 <span style={{ color: '#f0883e' }}>Tip:</span>{' '}
                                            <span style={{ color: '#c9d1d9' }}>{explanation.tip}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    <h3 className="font-bold mb-4" style={{ color: '#c9d1d9' }}>📊 Progress</h3>

                    {/* Progress by parts */}
                    {[...new Set(ensaLab1Steps.map(s => s.part))].map(partNum => {
                        const partSteps = ensaLab1Steps.filter(s => s.part === partNum);
                        const partName = partSteps[0].partName;
                        const startIdx = ensaLab1Steps.findIndex(s => s.part === partNum);
                        const completedInPart = partSteps.filter((_, i) => completedSteps.includes(startIdx + i)).length;
                        const isCurrentPart = currentStepData?.part === partNum;

                        return (
                            <div key={partNum} className="mb-3">
                                <div
                                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                                    style={{
                                        backgroundColor: isCurrentPart ? '#1a2c32' : '#0d1117',
                                        border: isCurrentPart ? '2px solid #1cb0f6' : '1px solid #30363d'
                                    }}
                                >
                                    <span className="text-xs font-bold" style={{ color: isCurrentPart ? '#1cb0f6' : '#8b949e' }}>
                                        {partName}
                                    </span>
                                    <span className="text-xs" style={{ color: completedInPart === partSteps.length ? '#58cc02' : '#8b949e' }}>
                                        {completedInPart}/{partSteps.length}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Reference Configurations Dropdown */}
                    <div className="mt-6 pt-6 border-t" style={{ borderColor: '#30363d' }}>
                        <h3 className="font-bold flex items-center gap-2 mb-4" style={{ color: '#c9d1d9' }}>
                            📋 Reference Configs
                        </h3>

                        <div className="space-y-3">
                            {['R1', 'R2', 'S1', 'S2'].map(dev => (
                                <div
                                    key={dev}
                                    className="rounded-xl overflow-hidden"
                                    style={{
                                        backgroundColor: '#0d1117',
                                        border: `1px solid ${expandedReference === dev ? deviceColors[dev] : '#30363d'}`
                                    }}
                                >
                                    <button
                                        onClick={() => setExpandedReference(expandedReference === dev ? null : dev)}
                                        className="w-full px-3 py-3 flex items-center justify-between text-left transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                                                style={{ backgroundColor: deviceColors[dev], color: 'white' }}
                                            >
                                                {dev.startsWith('R') ? '🌐' : '🔀'}
                                            </div>
                                            <span className="font-bold text-xs" style={{ color: '#c9d1d9' }}>{dev} Config</span>
                                        </div>
                                        <span style={{ color: '#8b949e', fontSize: '10px', transform: expandedReference === dev ? 'rotate(180deg)' : 'none' }}>▼</span>
                                    </button>

                                    {expandedReference === dev && (
                                        <div className="px-2 pb-2">
                                            <div className="relative rounded-lg p-2" style={{ backgroundColor: '#161b22' }}>
                                                <button
                                                    onClick={() => copyConfig(deviceConfigs[dev], dev)}
                                                    className="absolute top-1 right-1 px-2 py-0.5 rounded text-[9px] font-bold transition-all active:scale-95"
                                                    style={{
                                                        backgroundColor: copiedDeviceStatus === dev ? '#238636' : '#21262d',
                                                        color: 'white',
                                                        border: '1px solid #30363d'
                                                    }}
                                                >
                                                    {copiedDeviceStatus === dev ? '✓' : '📋 Copy'}
                                                </button>
                                                <pre className="text-[10px] font-mono leading-tight whitespace-pre-wrap overflow-x-auto h-32 scrollbar-thin scrollbar-thumb-gray-700" style={{ color: '#7ee787' }}>
                                                    {deviceConfigs[dev]}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex-1 flex flex-col overflow-hidden">
                <div className="p-3" style={{ backgroundColor: '#161b22' }}>
                    <div className="flex gap-2 mb-2 overflow-x-auto">
                        {['S1', 'S2', 'R1', 'R2'].map((device) => (
                            <button
                                key={device}
                                onClick={() => setCurrentDevice(device)}
                                className="px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap"
                                style={{
                                    backgroundColor: currentDevice === device ? deviceColors[device] : '#30363d',
                                    color: currentDevice === device ? '#000' : '#8b949e'
                                }}
                            >
                                {device}
                            </button>
                        ))}
                    </div>
                    <div className="px-3 py-2" style={{ backgroundColor: '#1a2733' }}>
                        <p className="text-xs" style={{ color: '#8b949e' }}>Step {currentStep + 1}/{totalSteps}</p>
                        <p className="text-sm font-bold" style={{ color: '#c9d1d9' }}>{currentStepData?.description}</p>
                        <p className="text-xs mt-1" style={{ color: '#1cb0f6' }}>💡 {currentStepData?.hint}</p>
                    </div>

                    <div
                        ref={mobileTerminalRef}
                        className="h-48 p-3 font-mono text-xs overflow-y-auto"
                        style={{ backgroundColor: '#0d1117' }}
                        onClick={() => inputRef.current?.focus()}
                    >
                        {terminalHistory[currentDevice].map((line, i) => (
                            <div key={i} style={{ color: line.type === 'success' ? '#58cc02' : line.type === 'error' ? '#f85149' : '#c9d1d9' }}>
                                {line.text}
                            </div>
                        ))}
                        <form onSubmit={handleSubmit} className="flex items-center">
                            <span style={{ color: '#8b949e' }}>{getPrompt(currentDevice)}</span>
                            <input
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
                        <div ref={bottomRef} style={{ height: 1 }} />
                    </div>
                </div>
            </div>

            {/* Lab Complete Modal */}
            {isLabComplete && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: '#161b22' }}>
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-black mb-2" style={{ color: '#58cc02' }}>Lab Complete!</h2>
                        <p className="mb-4" style={{ color: '#8b949e' }}>
                            You earned <span className="font-bold text-yellow-400">{xpEarned} XP</span>!
                        </p>
                        <button
                            onClick={onComplete}
                            className="px-6 py-3 rounded-xl font-bold"
                            style={{ backgroundColor: '#58cc02', color: '#000' }}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ENSALabActivity;
