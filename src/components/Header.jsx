import { useGame } from '../context/GameContext';
import { getUserLevel, getXPForNextLevel } from '../data/achievements';

const Header = () => {
    const { state, userLevel, nextLevelProgress, restoreHearts } = useGame();

    return (
        <header
            className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm"
            style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                <span className="font-bold text-lg hidden sm:block" style={{ color: '#58CC02' }}>
                    NetLab
                </span>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-3">
                {/* Streak */}
                {state.streak > 0 && (
                    <div className="streak-badge hidden sm:flex">
                        <span>🔥</span>
                        <span>{state.streak}</span>
                    </div>
                )}

                {/* XP / Level */}
                <div className="flex items-center gap-2">
                    <div className="xp-badge">
                        <span>⚡</span>
                        <span>{state.xp}</span>
                    </div>
                    <div
                        className="hidden sm:block text-xs font-bold px-2 py-1 rounded-full"
                        style={{ backgroundColor: '#f0f0f0', color: '#777777' }}
                    >
                        {userLevel.title}
                    </div>
                </div>

                {/* Hearts */}
                <button
                    onClick={state.hearts < 5 ? restoreHearts : undefined}
                    className="heart cursor-pointer hover:opacity-80 transition-opacity"
                    title={state.hearts < 5 ? 'Click to restore hearts' : 'Hearts full'}
                >
                    <span className="heart-icon">❤️</span>
                    <span>{state.hearts}</span>
                </button>

                {/* Daily progress ring */}
                <div
                    className="relative w-10 h-10"
                    title={`Daily goal: ${state.dailyXP}/${state.dailyGoal} XP`}
                >
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke="#E5E5E5"
                            strokeWidth="4"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke={state.dailyXP >= state.dailyGoal ? '#58CC02' : '#FFC800'}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${(Math.min(state.dailyXP / state.dailyGoal, 1) * 100.5)} 100.5`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs">
                            {state.dailyXP >= state.dailyGoal ? '✓' : '🎯'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
