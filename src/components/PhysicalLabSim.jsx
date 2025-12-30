import React, { useState, useEffect, useRef } from 'react';
import { enterpriseLabData, totalXP, totalSteps } from '../data/enterpriseLab';

const PhysicalLabSim = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [currentDevice, setCurrentDevice] = useState('R1');
    const [xpEarned, setXpEarned] = useState(0);
    const [input, setInput] = useState('');
    const [terminalHistory, setTerminalHistory] = useState({
        R1: [{ type: 'system', text: 'Router>' }],
        R2: [{ type: 'system', text: 'Router>' }],
        S1: [{ type: 'system', text: 'Switch>' }],
        S2: [{ type: 'system', text: 'Switch>' }]
    });
    const [deviceModes, setDeviceModes] = useState({
        R1: 'user', R2: 'user', S1: 'user', S2: 'user'
    });
    const [deviceHostnames, setDeviceHostnames] = useState({
        R1: 'Router', R2: 'Router', S1: 'Switch', S2: 'Switch'
    });
    const [expandedPart, setExpandedPart] = useState(1);
    const [showCelebration, setShowCelebration] = useState(false);
    const [activeTab, setActiveTab] = useState('terminal'); // 'terminal', 'instructions', 'status'
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const currentStepData = enterpriseLabData.labSteps[currentStep];
    const progress = (completedSteps.length / totalSteps) * 100;

    const getPrompt = (device) => {
        const hostname = deviceHostnames[device];
        const mode = deviceModes[device];
        switch (mode) {
            case 'user': return `${hostname}>`;
            case 'privileged': return `${hostname}#`;
            case 'config': return `${hostname}(config)#`;
            case 'interface': return `${hostname}(config-if)#`;
            case 'line': return `${hostname}(config-line)#`;
            case 'router': return `${hostname}(config-router)#`;
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

        const step = enterpriseLabData.labSteps[currentStep];
        const device = currentDevice;
        const prompt = getPrompt(device);
        const typedCommand = input.trim();

        setTerminalHistory(prev => ({
            ...prev,
            [device]: [...prev[device], { type: 'input', text: `${prompt} ${input}` }]
        }));

        // Check if on correct device
        if (device !== step.device) {
            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], { type: 'error', text: `⚠️ Switch to ${step.device} to continue this step` }]
            }));
            setInput('');
            return;
        }

        // Check if command is correct
        if (checkCommand(input, step.command, step.alternates)) {
            let newMode = deviceModes[device];
            let newHostname = deviceHostnames[device];

            // Mode transitions
            if (input.toLowerCase() === 'enable') newMode = 'privileged';
            else if (input.toLowerCase().match(/^conf(?:igure)?\s*t(?:erminal)?$/)) newMode = 'config';
            else if (input.toLowerCase().match(/^line\s+(console|con|vty)\s+/)) newMode = 'line';
            else if (input.toLowerCase().match(/^router\s+ospf\s+\d+$/)) newMode = 'router';
            else if (input.toLowerCase().match(/^int(?:erface)?\s+/)) newMode = 'interface';
            else if (input.toLowerCase() === 'exit') {
                if (['interface', 'line', 'router'].includes(newMode)) newMode = 'config';
                else if (newMode === 'config') newMode = 'privileged';
            } else if (input.toLowerCase() === 'end') newMode = 'privileged';
            else if (input.toLowerCase().match(/^hostname\s+(\S+)$/)) newHostname = input.split(/\s+/)[1];

            setDeviceModes(prev => ({ ...prev, [device]: newMode }));
            setDeviceHostnames(prev => ({ ...prev, [device]: newHostname }));
            setXpEarned(prev => prev + step.xp);

            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], { type: 'success', text: `✅ Correct! +${step.xp} XP` }]
            }));

            setCompletedSteps(prev => {
                const newCompleted = [...prev, currentStep];
                if (newCompleted.length === totalSteps) {
                    setTimeout(() => setShowCelebration(true), 1500);
                }
                return newCompleted;
            });

            if (currentStep < totalSteps - 1) {
                const nextStep = enterpriseLabData.labSteps[currentStep + 1];
                setCurrentStep(currentStep + 1);
                if (nextStep.device !== device) {
                    setTerminalHistory(prev => ({
                        ...prev,
                        [device]: [...prev[device], { type: 'system', text: `➡️ Next: Switch to ${nextStep.device}` }]
                    }));
                }
            }
        } else {
            setTerminalHistory(prev => ({
                ...prev,
                [device]: [...prev[device], { type: 'error', text: `❌ Incorrect. Expected: ${step.command}` }]
            }));
        }

        setInput('');
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalHistory, currentDevice]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [currentDevice]);

    const partSteps = (part) => enterpriseLabData.labSteps.filter(s => s.part === part);
    const partProgress = (part) => {
        const steps = partSteps(part);
        const completed = steps.filter(s => completedSteps.includes(enterpriseLabData.labSteps.indexOf(s))).length;
        return { completed, total: steps.length };
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden font-sans">
            <div className="w-full h-full max-w-[1920px] bg-[#0d1117] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#f0883e] to-[#ffc800] p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">🌐</span>
                        <div>
                            <h1 className="text-xl font-black text-black uppercase tracking-tight">Enterprise Networking Workshop</h1>
                            <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Practical Lab Activity - OSPFv2</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-black/50 uppercase">Progress</p>
                            <p className="text-xl font-black text-black">{completedSteps.length}/{totalSteps}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-black/50 uppercase">XP Earned</p>
                            <p className="text-xl font-black text-black">{xpEarned}/{totalXP}</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/30 flex items-center justify-center font-bold text-black transition-all">✕</button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-black/50 shrink-0">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex-1 flex overflow-hidden relative">
                    {/* Desktop Sidebar / Mobile Instructions Tab */}
                    <div className={`${activeTab === 'instructions' ? 'flex' : 'hidden md:flex'} w-full md:w-96 bg-[#161b22] border-r border-[#30363d] flex-col overflow-hidden shrink-0 absolute inset-0 z-10 md:relative md:z-0`}>
                        <div className="p-4 border-b border-[#30363d] shrink-0 flex justify-between items-center">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Lab Instructions</h2>
                            <span className="md:hidden text-[10px] font-bold text-[#f0883e] bg-[#f0883e]/10 px-2 py-1 rounded">Part {expandedPart}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {[1, 2, 3].map(part => {
                                const { completed, total } = partProgress(part);
                                const partTitle = part === 1 ? 'Basic Device Settings' : part === 2 ? 'OSPFv2 Configuration' : 'Optimize OSPFv2';
                                return (
                                    <div key={part} className="bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden">
                                        <button
                                            onClick={() => setExpandedPart(expandedPart === part ? 0 : part)}
                                            className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${completed === total ? 'bg-green-500 text-black' : 'bg-[#30363d] text-white/50'}`}>{part}</span>
                                                <div className="text-left">
                                                    <p className="text-xs font-black text-white uppercase">Part {part}</p>
                                                    <p className="text-[10px] text-white/40">{partTitle}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#f0883e]">{completed}/{total}</span>
                                        </button>

                                        {expandedPart === part && (
                                            <div className="border-t border-[#30363d] p-3 space-y-2 max-h-64 overflow-y-auto">
                                                {partSteps(part).map((step, idx) => {
                                                    const stepIndex = enterpriseLabData.labSteps.indexOf(step);
                                                    const isCompleted = completedSteps.includes(stepIndex);
                                                    const isCurrent = currentStep === stepIndex;
                                                    return (
                                                        <div
                                                            key={step.id}
                                                            className={`p-3 rounded-lg border transition-all ${isCurrent ? 'border-[#f0883e] bg-[#f0883e]/10' : isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-[#30363d] opacity-50'}`}
                                                        >
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#f0883e]' : isCompleted ? 'text-green-500' : 'text-white/40'}`}>
                                                                    {step.device} - Step {step.step}
                                                                </span>
                                                                {isCompleted && <span className="text-green-500 text-xs">✓</span>}
                                                            </div>
                                                            <p className="text-[10px] text-white/60 leading-relaxed">{step.desc}</p>
                                                            {isCurrent && (
                                                                <div className="mt-2 p-2 bg-black/50 rounded font-mono text-[10px] text-[#7ee787]">
                                                                    {step.command}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className={`${activeTab === 'instructions' ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col overflow-hidden`}>
                        {/* Status/Device Tab (Mobile Only) */}
                        {activeTab === 'status' && (
                            <div className="md:hidden flex-1 overflow-y-auto bg-[#0d1117] p-6 space-y-8 animate-fade-in">
                                <div>
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Device Management</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['R1', 'R2', 'S1', 'S2'].map(dev => (
                                            <button
                                                key={dev}
                                                onClick={() => {
                                                    setCurrentDevice(dev);
                                                    setActiveTab('terminal');
                                                }}
                                                className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${currentDevice === dev ? 'border-[#f0883e] bg-[#f0883e]/10' : 'border-[#30363d] bg-[#161b22]'}`}
                                            >
                                                <span className="text-2xl">{dev.startsWith('R') ? '🌐' : '⏹️'}</span>
                                                <span className={`text-xs font-black ${currentDevice === dev ? 'text-[#f0883e]' : 'text-white'}`}>{dev}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Session Progress</h3>
                                    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-bold text-white/40 uppercase">Total XP</p>
                                                <p className="text-3xl font-black text-[#f0883e] leading-none">{xpEarned}/{totalXP}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-white/40 uppercase">Completed</p>
                                                <p className="text-xl font-black text-white leading-none">{completedSteps.length}/{totalSteps}</p>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#f0883e]" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Terminal (Visible on Desktop always, or Terminal Tab on mobile) */}
                        <div className={`${activeTab === 'terminal' ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col overflow-hidden`}>
                            {/* Device Tabs (Scrollable on mobile) */}
                            <div className="bg-[#161b22] border-b border-[#30363d] p-2 md:p-3 flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
                                {['R1', 'R2', 'S1', 'S2'].map(dev => (
                                    <button
                                        key={dev}
                                        onClick={() => setCurrentDevice(dev)}
                                        className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-black text-[10px] md:text-xs uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${currentDevice === dev ? 'bg-[#f0883e] text-black shadow-lg shadow-[#f0883e]/30' : 'bg-[#21262d] text-white/40 hover:text-white'} ${currentStepData?.device === dev ? 'ring-2 ring-[#f0883e]/50 ring-offset-2 ring-offset-[#161b22]' : ''}`}
                                    >
                                        <span className="text-xs md:text-sm">{dev.startsWith('R') ? '🌐' : '⏹️'}</span>
                                        {dev}
                                    </button>
                                ))}
                            </div>

                            {/* Terminal */}
                            <div className="flex-1 bg-[#0d1117] p-6 overflow-hidden flex flex-col">
                                <div className="flex-1 font-mono text-sm overflow-y-auto space-y-1 text-[#c9d1d9]">
                                    {terminalHistory[currentDevice].map((line, i) => (
                                        <div key={i} className={`leading-relaxed ${line.type === 'input' ? 'text-white font-bold' :
                                            line.type === 'success' ? 'text-green-400 font-bold' :
                                                line.type === 'error' ? 'text-red-400' :
                                                    line.type === 'system' ? 'text-blue-400 italic' : ''
                                            }`}>
                                            {line.text}
                                        </div>
                                    ))}
                                    <div ref={bottomRef} />
                                </div>

                                <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 shrink-0 border-t border-[#30363d] pt-4 md:border-none md:pt-0">
                                    <span className="text-[#f0883e] font-mono font-bold text-xs md:text-sm whitespace-nowrap">{getPrompt(currentDevice)}</span>
                                    <input
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none font-mono text-sm md:text-base text-white caret-[#f0883e] min-w-0"
                                        placeholder="Enter command..."
                                        autoFocus
                                    />
                                </form>
                            </div>
                        </div>

                        {/* Current Step Hint (Desktop only or mobile-specific display?) */}
                        {currentStepData && activeTab !== 'status' && (
                            <div className="bg-[#161b22] border-t border-[#30363d] p-3 md:p-4 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                    <span className={`w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0 flex items-center justify-center font-black text-xs md:text-base ${currentStepData.device === currentDevice ? 'bg-[#f0883e] text-black shadow-lg shadow-[#f0883e]/30' : 'bg-[#30363d] text-white/50'}`}>
                                        {currentStepData.device}
                                    </span>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-bold text-white/40 uppercase leading-none mb-1">Step {currentStep + 1} of {totalSteps}</p>
                                        <p className="text-xs md:text-sm text-white/60 truncate">{currentStepData.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                                    <span className="hidden sm:inline text-[#f0883e] font-black text-xs md:text-sm">+{currentStepData.xp} XP</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(currentStepData.command)}
                                        className="p-2 md:px-4 md:py-2 bg-[#21262d] hover:bg-[#30363d] rounded-lg text-[10px] md:text-xs font-bold text-white/60 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        📄 <span className="hidden md:inline">Copy Hint</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="md:hidden h-20 bg-[#161b22] border-t border-[#30363d] grid grid-cols-3 shrink-0 pb-safe">
                    {[
                        { id: 'instructions', label: 'Steps', icon: '📋' },
                        { id: 'terminal', label: 'Terminal', icon: '⌨️' },
                        { id: 'status', label: 'Status', icon: '📊' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center gap-1 transition-all ${activeTab === tab.id ? 'text-[#f0883e]' : 'text-white/40'}`}
                        >
                            <span className="text-xl shrink-0">{tab.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                            {activeTab === tab.id && <div className="w-8 h-1 bg-[#f0883e] rounded-full mt-1" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Graduation Celebration Modal */}
            {showCelebration && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(40)].map((_, i) => (
                            <div
                                key={i}
                                className="confetti-piece"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    color: ['#f0883e', '#ffc800', '#7ee787', '#3b82f6'][Math.floor(Math.random() * 4)],
                                    fontSize: `${Math.random() * 20 + 10}px`,
                                    animationDuration: `${Math.random() * 2 + 2}s`,
                                    animationDelay: `${Math.random() * 3}s`,
                                }}
                            >
                                {['✨', '⭐', '🎊', '🎉'][Math.floor(Math.random() * 4)]}
                            </div>
                        ))}
                    </div>

                    <div className="w-full max-w-2xl bg-[#0d1117] rounded-[2rem] border-2 border-[#f0883e] p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_100px_rgba(240,136,62,0.3)] animate-zoom-in">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f0883e] via-[#ffc800] to-[#f0883e]" />

                        <div className="mb-8 relative inline-block">
                            <div className="text-8xl animate-slow-bounce">🏆</div>
                            <div className="absolute -top-4 -right-4 bg-green-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">PASSED</div>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                            Lab Complete!
                        </h2>

                        <p className="text-[#7ee787] font-mono text-lg mb-8">
                            Certification of Technical Proficiency
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total XP Earned</p>
                                <p className="text-3xl font-black text-[#f0883e]">{xpEarned}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Steps Mastered</p>
                                <p className="text-3xl font-black text-white">{totalSteps}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={onClose}
                                className="w-full py-5 bg-gradient-to-r from-[#f0883e] to-[#ffc800] rounded-2xl text-black font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#f0883e]/20"
                            >
                                Finish & Return Home
                            </button>
                            <button
                                onClick={() => setShowCelebration(false)}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 font-bold text-xs uppercase transition-all"
                            >
                                Back to Topology View
                            </button>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-40 grayscale">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">⚙️</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">NetLab Certified</span>
                            </div>
                            <span className="text-[8px] font-mono">{new Date().toLocaleDateString()} // SESSION_COMPLETED</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhysicalLabSim;
