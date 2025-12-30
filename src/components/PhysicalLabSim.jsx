import React, { useState, useEffect, useRef } from 'react';

const PhysicalLabSim = ({ onClose }) => {
    const [step, setStep] = useState('cabling'); // 'cabling', 'putty-setup', 'terminal'
    const [selectedCable, setSelectedCable] = useState(null); // 'console', 'ethernet'
    const [connections, setConnections] = useState([]); // { type, startPort, endPort }
    const [dragPoint, setDragPoint] = useState(null);
    const [activeSource, setActiveSource] = useState(null);
    const [feedback, setFeedback] = useState('Pilih cable dan cucuk ke port yang betul.');

    const [puttyConfig, setPuttyConfig] = useState({
        connectionType: 'Serial',
        serialLine: 'COM1',
        speed: '9600'
    });
    const [terminalLines, setTerminalLines] = useState([
        { text: '--- PuTTY Log Start ---', type: 'system' }
    ]);
    const [input, setInput] = useState('');
    const [hostname, setHostname] = useState('Router');
    const bottomRef = useRef(null);
    const rackRef = useRef(null);

    // Port Definitions (relative to their containers)
    const ports = {
        router: [
            { id: 'r-console', name: 'Console', type: 'console', x: 85, y: 40, color: '#3b82f6' },
            { id: 'r-g00', name: 'G0/0/0', type: 'ethernet', x: 20, y: 40, color: '#fbbf24' },
            { id: 'r-g01', name: 'G0/0/1', type: 'ethernet', x: 45, y: 40, color: '#fbbf24' },
        ],
        pc: [
            { id: 'pc-rs232', name: 'RS-232', type: 'console', x: 75, y: 65, color: '#3b82f6' },
            { id: 'pc-fe', name: 'FastEthernet', type: 'ethernet', x: 75, y: 45, color: '#fbbf24' },
        ]
    };

    const handlePortClick = (device, port) => {
        if (!selectedCable) {
            setFeedback('⚠️ Pilih jenis cable dulu kat atas!');
            return;
        }

        if (activeSource) {
            // Check if user clicked the same device
            if (activeSource.device === device) {
                setFeedback('⚠️ Kena sambung ke device yang lain!');
                setActiveSource(null);
                setDragPoint(null);
                return;
            }

            // Validate connection
            if (selectedCable !== port.type || selectedCable !== activeSource.port.type) {
                setFeedback('❌ Salah jenis port! Gunakan cable yang betul.');
                setActiveSource(null);
                setDragPoint(null);
                return;
            }

            // Create connection
            const newConn = {
                type: selectedCable,
                from: activeSource,
                to: { device, port }
            };

            setConnections([...connections, newConn]);
            setActiveSource(null);
            setDragPoint(null);
            setFeedback('✅ Berjaya sambung! Cari port seterusnya.');
        } else {
            setActiveSource({ device, port });
            setFeedback(`Tengah pegang hujung cable ${selectedCable}... Cucuk ke port mana?`);
        }
    };

    const handleMouseMove = (e) => {
        if (!activeSource || !rackRef.current) return;
        const rect = rackRef.current.getBoundingClientRect();
        setDragPoint({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
    };

    const clearCables = () => {
        setConnections([]);
        setActiveSource(null);
        setDragPoint(null);
        setFeedback('Semua wire dah dicabut. Mula semula.');
    };

    const isCablingComplete = () => {
        const hasConsole = connections.some(c =>
            c.type === 'console' &&
            ((c.from.port.id === 'pc-rs232' && c.to.port.id === 'r-console') ||
                (c.from.port.id === 'r-console' && c.to.port.id === 'pc-rs232'))
        );
        const hasEthernet = connections.some(c =>
            c.type === 'ethernet' &&
            ((c.from.port.id === 'pc-fe' && c.to.port.id === 'r-g01') ||
                (c.from.port.id === 'r-g01' && c.to.port.id === 'pc-fe'))
        );
        return hasConsole && hasEthernet;
    };

    const runCommand = (cmd) => {
        let output = [];
        const cleanCmd = cmd.toLowerCase().trim();
        if (cleanCmd === 'enable') setHostname('Router#');
        else if (cleanCmd === 'conf t' || cleanCmd === 'configure terminal') {
            setHostname('Router(config)#');
            output.push('Enter configuration commands, one per line. End with CNTL/Z.');
        } else if (cleanCmd.startsWith('hostname ')) {
            const newName = cmd.split(' ')[1];
            setHostname(`${newName}(config)#`);
        } else if (cleanCmd === 'exit') {
            if (hostname.includes('(config)')) setHostname('Router#');
            else setHostname('Router');
        } else {
            output.push(`Invalid command: ${cmd}`);
        }

        setTerminalLines(prev => [
            ...prev,
            { text: `${hostname} ${cmd}`, type: 'input' },
            ...output.map(o => ({ text: o, type: 'output' }))
        ]);
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalLines]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-md overflow-hidden">
            <div className="w-full max-w-5xl h-[95vh] md:h-[85vh] bg-[#0a0a0a] rounded-3xl border-2 border-[#f0883e] flex flex-col overflow-hidden shadow-[0_0_80px_rgba(240,136,62,0.3)]">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#f0883e] to-[#ffc800] p-3 md:p-4 flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🛠️</span>
                        <div>
                            <h2 className="font-black text-[#000] uppercase tracking-tighter text-sm md:text-base leading-none">Interactive Cabling Sim</h2>
                            <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest mt-0.5">Physical Implementation Procedural</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center font-bold text-black transition-all hover:rotate-90">✕</button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* Tool Sidebar */}
                    <div className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-4 z-10">
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black text-[#f0883e] uppercase tracking-widest opacity-70">Cable Selection</h3>
                            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                                <button
                                    onClick={() => setSelectedCable('console')}
                                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedCable === 'console' ? 'bg-blue-500/20 border-blue-500' : 'bg-black border-white/5 opacity-50'}`}
                                >
                                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                                    <span className="text-[10px] font-black text-white uppercase italic">Console</span>
                                </button>
                                <button
                                    onClick={() => setSelectedCable('ethernet')}
                                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${selectedCable === 'ethernet' ? 'bg-yellow-500/20 border-yellow-500' : 'bg-black border-white/5 opacity-50'}`}
                                >
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_#fbbf24]" />
                                    <span className="text-[10px] font-black text-white uppercase italic">Ethernet</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[9px] font-bold text-white/50 uppercase mb-1 flex items-center gap-2">
                                <span className="animate-pulse">●</span> Status
                            </p>
                            <p className="text-[11px] font-bold text-[#f0883e] leading-tight italic">{feedback}</p>
                        </div>

                        <div className="space-y-2">
                            <button onClick={clearCables} className="w-full py-2 bg-red-500/20 border border-red-500/50 text-red-500 text-[10px] font-black rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase">Cabut Semua Cable</button>
                            {isCablingComplete() && step === 'cabling' && (
                                <button
                                    onClick={() => setStep('putty-setup')}
                                    className="w-full py-4 bg-[#f0883e] text-black font-black rounded-xl shadow-[0_4px_0_#9a5020] active:translate-y-1 active:shadow-none transition-all animate-bounce text-sm"
                                >
                                    MASUK TERMINAL →
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Workspace */}
                    <div className="flex-1 bg-black relative overflow-hidden flex flex-col p-4" onMouseMove={handleMouseMove}>

                        {step === 'cabling' && (
                            <div className="w-full h-full flex flex-col items-center justify-around relative select-none" ref={rackRef}>

                                {/* SVG Cables Layer */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                                    {connections.map((c, i) => {
                                        const fromX = c.from.device === 'router' ? c.from.port.x * 0.9 + 5 : c.from.port.x * 0.4 + 30;
                                        const fromY = c.from.device === 'router' ? c.from.port.y * 0.2 + 20 : c.from.port.y * 0.4 + 50;
                                        const toX = c.to.device === 'router' ? c.to.port.x * 0.9 + 5 : c.to.port.x * 0.4 + 30;
                                        const toY = c.to.device === 'router' ? c.to.port.y * 0.2 + 20 : c.to.port.y * 0.4 + 50;

                                        return (
                                            <path
                                                key={i}
                                                d={`M ${fromX}% ${fromY}% C ${fromX}% ${fromY + 10}%, ${toX}% ${toY - 10}%, ${toX}% ${toY}%`}
                                                stroke={c.type === 'console' ? '#3b82f6' : '#fbbf24'}
                                                strokeWidth="3"
                                                fill="none"
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]"
                                            />
                                        );
                                    })}
                                    {activeSource && dragPoint && (
                                        <path
                                            d={`M ${activeSource.device === 'router' ? activeSource.port.x * 0.9 + 5 : activeSource.port.x * 0.4 + 30}% ${activeSource.device === 'router' ? activeSource.port.y * 0.2 + 20 : activeSource.port.y * 0.4 + 50}% C ${activeSource.device === 'router' ? activeSource.port.x * 0.9 + 5 : activeSource.port.x * 0.4 + 30}% ${activeSource.device === 'router' ? activeSource.port.y * 0.2 + 30 : activeSource.port.y * 0.4 + 60}%, ${dragPoint.x}% ${dragPoint.y - 10}%, ${dragPoint.x}% ${dragPoint.y}%`}
                                            stroke={selectedCable === 'console' ? '#3b82f6' : '#fbbf24'}
                                            strokeWidth="3"
                                            fill="none"
                                            strokeDasharray="5,5"
                                            className="animate-pulse"
                                        />
                                    )}
                                </svg>

                                {/* Router Visual (Rear View) */}
                                <div className="w-[90%] max-w-[700px] h-32 md:h-40 bg-zinc-800 border-4 border-zinc-900 rounded-lg relative overflow-hidden shadow-2xl flex flex-col group transition-transform hover:scale-[1.01]">
                                    <div className="bg-zinc-900/50 p-2 border-b border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[.2em]">Cisco Integrated Services Router - Rear View</span>
                                        <div className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 flex gap-8 items-center justify-end relative">
                                        {/* Power Port */}
                                        <div className="w-16 h-16 border-2 border-zinc-900 bg-zinc-950 rounded flex items-center justify-center relative">
                                            <div className="w-8 h-8 rounded-full border-4 border-zinc-900" />
                                            <span className="absolute -bottom-4 text-[8px] font-bold text-zinc-600">AC POWER</span>
                                        </div>
                                        {/* Networking Block */}
                                        <div className="flex gap-4 bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                                            {ports.router.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => handlePortClick('router', p)}
                                                    className={`w-12 h-12 md:w-16 md:h-16 border-4 border-zinc-900 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${activeSource?.port.id === p.id ? 'bg-orange-500/20 scale-110 shadow-[0_0_15px_#f0883e]' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                                                >
                                                    <div className="w-6 h-4 md:w-8 md:h-6 bg-black rounded-sm border-2 border-zinc-900 flex flex-col gap-0.5 p-0.5">
                                                        <div className="w-full h-1 bg-zinc-800 rounded-full" />
                                                        <div className="flex justify-around">
                                                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                            <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                        </div>
                                                    </div>
                                                    <span className="text-[6px] md:text-[8px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase">{p.name}</span>
                                                    <div className="w-full h-1" style={{ backgroundColor: p.color + '44' }} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-10 w-24 h-full bg-zinc-900/30 skew-x-[20deg]" />
                                </div>

                                {/* PC Chassis Visual (Rear View - Simplified) */}
                                <div className="w-48 md:w-64 h-64 md:h-80 bg-zinc-800 border-4 border-zinc-900 rounded-t-xl relative overflow-hidden group transition-transform hover:scale-[1.01]">
                                    <div className="h-10 bg-zinc-900 border-b border-white/5 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-zinc-950 rounded-full flex gap-1 items-center justify-center">
                                                <div className="w-0.5 h-4 bg-zinc-800" />
                                                <div className="w-0.5 h-4 bg-zinc-800" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col gap-4 items-center h-full">
                                        <div className="w-full py-4 bg-zinc-950 rounded-lg border border-white/5 flex flex-col items-center gap-6">
                                            {ports.pc.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => handlePortClick('pc', p)}
                                                    className={`w-12 h-10 md:w-16 md:h-12 border-4 border-zinc-900 rounded flex flex-col items-center justify-center gap-1 transition-all ${activeSource?.port.id === p.id ? 'bg-orange-500/20 scale-110 shadow-[0_0_15px_#f0883e]' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                                                >
                                                    <div className="w-8 h-4 bg-black rounded-sm relative">
                                                        <div className="absolute inset-0 flex justify-around items-center px-1">
                                                            <div className="w-1 h-2 bg-zinc-800" />
                                                            <div className="w-1 h-2 bg-zinc-800" />
                                                            <div className="w-1 h-2 bg-zinc-800" />
                                                        </div>
                                                    </div>
                                                    <span className="text-[6px] md:text-[8px] font-black text-zinc-400 uppercase">{p.name}</span>
                                                    <div className="w-full h-1" style={{ backgroundColor: p.color + '44' }} />
                                                </button>
                                            ))}
                                        </div>
                                        {/* IO Ports expansion slot area */}
                                        <div className="flex-1 w-full bg-zinc-900/50 rounded flex flex-col gap-2 p-2 divide-y divide-zinc-950">
                                            {[1, 2, 3].map(i => <div key={i} className="h-4 w-full bg-zinc-800/50" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Traditional Step Views (Putty Setup & Terminal) */}
                        {step === 'putty-setup' && (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-full max-w-sm bg-[#c0c0c0] p-0.5 border-2 border-[#fff] border-r-[#808080] border-b-[#808080] shadow-2xl text-black font-sans">
                                    <div className="bg-[#000080] p-1 flex justify-between items-center mb-4">
                                        <span className="text-white text-[10px] font-bold px-1 truncate">PuTTY Configuration</span>
                                        <div className="flex gap-1 px-1 flex-shrink-0">
                                            <div className="w-3 h-3 bg-[#c0c0c0] border border-[#fff] border-r-[#808080] border-b-[#808080]"></div>
                                            <div className="w-3 h-3 bg-[#c0c0c0] border border-[#fff] border-r-[#808080] border-b-[#808080]"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-6">
                                        <div className="border border-[#808080] p-4 relative">
                                            <span className="absolute -top-2 left-2 bg-[#c0c0c0] px-1 text-[10px]">Session Specification</span>
                                            <div className="space-y-3">
                                                <div className="flex gap-4">
                                                    {['Telnet', 'SSH', 'Serial'].map(type => (
                                                        <label key={type} className="flex items-center gap-1.5 text-xs">
                                                            <input type="radio" checked={puttyConfig.connectionType === type} readOnly /> {type}
                                                        </label>
                                                    ))}
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-[10px]">Serial Line</p>
                                                        <input type="text" value={puttyConfig.serialLine} className="w-full border-2 border-[#808080] border-t-[#000] border-l-[#000] bg-white px-1 h-6" readOnly />
                                                    </div>
                                                    <div className="w-24">
                                                        <p className="text-[10px]">Speed</p>
                                                        <input type="text" value={puttyConfig.speed} className="w-full border-2 border-[#808080] border-t-[#000] border-l-[#000] bg-white px-1 h-6" readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 text-xs font-bold">
                                            <button onClick={() => setStep('terminal')} className="px-6 py-1 bg-[#c0c0c0] border-2 border-[#fff] border-r-[#000] border-b-[#000] active:translate-y-[1px]">Open</button>
                                            <button onClick={onClose} className="px-6 py-1 bg-[#c0c0c0] border-2 border-[#fff] border-r-[#000] border-b-[#000]">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'terminal' && (
                            <div className="w-full h-full flex flex-col bg-black border-4 border-[#333] rounded-lg overflow-hidden group">
                                <div className="bg-[#333] p-1 flex justify-between items-center px-4">
                                    <span className="text-[10px] text-white font-mono opacity-50">COM1 - PuTTY (9600 bps)</span>
                                    <div className="flex gap-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-20" />
                                    </div>
                                </div>
                                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto text-[#c9d1d9] space-y-1 scrollbar-thin scrollbar-thumb-white/10">
                                    {terminalLines.map((line, i) => (
                                        <div key={i} className={line.type === 'system' ? 'text-[#8b949e] italic mb-4' : line.type === 'input' ? 'text-white' : 'text-[#7ee787]'}>{line.text}</div>
                                    ))}
                                    <div className="flex items-center">
                                        <span className="mr-2 text-white">{hostname}</span>
                                        <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { runCommand(input); setInput(''); } }} className="flex-1 bg-transparent border-none outline-none caret-[#7ee787]" />
                                    </div>
                                    <div ref={bottomRef} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhysicalLabSim;
