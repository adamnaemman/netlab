import React, { useState, useEffect, useRef } from 'react';

const PhysicalLabSim = ({ onClose }) => {
    const [step, setStep] = useState('cabling'); // 'cabling', 'putty-setup', 'terminal'
    const [cablingProgress, setCablingProgress] = useState([]);
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

    const cablingSteps = [
        { id: 1, text: 'Connect Console cable from PC to Router Console port', icon: '🔌' },
        { id: 2, text: 'Connect Ethernet cable from PC to Router G0/0/1', icon: '🌐' },
        { id: 3, text: 'Power on the Router and wait for system LEDs', icon: '⚡' },
        { id: 4, text: 'Open Terminal Emulation software on PC', icon: '🖥️' }
    ];

    const handleCabling = (id) => {
        if (cablingProgress.includes(id)) {
            setCablingProgress(prev => prev.filter(i => i !== id));
        } else {
            setCablingProgress(prev => [...prev, id]);
        }
    };

    const runCommand = (cmd) => {
        let output = [];
        const cleanCmd = cmd.toLowerCase().trim();

        if (cleanCmd === 'enable') {
            setHostname('Router#');
        } else if (cleanCmd === 'conf t' || cleanCmd === 'configure terminal') {
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="w-full max-w-4xl h-[85vh] bg-[#1a1a1a] rounded-3xl border-2 border-[#f0883e] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(240,136,62,0.2)]">

                {/* Win95/PuTTY Style Header */}
                <div className="bg-gradient-to-r from-[#f0883e] to-[#ffc800] p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🛠️</span>
                        <h2 className="font-black text-[#000] uppercase tracking-tighter">Physical Lab Training Mode</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center font-bold text-black transition-all">✕</button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Sidebar Steps */}
                    <div className="w-full md:w-72 bg-[#141414] border-b md:border-b-0 md:border-r border-[#333] p-4 md:p-6 space-y-4 md:y-6 overflow-y-auto max-h-[40%] md:max-h-full">
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-[#f0883e] uppercase tracking-widest">Procedural Steps</h3>
                            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
                                {cablingSteps.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleCabling(s.id)}
                                        className={`flex-shrink-0 w-64 md:w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${cablingProgress.includes(s.id)
                                                ? 'bg-[#f0883e]/10 border-[#f0883e] scale-[0.98]'
                                                : 'bg-[#000] border-[#333] opacity-60'
                                            }`}
                                    >
                                        <span className="text-lg md:text-xl">{s.icon}</span>
                                        <span className={`text-[10px] md:text-xs font-bold leading-tight ${cablingProgress.includes(s.id) ? 'text-white' : 'text-[#888]'}`}>
                                            {s.text}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {cablingProgress.length === cablingSteps.length && step === 'cabling' && (
                            <button
                                onClick={() => setStep('putty-setup')}
                                className="w-full py-3 md:py-4 bg-[#f0883e] text-black font-black rounded-xl shadow-[0_4px_0_#9a5020] active:translate-y-1 active:shadow-none transition-all animate-bounce text-sm"
                            >
                                START PUTTY →
                            </button>
                        )}
                    </div>

                    {/* Main Stage */}
                    <div className="flex-1 bg-black relative flex flex-col p-4 md:p-8 items-center justify-center overflow-hidden">

                        {step === 'cabling' && (
                            <div className="text-center space-y-4 md:space-y-6">
                                <div className="relative group mx-auto w-32 md:w-48">
                                    <div className="absolute -inset-4 bg-[#f0883e] opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity"></div>
                                    <img
                                        src="https://img.icons8.com/isometric/512/server.png"
                                        alt="hardware"
                                        className="w-full h-auto relative drop-shadow-2xl"
                                    />
                                </div>
                                <h2 className="text-xl md:text-3xl font-black text-white italic tracking-tighter">Hardware Setup Required</h2>
                                <p className="text-[#888] text-[10px] md:text-xs max-w-sm mx-auto">Sila lengkapkan prosedur cabling kat sidebar untuk teruskan ke terminal configuration.</p>
                            </div>
                        )}

                        {step === 'putty-setup' && (
                            <div className="w-full max-w-xs md:w-96 bg-[#c0c0c0] p-0.5 md:p-1 border-2 border-[#fff] border-r-[#808080] border-b-[#808080] shadow-xl text-black font-sans overflow-hidden">
                                {/* PuTTY Window Title */}
                                <div className="bg-[#000080] p-1 flex justify-between items-center mb-2 md:mb-4">
                                    <span className="text-white text-[10px] font-bold px-1 truncate">PuTTY Configuration</span>
                                    <div className="flex gap-1 px-1 flex-shrink-0">
                                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#c0c0c0] border border-[#fff] border-r-[#808080] border-b-[#808080]"></div>
                                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#c0c0c0] border border-[#fff] border-r-[#808080] border-b-[#808080]"></div>
                                    </div>
                                </div>

                                <div className="p-2 md:p-4 space-y-4 md:space-y-6">
                                    <div className="border border-[#808080] p-2 md:p-4 relative">
                                        <span className="absolute -top-2 left-2 bg-[#c0c0c0] px-1 text-[8px] md:text-[10px]">Session Specification</span>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-2 md:gap-4">
                                                {['Telnet', 'SSH', 'Serial'].map(type => (
                                                    <label key={type} className="flex items-center gap-1.5 text-[10px] md:text-xs">
                                                        <input
                                                            type="radio"
                                                            checked={puttyConfig.connectionType === type}
                                                            onChange={() => setPuttyConfig({ ...puttyConfig, connectionType: type })}
                                                        /> {type}
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 md:gap-4 text-[10px] md:text-xs">
                                                <div className="flex-1">
                                                    <p className="text-[8px] md:text-[10px]">Serial Line</p>
                                                    <input type="text" value={puttyConfig.serialLine} className="w-full border-2 border-[#808080] border-t-[#000] border-l-[#000] bg-white px-1 h-5 md:h-6" readOnly />
                                                </div>
                                                <div className="w-16 md:w-24">
                                                    <p className="text-[8px] md:text-[10px]">Speed</p>
                                                    <input type="text" value={puttyConfig.speed} className="w-full border-2 border-[#808080] border-t-[#000] border-l-[#000] bg-white px-1 h-5 md:h-6" readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-1.5 md:gap-2">
                                        <button
                                            onClick={() => setStep('terminal')}
                                            className="px-4 md:px-6 py-1 bg-[#c0c0c0] border-2 border-[#fff] border-r-[#000] border-b-[#000] active:border-[#808080] active:border-t-[#000] active:border-l-[#000] text-[10px] md:text-xs font-bold"
                                        >
                                            Open
                                        </button>
                                        <button onClick={onClose} className="px-4 md:px-6 py-1 bg-[#c0c0c0] border-2 border-[#fff] border-r-[#000] border-b-[#000] text-[10px] md:text-xs font-bold">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'terminal' && (
                            <div className="w-full h-full flex flex-col bg-black border-2 md:border-4 border-[#333] rounded-lg overflow-hidden group">
                                <div className="bg-[#333] p-1 flex justify-between items-center px-2 md:px-4">
                                    <span className="text-[8px] md:text-[10px] text-white font-mono opacity-50">COM1 - PuTTY (9600 bps)</span>
                                    <div className="flex gap-2 md:gap-4">
                                        <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
                                        <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-red-500 opacity-20"></span>
                                    </div>
                                </div>
                                <div className="flex-1 p-3 md:p-6 font-mono text-[11px] md:text-sm overflow-y-auto text-[#c9d1d9] space-y-0.5 md:space-y-1 scrollbar-thin scrollbar-thumb-white/10">
                                    {terminalLines.map((line, i) => (
                                        <div key={i} className={
                                            line.type === 'system' ? 'text-[#8b949e] italic mb-2 md:mb-4' :
                                                line.type === 'input' ? 'text-white' : 'text-[#7ee787]'
                                        }>
                                            {line.text}
                                        </div>
                                    ))}
                                    <div className="flex items-center">
                                        <span className="mr-1.5 md:mr-2 text-white shrink-0">{hostname}</span>
                                        <input
                                            autoFocus
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    runCommand(input);
                                                    setInput('');
                                                }
                                            }}
                                            className="flex-1 bg-transparent border-none outline-none caret-[#7ee787] min-w-0"
                                            spellCheck={false}
                                        />
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
