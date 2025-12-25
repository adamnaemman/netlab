import { useEffect, useState } from 'react';

const CelebrationModal = ({ xpEarned, isPerfect, lessonTitle, onClose }) => {
    const [confetti, setConfetti] = useState([]);

    useEffect(() => {
        // Generate confetti
        const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF9600', '#CE82FF', '#FF86D0'];
        const pieces = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
        }));
        setConfetti(pieces);
    }, []);

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
                        transform: `rotate(${piece.rotation}deg)`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '0',
                    }}
                />
            ))}

            {/* Modal content */}
            <div className="celebration-card">
                {/* Trophy/Star */}
                <div className="text-8xl mb-4 animate-bounce-slow">
                    {isPerfect ? '🏆' : '⭐'}
                </div>

                {/* Title */}
                <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: '#58CC02' }}
                >
                    {isPerfect ? 'Perfect!' : 'Lesson Complete!'}
                </h2>

                <p className="text-lg mb-6" style={{ color: '#777777' }}>
                    {lessonTitle}
                </p>

                {/* XP earned */}
                <div
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl mb-6"
                    style={{ backgroundColor: 'rgba(255, 200, 0, 0.15)' }}
                >
                    <span className="text-3xl">⚡</span>
                    <span
                        className="text-2xl font-bold"
                        style={{ color: '#FFC800' }}
                    >
                        +{xpEarned} XP
                    </span>
                </div>

                {/* Perfect bonus */}
                {isPerfect && (
                    <div
                        className="mb-6 px-4 py-2 rounded-full text-sm font-bold"
                        style={{ backgroundColor: 'rgba(88, 204, 2, 0.15)', color: '#58CC02' }}
                    >
                        ✨ No mistakes bonus: +10 XP
                    </div>
                )}

                {/* Continue button */}
                <button
                    onClick={onClose}
                    className="btn-primary w-full text-lg"
                >
                    CONTINUE
                </button>
            </div>
        </div>
    );
};

export default CelebrationModal;
