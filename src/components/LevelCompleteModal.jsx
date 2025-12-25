import { useEffect, useState } from 'react';
import { useLab } from '../context/LabContext';

const LevelCompleteModal = () => {
    const { state, currentLevel, goHome } = useLab();
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        // Generate confetti
        const colors = ['#58a6ff', '#3fb950', '#ffc800', '#ff9600', '#f85149'];
        const pieces = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setConfetti(pieces);
    }, []);

    if (!currentLevel) return null;

    const isPerfect = state.sessionMistakes === 0;

    return (
        <div className="celebration-overlay">
            {/* Confetti */}
            {confetti.map(piece => (
                <div
                    key={piece.id}
                    className="confetti"
                    style={{
                        left: `${piece.left}%`,
                        backgroundColor: piece.color,
                        animationDelay: `${piece.delay}s`,
                    }}
                />
            ))}

            <div className="celebration-card">
                {/* Trophy */}
                <div className="text-7xl mb-4">
                    {isPerfect ? '🏆' : '🎉'}
                </div>

                {/* Title */}
                <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: '#3fb950' }}
                >
                    {isPerfect ? 'Perfect!' : 'Level Complete!'}
                </h2>

                <p className="text-lg mb-4" style={{ color: '#c9d1d9' }}>
                    {currentLevel.name}
                </p>

                {/* Stats */}
                <div
                    className="grid grid-cols-2 gap-4 p-4 rounded-xl mb-6"
                    style={{ backgroundColor: '#0d1117' }}
                >
                    <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: '#ffc800' }}>
                            +{state.sessionXP}
                        </div>
                        <div className="text-sm" style={{ color: '#8b949e' }}>XP Earned</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: state.hearts > 3 ? '#3fb950' : '#f85149' }}>
                            {state.hearts}/{state.maxHearts}
                        </div>
                        <div className="text-sm" style={{ color: '#8b949e' }}>Hearts Left</div>
                    </div>
                </div>

                {/* Perfect bonus */}
                {isPerfect && (
                    <div
                        className="mb-4 px-4 py-2 rounded-full text-sm font-bold inline-block"
                        style={{ backgroundColor: 'rgba(63, 185, 80, 0.15)', color: '#3fb950' }}
                    >
                        ✨ No mistakes! Perfect run!
                    </div>
                )}

                {/* Next level unlock */}
                <div
                    className="mb-6 p-3 rounded-lg text-sm"
                    style={{ backgroundColor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff' }}
                >
                    🔓 Next level unlocked!
                </div>

                {/* Continue button */}
                <button
                    onClick={goHome}
                    className="btn-primary w-full text-lg py-4"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default LevelCompleteModal;
