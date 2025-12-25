import { useState, useRef, useEffect } from 'react';
import { useLab } from '../context/LabContext';

const VirtualTerminal = () => {
    const { state, currentDevice, currentPrompt, executeCommand, clearTerminal } = useLab();
    const [input, setInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const outputRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [state.outputHistory]);

    // Focus input
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const history = state.commandHistory;
            if (history.length > 0) {
                const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex] || '');
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(state.commandHistory[state.commandHistory.length - 1 - newIndex] || '');
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            clearTerminal();
        }
    };

    const handleSubmit = () => {
        if (input.trim()) {
            executeCommand(input.trim());
            setHistoryIndex(-1);
        }
        setInput('');
    };

    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    const renderOutputLine = (line, index) => {
        const baseClass = 'animate-fade-in';

        switch (line.type) {
            case 'command':
                return (
                    <div key={index} className={`terminal-line ${baseClass}`}>
                        <span className="terminal-prompt">{line.prompt}</span>
                        <span className="terminal-output">{line.content}</span>
                    </div>
                );
            case 'output':
                return (
                    <div key={index} className={`terminal-output ${baseClass}`}>
                        {line.content}
                    </div>
                );
            case 'error':
                return (
                    <div key={index} className={`terminal-error ${baseClass}`}>
                        % {line.content}
                    </div>
                );
            case 'success':
                return (
                    <div key={index} className={`terminal-success ${baseClass} font-semibold`}>
                        {line.content}
                    </div>
                );
            case 'warning':
                return (
                    <div key={index} className={`${baseClass}`} style={{ color: '#d29922' }}>
                        {line.content}
                    </div>
                );
            case 'info':
                return (
                    <div key={index} className={`${baseClass}`} style={{ color: '#8b949e' }}>
                        {line.content}
                    </div>
                );
            default:
                return (
                    <div key={index} className={`terminal-output ${baseClass}`}>
                        {line.content}
                    </div>
                );
        }
    };

    return (
        <div className="terminal-container h-full flex flex-col">
            {/* Terminal Header */}
            <div className="terminal-header flex items-center px-2 sm:px-3 py-2">
                <div className="terminal-dot hidden sm:block" style={{ backgroundColor: '#ff5f57' }}></div>
                <div className="terminal-dot hidden sm:block" style={{ backgroundColor: '#febc2e' }}></div>
                <div className="terminal-dot hidden sm:block" style={{ backgroundColor: '#28c840' }}></div>
                <span className="sm:ml-4 text-xs sm:text-sm font-mono truncate" style={{ color: '#8b949e' }}>
                    {currentDevice?.hostname || 'Terminal'} - {currentDevice?.type?.toUpperCase()}
                </span>
                <button
                    onClick={clearTerminal}
                    className="ml-auto text-xs transition-colors hover:text-white px-2 py-1 rounded"
                    style={{ color: '#8b949e', backgroundColor: '#21262d' }}
                    title="Clear"
                >
                    Clear
                </button>
            </div>

            {/* Terminal Body */}
            <div
                ref={outputRef}
                className="terminal-body flex-1 cursor-text text-xs sm:text-sm overflow-auto"
                onClick={handleTerminalClick}
            >
                {/* Welcome message - shorter on mobile */}
                {state.outputHistory.length === 0 && (
                    <div style={{ color: '#8b949e' }} className="mb-4">
                        <pre className="hidden sm:block text-xs leading-tight mb-2 whitespace-pre" style={{ color: '#58a6ff', fontFamily: 'monospace' }}>
                            {` _   _      _   _           _     
| \\ | |    | | | |         | |    
|  \\| | ___| |_| |     __ _| |__  
| . \` |/ _ \\ __| |    / _\` | '_ \\ 
| |\\  |  __/ |_| |___| (_| | |_) |
|_| \\_|\\___|\\__|______\\__,_|_.__/ `}
                        </pre>
                        <p className="sm:hidden text-lg font-bold mb-2" style={{ color: '#58a6ff' }}>
                            🌐 NetLab Terminal
                        </p>
                        <p>Complete the tasks to earn XP!</p>
                        <p className="mt-1">Type <span style={{ color: '#58a6ff' }}>?</span> for commands.</p>
                    </div>
                )}

                {/* Output history */}
                {state.outputHistory.map(renderOutputLine)}

                {/* Current input line - Desktop */}
                <div className="hidden sm:flex terminal-line mt-1">
                    <span className="terminal-prompt">{currentPrompt}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="terminal-input"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                    <span className="cursor-blink" style={{ color: '#58a6ff' }}>▌</span>
                </div>
            </div>

            {/* Mobile Input Bar - Fixed at bottom of terminal */}
            <div
                className="sm:hidden flex items-center gap-2 p-2"
                style={{ backgroundColor: '#21262d', borderTop: '2px solid #30363d' }}
            >
                <span
                    className="text-xs font-mono flex-shrink-0 px-2 py-1 rounded"
                    style={{ color: '#58a6ff', backgroundColor: '#0d1117' }}
                >
                    {currentPrompt}
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type command..."
                    className="flex-1 bg-transparent text-sm outline-none font-mono"
                    style={{ color: '#c9d1d9' }}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-lg font-bold text-sm"
                    style={{
                        backgroundColor: '#58cc02',
                        color: 'white',
                        boxShadow: '0 3px 0 #46a302'
                    }}
                >
                    Run
                </button>
            </div>
        </div>
    );
};

export default VirtualTerminal;
