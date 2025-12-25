import { useState } from 'react';
import { guidebook } from '../data/guidebook';

const Guidebook = ({ onClose, initialUnit = 1 }) => {
    const [selectedUnit, setSelectedUnit] = useState(initialUnit);
    const [expandedSection, setExpandedSection] = useState(null);
    const [showFlashcards, setShowFlashcards] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentGuide = guidebook.find(g => g.unitId === selectedUnit);

    // Get all commands from current unit for flashcards
    const allCommands = currentGuide?.sections.flatMap(s => s.commands) || [];

    const handleNextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % allCommands.length);
        }, 150);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev - 1 + allCommands.length) % allCommands.length);
        }, 150);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ backgroundColor: '#0d1117' }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b flex-shrink-0"
                style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{showFlashcards ? '🃏' : '📖'}</span>
                    <div>
                        <h1 className="text-lg font-black" style={{ color: '#c9d1d9' }}>
                            {showFlashcards ? 'Flashcards' : 'Guidebook'}
                        </h1>
                        <p className="text-xs" style={{ color: '#8b949e' }}>
                            {showFlashcards ? 'Practice memorization' : 'Learn commands & concepts'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Toggle Flashcards */}
                    <button
                        onClick={() => { setShowFlashcards(!showFlashcards); setCurrentCardIndex(0); setIsFlipped(false); }}
                        className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
                        style={{
                            backgroundColor: showFlashcards ? '#9333ea' : '#21262d',
                            color: showFlashcards ? 'white' : '#8b949e',
                        }}
                    >
                        🃏 {showFlashcards ? 'Guide' : 'Cards'}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: '#21262d', color: '#8b949e' }}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Unit Tabs */}
            <div
                className="flex gap-2 p-3 overflow-x-auto flex-shrink-0"
                style={{ backgroundColor: '#161b22' }}
            >
                {guidebook.map(unit => (
                    <button
                        key={unit.unitId}
                        onClick={() => { setSelectedUnit(unit.unitId); setExpandedSection(null); setCurrentCardIndex(0); setIsFlipped(false); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all"
                        style={{
                            backgroundColor: selectedUnit === unit.unitId ? unit.unitColor : '#21262d',
                            color: selectedUnit === unit.unitId ? 'white' : '#8b949e',
                            boxShadow: selectedUnit === unit.unitId ? `0 3px 0 ${unit.unitColor}88` : 'none',
                        }}
                    >
                        <span>{unit.unitIcon}</span>
                        <span className="hidden sm:inline">{unit.unitName}</span>
                        <span className="sm:hidden">Unit {unit.unitId}</span>
                    </button>
                ))}
            </div>

            {/* Content - with proper bottom padding for mobile */}
            <div className="flex-1 overflow-y-auto p-4 pb-24 lg:pb-8">
                {currentGuide && (
                    <>
                        {/* Flashcards Mode */}
                        {showFlashcards ? (
                            <div className="max-w-md mx-auto">
                                {allCommands.length > 0 ? (
                                    <>
                                        {/* Progress */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-bold" style={{ color: '#8b949e' }}>
                                                Card {currentCardIndex + 1} of {allCommands.length}
                                            </span>
                                            <div className="flex gap-1">
                                                {allCommands.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: idx === currentCardIndex ? '#58cc02' : '#30363d' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Flashcard */}
                                        <div
                                            onClick={() => setIsFlipped(!isFlipped)}
                                            className="relative cursor-pointer mb-6"
                                            style={{ perspective: '1000px' }}
                                        >
                                            <div
                                                className="rounded-2xl p-6 min-h-[250px] flex flex-col items-center justify-center text-center transition-all duration-300"
                                                style={{
                                                    backgroundColor: isFlipped ? '#1a2c32' : '#161b22',
                                                    border: `3px solid ${isFlipped ? '#58cc02' : currentGuide.unitColor}`,
                                                    transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
                                                }}
                                            >
                                                {!isFlipped ? (
                                                    <>
                                                        <p className="text-xs font-bold mb-4" style={{ color: '#8b949e' }}>
                                                            TAP TO REVEAL
                                                        </p>
                                                        <code
                                                            className="text-xl sm:text-2xl font-bold px-4 py-2 rounded-lg"
                                                            style={{ backgroundColor: '#21262d', color: '#58a6ff' }}
                                                        >
                                                            {allCommands[currentCardIndex].command}
                                                        </code>
                                                        {allCommands[currentCardIndex].shortcut && (
                                                            <p className="mt-3 text-sm" style={{ color: '#58cc02' }}>
                                                                ⌨️ Shortcut: {allCommands[currentCardIndex].shortcut}
                                                            </p>
                                                        )}
                                                        <p className="mt-4 text-xs" style={{ color: '#6e7681' }}>
                                                            What does this command do?
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-xs font-bold mb-2" style={{ color: '#58cc02' }}>
                                                            ✓ ANSWER
                                                        </p>
                                                        <p className="text-lg font-bold mb-4" style={{ color: '#c9d1d9' }}>
                                                            {allCommands[currentCardIndex].description}
                                                        </p>
                                                        <div
                                                            className="p-3 rounded-lg text-xs text-left w-full"
                                                            style={{ backgroundColor: '#0d1117' }}
                                                        >
                                                            <p style={{ color: '#ffc800' }}>💡 {allCommands[currentCardIndex].tip}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={handlePrevCard}
                                                className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
                                                style={{ backgroundColor: '#21262d', color: '#c9d1d9' }}
                                            >
                                                ← Previous
                                            </button>
                                            <button
                                                onClick={handleNextCard}
                                                className="px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
                                                style={{ backgroundColor: '#58cc02', color: 'white', boxShadow: '0 4px 0 #46a302' }}
                                            >
                                                Next →
                                            </button>
                                        </div>

                                        {/* Tip */}
                                        <p className="text-center text-xs mt-6" style={{ color: '#6e7681' }}>
                                            Tap card to flip • Use arrows to navigate
                                        </p>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <span className="text-4xl mb-4 block">📭</span>
                                        <p style={{ color: '#8b949e' }}>No flashcards available for this unit</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Guidebook Mode */
                            <>
                                {/* Unit Header */}
                                <div
                                    className="rounded-2xl p-4 mb-4"
                                    style={{
                                        background: `linear-gradient(135deg, ${currentGuide.unitColor} 0%, ${currentGuide.unitColor}dd 100%)`,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{currentGuide.unitIcon}</span>
                                            <h2 className="text-xl font-black text-white">{currentGuide.unitName}</h2>
                                        </div>
                                        <button
                                            onClick={() => { setShowFlashcards(true); setCurrentCardIndex(0); setIsFlipped(false); }}
                                            className="px-3 py-2 rounded-lg text-xs font-bold"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                        >
                                            🃏 Flashcards
                                        </button>
                                    </div>
                                    <p className="text-sm text-white/90 mt-2">{currentGuide.description}</p>
                                    <p className="text-xs text-white/70 mt-1">
                                        📚 {allCommands.length} commands to learn
                                    </p>
                                </div>

                                {/* Sections */}
                                <div className="space-y-3">
                                    {currentGuide.sections.map((section, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-xl overflow-hidden"
                                            style={{ backgroundColor: '#161b22', border: '2px solid #30363d' }}
                                        >
                                            {/* Section Header */}
                                            <button
                                                onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                                                className="w-full flex items-center justify-between p-4 text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{section.icon}</span>
                                                    <div>
                                                        <span className="font-bold" style={{ color: '#c9d1d9' }}>{section.title}</span>
                                                        <p className="text-xs" style={{ color: '#6e7681' }}>
                                                            {section.commands.length} commands
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className="text-lg transition-transform"
                                                    style={{
                                                        transform: expandedSection === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        color: '#8b949e'
                                                    }}
                                                >
                                                    ▼
                                                </span>
                                            </button>

                                            {/* Section Content */}
                                            {expandedSection === idx && (
                                                <div className="px-4 pb-4 animate-fade-in">
                                                    <div
                                                        className="p-3 rounded-lg mb-4 text-sm leading-relaxed break-words"
                                                        style={{ backgroundColor: '#0d1117', color: '#8b949e' }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: section.content
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c9d1d9">$1</strong>')
                                                                .replace(/`(.*?)`/g, '<code style="background:#21262d;padding:2px 6px;border-radius:4px;color:#58a6ff">$1</code>')
                                                        }}
                                                    />

                                                    {section.commands.length > 0 && (
                                                        <div className="space-y-3">
                                                            {section.commands.map((cmd, cmdIdx) => (
                                                                <CommandCard key={cmdIdx} command={cmd} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Command Card Component
const CommandCard = ({ command }) => {
    const [showExample, setShowExample] = useState(false);

    return (
        <div
            className="rounded-xl p-3"
            style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}
        >
            {/* Command */}
            <div className="flex flex-wrap items-start gap-2 mb-2">
                <code
                    className="px-2 py-1 rounded text-sm font-bold break-all"
                    style={{ backgroundColor: '#21262d', color: '#58a6ff' }}
                >
                    {command.command}
                </code>
                {command.shortcut && (
                    <span
                        className="px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: '#2f3b28', color: '#58cc02' }}
                    >
                        ⌨️ {command.shortcut}
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-sm mb-2 break-words" style={{ color: '#c9d1d9' }}>
                {command.description}
            </p>

            {/* Example Toggle */}
            <button
                onClick={() => setShowExample(!showExample)}
                className="text-xs font-bold flex items-center gap-1 mb-2"
                style={{ color: '#1cb0f6' }}
            >
                {showExample ? '▼ Hide example' : '▶ Show example'}
            </button>

            {/* Example */}
            {showExample && (
                <pre
                    className="p-3 rounded-lg text-xs overflow-x-auto mb-2"
                    style={{ backgroundColor: '#161b22', color: '#8b949e' }}
                >
                    {command.example}
                </pre>
            )}

            {/* Tip */}
            <div
                className="flex items-start gap-2 p-2 rounded-lg text-xs break-words"
                style={{ backgroundColor: '#2d2a1f', color: '#ffc800' }}
            >
                <span className="flex-shrink-0">💡</span>
                <span>{command.tip}</span>
            </div>
        </div>
    );
};

export default Guidebook;
