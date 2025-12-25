import { useLab } from '../context/LabContext';

const GameHeader = () => {
    const { state, currentLevel, levelProgress, goHome } = useLab();

    return (
        <header
            className="sticky top-0 z-50 border-b"
            style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}
        >
            <div className="px-4 py-3 flex items-center gap-4">
                {/* Back button */}
                <button
                    onClick={goHome}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Back to levels"
                >
                    <svg className="w-5 h-5" fill="none" stroke="#8b949e" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Level info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{currentLevel?.icon}</span>
                        <span className="font-semibold text-sm" style={{ color: '#c9d1d9' }}>
                            Level {currentLevel?.id}: {currentLevel?.name}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${levelProgress}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3">
                    {/* Session XP */}
                    <div className="xp-badge">
                        <span>⚡</span>
                        <span>+{state.sessionXP}</span>
                    </div>

                    {/* Hearts */}
                    <div className="heart-badge">
                        <span>❤️</span>
                        <span>{state.hearts}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default GameHeader;
