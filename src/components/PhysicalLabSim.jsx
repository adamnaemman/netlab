import React, { useState, useEffect, useRef } from 'react';

const PhysicalLabSim = ({ onClose }) => {
    const [view, setView] = useState('workspace'); // 'workspace', 'terminal'
    const [devices, setDevices] = useState([]); // { id, type, x, y, name, hostname, history }
    const [connections, setConnections] = useState([]); // { id, from {devId, portId}, to {devId, portId}, type }
    const [selectedCable, setSelectedCable] = useState(null);
    const [activeSource, setActiveSource] = useState(null);
    const [dragPoint, setDragPoint] = useState(null);
    const [activeDevice, setActiveDevice] = useState(null);
    const [feedback, setFeedback] = useState('Pilih device dari toolbox dan letakkan dalam workspace.');
    const [draggingDevice, setDraggingDevice] = useState(null);

    const workspaceRef = useRef(null);
    const bottomRef = useRef(null);

    const deviceTypes = {
        router: {
            type: 'router', icon: '🌐', label: 'Router (2911)', ports: [
                { id: 'g00', name: 'G0/0', type: 'ethernet', x: 20, y: 50 },
                { id: 'g01', name: 'G0/1', type: 'ethernet', x: 40, y: 50 },
                { id: 'console', name: 'Console', type: 'console', x: 80, y: 50 }
            ]
        },
        switch: {
            type: 'switch', icon: '⏹️', label: 'Switch (2960)', ports: [
                { id: 'f01', name: 'F0/1', type: 'ethernet', x: 10, y: 50 },
                { id: 'f05', name: 'F0/5', type: 'ethernet', x: 30, y: 50 },
                { id: 'f010', name: 'F0/10', type: 'ethernet', x: 50, y: 50 },
                { id: 'console', name: 'Console', type: 'console', x: 85, y: 50 }
            ]
        },
        pc: {
            type: 'pc', icon: '🖥️', label: 'PC-PT', ports: [
                { id: 'fe0', name: 'FastEthernet0', type: 'ethernet', x: 50, y: 30 },
                { id: 'rs232', name: 'RS-232', type: 'console', x: 50, y: 70 }
            ]
        }
    };

    const addDevice = (type) => {
        const id = `${type}-${Date.now()}`;
        const newDev = {
            id,
            type,
            x: 50 + (devices.length * 10),
            y: 50 + (devices.length * 5),
            name: `${type.toUpperCase()}${devices.filter(d => d.type === type).length + 1}`,
            hostname: type === 'pc' ? 'PC' : (type === 'router' ? 'Router' : 'Switch'),
            history: [{ text: `--- Initializing ${type.toUpperCase()} ---`, type: 'system' }]
        };
        setDevices([...devices, newDev]);
        setFeedback(`Device ${newDev.name} ditambahkan. Letakkannya di posisi yang sesuai.`);
    };

    const handlePortClick = (e, devId, port) => {
        e.stopPropagation();
        if (!selectedCable) {
            setFeedback('⚠️ Pilih jenis kabel dulu dari menu tepi!');
            return;
        }

        if (activeSource) {
            if (activeSource.devId === devId) {
                setFeedback('⚠️ Tidak boleh sambung pada device yang sama!');
                setActiveSource(null);
                setDragPoint(null);
                return;
            }

            if (selectedCable !== port.type || selectedCable !== activeSource.port.type) {
                setFeedback('❌ Salah port! Pastikan guna kabel yang betul.');
                setActiveSource(null);
                setDragPoint(null);
                return;
            }

            const connId = `conn-${Date.now()}`;
            setConnections([...connections, { id: connId, from: activeSource, to: { devId, port }, type: selectedCable }]);
            setActiveSource(null);
            setDragPoint(null);
            setFeedback('✅ Sambungan berjaya! Topology dikemaskini.');
        } else {
            setActiveSource({ devId, port });
            setFeedback(`Tengah tarik kabel ${selectedCable}... Sambung ke port device lain.`);
        }
    };

    const handleWorkspaceMouseMove = (e) => {
        if (!workspaceRef.current) return;
        const rect = workspaceRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (activeSource) {
            setDragPoint({ x, y });
        }

        if (draggingDevice) {
            setDevices(devices.map(d => d.id === draggingDevice ? { ...d, x, y } : d));
        }
    };

    const handleDeviceClick = (e, dev) => {
        e.stopPropagation();
        setActiveDevice(dev.id);
        setView('terminal');
    };

    const runCommand = (cmd) => {
        if (!cmd.trim()) return;
        const dev = devices.find(d => d.id === activeDevice);
        let newHostname = dev.hostname;
        let output = [];
        const cleanCmd = cmd.toLowerCase().trim();

        if (cleanCmd === 'enable') newHostname = dev.type === 'pc' ? 'PC>' : (dev.type === 'router' ? 'Router#' : 'Switch#');
        else if (cleanCmd.startsWith('hostname ')) {
            const newName = cmd.split(' ')[1];
            newHostname = `${newName}(config)#`;
        } else {
            output.push(`Executed: ${cmd}`);
        }

        setDevices(devices.map(d => d.id === activeDevice ? {
            ...d,
            hostname: newHostname,
            history: [...d.history, { text: `${d.hostname} ${cmd}`, type: 'input' }, ...output.map(o => ({ text: o, type: 'output' }))]
        } : d));
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [devices, activeDevice, view]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-md overflow-hidden font-sans">
            <div className="w-full max-w-7xl h-[95vh] md:h-[90vh] bg-[#0a0a0a] rounded-3xl border-2 border-[#f0883e] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(240,136,62,0.3)]">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#f0883e] to-[#ffc800] p-3 md:p-4 flex justify-between items-center border-b border-black/20">
                    <div className="flex items-center gap-3 text-black">
                        <span className="text-2xl animate-spin-slow">⚙️</span>
                        <div>
                            <h2 className="font-black uppercase italic tracking-tighter text-sm md:text-lg leading-none">NetLab Dynamic Builder</h2>
                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Experimental Packet Tracer Mode</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('workspace')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${view === 'workspace' ? 'bg-black text-[#f0883e]' : 'text-black/60 hover:text-black'}`}>Workspace</button>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/30 flex items-center justify-center font-bold text-black transition-all rotate-45 hover:rotate-90">✕</button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* Toolbar */}
                    <div className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-col justify-between z-50">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-[#f0883e] uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#f0883e] animate-pulse" /> Toolbox
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
                                    {Object.values(deviceTypes).map(t => (
                                        <button key={t.type} onClick={() => addDevice(t.type)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#f0883e]/50 transition-all flex flex-col items-center gap-1 group">
                                            <span className="text-xl group-hover:scale-110 transition-transform">{t.icon}</span>
                                            <span className="text-[8px] font-bold text-white/50 group-hover:text-white uppercase">{t.type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Connections</h3>
                                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                                    <button onClick={() => setSelectedCable('console')} className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${selectedCable === 'console' ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border-white/5 opacity-40 hover:opacity-100'}`}>
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-[9px] text-white font-bold uppercase">Console</span>
                                    </button>
                                    <button onClick={() => setSelectedCable('ethernet')} className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${selectedCable === 'ethernet' ? 'border-yellow-500 bg-yellow-500/20 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'border-white/5 opacity-40 hover:opacity-100'}`}>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500" /> <span className="text-[9px] text-white font-bold uppercase">Copper</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-[9px] text-white/40 font-bold uppercase mb-1">Status Console</p>
                                <p className="text-[10px] text-[#f0883e] font-black italic leading-tight">{feedback}</p>
                            </div>
                            <button onClick={() => { setDevices([]); setConnections([]); setFeedback('Workspace cleared.'); }} className="w-full py-2 border border-red-500/30 text-red-500/60 text-[9px] font-black uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all">Clear All</button>
                        </div>
                    </div>

                    {/* Workspace Canvas */}
                    <div
                        className="flex-1 bg-black relative overflow-hidden flex flex-col select-none cursor-crosshair"
                        onMouseMove={handleWorkspaceMouseMove}
                        onMouseUp={() => setDraggingDevice(null)}
                        ref={workspaceRef}
                    >
                        {view === 'workspace' ? (
                            <div className="w-full h-full relative">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                                {/* Connection Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                                    {connections.map(c => {
                                        const fromDev = devices.find(d => d.id === c.from.devId);
                                        const toDev = devices.find(d => d.id === c.to.devId);
                                        if (!fromDev || !toDev) return null;
                                        return (
                                            <line
                                                key={c.id}
                                                x1={`${fromDev.x}%`} y1={`${fromDev.y}%`}
                                                x2={`${toDev.x}%`} y2={`${toDev.y}%`}
                                                stroke={c.type === 'console' ? '#3b82f6' : '#fbbf24'}
                                                strokeWidth="2"
                                                className="drop-shadow-lg"
                                            />
                                        );
                                    })}
                                    {activeSource && dragPoint && (
                                        <line
                                            x1={`${devices.find(d => d.id === activeSource.devId)?.x}%`}
                                            y1={`${devices.find(d => d.id === activeSource.devId)?.y}%`}
                                            x2={`${dragPoint.x}%`} y2={`${dragPoint.y}%`}
                                            stroke={selectedCable === 'console' ? '#3b82f6' : '#fbbf24'}
                                            strokeWidth="2"
                                            strokeDasharray="5,5"
                                            className="animate-pulse"
                                        />
                                    )}
                                </svg>

                                {/* Devices */}
                                {devices.map(dev => (
                                    <div
                                        key={dev.id}
                                        className={`absolute w-16 md:w-20 group z-30 transition-transform active:scale-95 ${activeDevice === dev.id ? 'z-40' : ''}`}
                                        style={{ left: `${dev.x}%`, top: `${dev.y}%`, transform: 'translate(-50%, -50%)' }}
                                        onMouseDown={(e) => { e.stopPropagation(); setDraggingDevice(dev.id); }}
                                        onClick={(e) => handleDeviceClick(e, dev)}
                                    >
                                        <div className={`p-3 bg-[#1a1a1a] border-2 rounded-xl flex flex-col items-center gap-1 shadow-2xl transition-all ${activeDevice === dev.id ? 'border-[#f0883e] shadow-[0_0_20px_rgba(240,136,62,0.4)]' : 'border-white/10 group-hover:border-white/30'}`}>
                                            <span className="text-2xl md:text-3xl">{deviceTypes[dev.type].icon}</span>
                                            <span className="text-[8px] md:text-[9px] font-black text-white/50 uppercase truncate w-full text-center">{dev.name}</span>
                                        </div>

                                        {/* Ports Pop-up on Hover */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
                                            <div className="bg-[#222] border border-white/10 rounded-lg p-1.5 flex gap-1.5 shadow-2xl backdrop-blur-md">
                                                {deviceTypes[dev.type].ports.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={(e) => handlePortClick(e, dev.id, p)}
                                                        className={`w-4 h-4 rounded-sm border border-white/10 flex items-center justify-center hover:scale-110 transition-transform ${p.type === 'console' ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}
                                                        title={p.name}
                                                    >
                                                        <div className={`w-1.5 h-1.5 rounded-full ${p.type === 'console' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Terminal Interface (Device Hub) */
                            <div className="w-full h-full flex flex-col bg-[#050505] p-2 md:p-6 overflow-hidden">
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
                                    {devices.map(d => (
                                        <button
                                            key={d.id}
                                            onClick={() => setActiveDevice(d.id)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all shrink-0 ${activeDevice === d.id ? 'bg-[#f0883e] text-black shadow-lg shadow-[#f0883e]/20' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                        >
                                            <span>{deviceTypes[d.type].icon}</span> {d.name}
                                        </button>
                                    ))}
                                    {devices.length === 0 && <p className="text-white/20 text-xs font-bold italic p-4">Tiada device dalam workspace untuk dikonfigurasi...</p>}
                                </div>

                                {activeDevice && devices.find(d => d.id === activeDevice) && (
                                    <div className="flex-1 flex flex-col bg-black border border-white/10 rounded-2xl overflow-hidden shadow-Inner">
                                        <div className="bg-[#111] px-4 py-1.5 border-b border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] text-zinc-500 font-mono italic">COM Session: {devices.find(d => d.id === activeDevice).name}</span>
                                            <div className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 font-mono text-[11px] md:text-sm overflow-y-auto text-[#7ee787] space-y-1 scrollbar-thin scrollbar-thumb-white/10">
                                            {devices.find(d => d.id === activeDevice).history.map((l, i) => (
                                                <div key={i} className={l.type === 'input' ? 'text-white font-bold' : l.type === 'system' ? 'text-blue-400 italic mb-2' : ''}>
                                                    {l.text}
                                                </div>
                                            ))}
                                            <div className="flex items-center group">
                                                <span className="mr-2 text-white/50 font-bold">{devices.find(d => d.id === activeDevice).hostname}</span>
                                                <input
                                                    autoFocus
                                                    placeholder="tulis command di sini..."
                                                    className="flex-1 bg-transparent border-none outline-none caret-[#f0883e] text-white placeholder:text-white/10"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            runCommand(e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div ref={bottomRef} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhysicalLabSim;
