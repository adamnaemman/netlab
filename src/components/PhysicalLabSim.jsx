import React, { useState, useEffect, useRef } from 'react';

const PhysicalLabSim = ({ onClose }) => {
    const [step, setStep] = useState('cabling'); // 'cabling', 'putty-setup', 'terminal'
    const [selectedCable, setSelectedCable] = useState(null);
    const [connections, setConnections] = useState([]);
    const [dragPoint, setDragPoint] = useState(null);
    const [activeSource, setActiveSource] = useState(null);
    const [activeDevice, setActiveDevice] = useState('R1');
    const [feedback, setFeedback] = useState('Sila sambungkan kabel ikut topology R1--S1--S2--R2.');

    // Multi-device terminal state
    const [deviceStates, setDeviceStates] = useState({
        R1: { hostname: 'Router', history: [{ text: '--- PuTTY R1 Log Start ---', type: 'system' }], currentInput: '' },
        R2: { hostname: 'Router', history: [{ text: '--- PuTTY R2 Log Start ---', type: 'system' }], currentInput: '' },
        S1: { hostname: 'Switch', history: [{ text: '--- PuTTY S1 Log Start ---', type: 'system' }], currentInput: '' },
        S2: { hostname: 'Switch', history: [{ text: '--- PuTTY S2 Log Start ---', type: 'system' }], currentInput: '' },
    });

    const bottomRef = useRef(null);
    const rackRef = useRef(null);

    const devices = {
        R1: {
            id: 'R1', type: 'router', ports: [
                { id: 'R1-console', name: 'Console', type: 'console', x: 80, y: 40, color: '#3b82f6' },
                { id: 'R1-g0/0/1', name: 'G0/0/1', type: 'ethernet', x: 20, y: 40, color: '#fbbf24' }
            ]
        },
        S1: {
            id: 'S1', type: 'switch', ports: [
                { id: 'S1-console', name: 'Console', type: 'console', x: 80, y: 40, color: '#3b82f6' },
                { id: 'S1-f0/1', name: 'F0/1', type: 'ethernet', x: 10, y: 40, color: '#fbbf24' },
                { id: 'S1-f0/5', name: 'F0/5', type: 'ethernet', x: 30, y: 40, color: '#fbbf24' }
            ]
        },
        S2: {
            id: 'S2', type: 'switch', ports: [
                { id: 'S2-console', name: 'Console', type: 'console', x: 80, y: 40, color: '#3b82f6' },
                { id: 'S2-f0/1', name: 'F0/1', type: 'ethernet', x: 10, y: 40, color: '#fbbf24' },
                { id: 'S2-f0/5', name: 'F0/5', type: 'ethernet', x: 30, y: 40, color: '#fbbf24' }
            ]
        },
        R2: {
            id: 'R2', type: 'router', ports: [
                { id: 'R2-console', name: 'Console', type: 'console', x: 80, y: 40, color: '#3b82f6' },
                { id: 'R2-g0/0/1', name: 'G0/0/1', type: 'ethernet', x: 20, y: 40, color: '#fbbf24' }
            ]
        },
        PC: {
            id: 'PC', type: 'pc', ports: [
                { id: 'PC-rs232', name: 'RS-232', type: 'console', x: 50, y: 40, color: '#3b82f6' }
            ]
        }
    };

    const handlePortClick = (deviceId, port) => {
        if (!selectedCable) {
            setFeedback('⚠️ Pilih jenis kabel dulu!');
            return;
        }

        if (activeSource) {
            if (activeSource.deviceId === deviceId) {
                setFeedback('⚠️ Jangan sambung kat device yang sama!');
                setActiveSource(null);
                setDragPoint(null);
                return;
            }

            if (selectedCable !== port.type || selectedCable !== activeSource.port.type) {
                setFeedback('❌ Salah port! Biru=Console, Kuning=Ethernet.');
                setActiveSource(null);
                setDragPoint(null);
                return;
            }

            setConnections([...connections, { type: selectedCable, from: activeSource, to: { deviceId, port } }]);
            setActiveSource(null);
            setDragPoint(null);
            setFeedback('✅ Sambungan berjaya!');
        } else {
            setActiveSource({ deviceId, port });
            setFeedback(`Pegang kabel ${selectedCable}... Sambung ke mana?`);
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

    const isCablingComplete = () => {
        const hasR1_S1 = connections.some(c => (c.from.port.id === 'R1-g0/0/1' && c.to.port.id === 'S1-f0/5') || (c.from.port.id === 'S1-f0/5' && c.to.port.id === 'R1-g0/0/1'));
        const hasS1_S2 = connections.some(c => (c.from.port.id === 'S1-f0/1' && c.to.port.id === 'S2-f0/1') || (c.from.port.id === 'S2-f0/1' && c.to.port.id === 'S1-f0/1'));
        const hasS2_R2 = connections.some(c => (c.from.port.id === 'S2-f0/5' && c.to.port.id === 'R2-g0/0/1') || (c.from.port.id === 'R2-g0/0/1' && c.to.port.id === 'S2-f0/5'));
        return hasR1_S1 && hasS1_S2 && hasS2_R2;
    };

    const getConnectedConsoleDevice = () => {
        const pcConn = connections.find(c => c.from.port.id === 'PC-rs232' || c.to.port.id === 'PC-rs232');
        if (!pcConn) return null;
        return pcConn.from.port.id === 'PC-rs232' ? pcConn.to.deviceId : pcConn.from.deviceId;
    };

    const runCommand = (cmd) => {
        if (!cmd.trim()) return;
        const state = deviceStates[activeDevice];
        let newHostname = state.hostname;
        let output = [];
        const cleanCmd = cmd.toLowerCase().trim();

        if (cleanCmd === 'enable') newHostname = activeDevice === 'R1' || activeDevice === 'R2' ? 'Router#' : 'Switch#';
        else if (cleanCmd.startsWith('hostname ')) newHostname = `${cmd.split(' ')[1]}(config)#`;
        else output.push(`Executing: ${cmd}...`);

        setDeviceStates({
            ...deviceStates,
            [activeDevice]: {
                ...state,
                hostname: newHostname,
                history: [...state.history, { text: `${state.hostname} ${cmd}`, type: 'input' }, ...output.map(o => ({ text: o, type: 'output' }))]
            }
        });
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [deviceStates, activeDevice]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-md overflow-hidden">
            <div className="w-full max-w-6xl h-[95vh] md:h-[90vh] bg-[#0a0a0a] rounded-3xl border-2 border-[#f0883e] flex flex-col overflow-hidden shadow-[0_0_80px_rgba(240,136,62,0.3)]">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#f0883e] to-[#ffc800] p-3 md:p-4 flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3 text-black">
                        <span className="text-2xl">⚡</span>
                        <h2 className="font-black uppercase italic tracking-tighter">Enterprise Networking Workshop Lab</h2>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center font-bold text-black transition-all rotate-45 hover:rotate-90">✕</button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Tool Sidebar */}
                    <div className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-4">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <h3 className="text-[10px] font-black text-[#f0883e] uppercase mb-2">Lab Controls</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button onClick={() => setSelectedCable('console')} className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${selectedCable === 'console' ? 'border-blue-500 bg-blue-500/20' : 'border-white/10 opacity-50'}`}>
                                    <div className="w-3 h-3 rounded-full bg-blue-500" /> <span className="text-[10px] text-white">Console Cable</span>
                                </button>
                                <button onClick={() => setSelectedCable('ethernet')} className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${selectedCable === 'ethernet' ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 opacity-50'}`}>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" /> <span className="text-[10px] text-white">Ethernet Cable</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                            <p className="text-[10px] text-red-500 italic leading-tight">{feedback}</p>
                        </div>
                        {isCablingComplete() && step === 'cabling' && (
                            <button onClick={() => setStep('terminal')} className="w-full py-4 bg-[#f0883e] text-black font-black rounded-xl animate-bounce">MASUK CLI →</button>
                        )}
                    </div>

                    {/* Workspace */}
                    <div className="flex-1 bg-black relative p-4 flex flex-col overflow-hidden" onMouseMove={handleMouseMove} ref={rackRef}>
                        {step === 'cabling' ? (
                            <div className="flex-1 flex flex-col items-center gap-4 relative">
                                {/* SVG Cables */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                                    {connections.map((c, i) => (
                                        <line key={i} x1={`${c.from.port.x}%`} y1={`${c.from.deviceId === 'PC' ? 80 : 20 + Object.keys(devices).indexOf(c.from.deviceId) * 15}%`} x2={`${c.to.port.x}%`} y2={`${c.to.deviceId === 'PC' ? 80 : 20 + Object.keys(devices).indexOf(c.to.deviceId) * 15}%`} stroke={c.type === 'console' ? '#3b82f6' : '#fbbf24'} strokeWidth="3" />
                                    ))}
                                    {activeSource && dragPoint && (
                                        <line x1={`${activeSource.port.x}%`} y1={`${activeSource.deviceId === 'PC' ? 80 : 20 + Object.keys(devices).indexOf(activeSource.deviceId) * 15}%`} x2={`${dragPoint.x}%`} y2={`${dragPoint.y}%`} stroke={selectedCable === 'console' ? '#3b82f6' : '#fbbf24'} strokeWidth="2" strokeDasharray="5,5" />
                                    )}
                                </svg>

                                {/* Device Racks */}
                                {Object.values(devices).map((dev, idx) => (
                                    <div key={dev.id} className="w-full max-w-4xl h-20 bg-zinc-900 border border-white/10 rounded flex items-center p-4 relative">
                                        <div className="text-[10px] font-black w-12 text-zinc-500">{dev.id}</div>
                                        <div className="flex gap-4 flex-1 justify-center">
                                            {dev.ports.map(p => (
                                                <button key={p.id} onClick={() => handlePortClick(dev.id, p)} className={`w-10 h-10 border-2 border-black rounded transition-all ${activeSource?.port.id === p.id ? 'bg-orange-500 scale-110' : 'bg-zinc-800'}`}>
                                                    <span className="text-[6px] text-white/50">{p.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col bg-[#111] rounded-xl border border-white/10 overflow-hidden">
                                <div className="bg-[#222] p-2 flex gap-2 overflow-x-auto border-b border-white/10">
                                    {Object.keys(deviceStates).map(d => (
                                        <button key={d} onClick={() => setActiveDevice(d)} className={`px-4 py-1 rounded text-[10px] font-black transition-all ${activeDevice === d ? 'bg-[#f0883e] text-black shadow-[0_0_10px_#f0883e]' : 'bg-white/5 text-white/50'}`}>{d}</button>
                                    ))}
                                </div>
                                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto text-[#7ee787] space-y-1">
                                    {deviceStates[activeDevice].history.map((l, i) => (
                                        <div key={i} className={l.type === 'input' ? 'text-white' : l.type === 'system' ? 'text-blue-400 italic' : ''}>{l.text}</div>
                                    ))}
                                    <div className="flex items-center">
                                        <span className="mr-2 text-white">{deviceStates[activeDevice].hostname}</span>
                                        <input autoFocus value={deviceStates[activeDevice].currentInput} onChange={(e) => setDeviceStates({ ...deviceStates, [activeDevice]: { ...deviceStates[activeDevice], currentInput: e.target.value } })} onKeyDown={(e) => { if (e.key === 'Enter') { runCommand(deviceStates[activeDevice].currentInput); setDeviceStates({ ...deviceStates, [activeDevice]: { ...deviceStates[activeDevice], currentInput: '' } }); } }} className="flex-1 bg-transparent border-none outline-none caret-white" />
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
