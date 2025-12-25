import { useLab } from '../context/LabContext';
import { levels } from '../data/levels';

const LevelSelector = () => {
    const { state, selectLevel } = useLab();

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner':
                return 'text-terminal-success';
            case 'Intermediate':
                return 'text-yellow-400';
            case 'Advanced':
                return 'text-terminal-error';
            default:
                return 'text-terminal-muted';
        }
    };

    const getDifficultyBadge = (difficulty) => {
        const colors = {
            Beginner: 'bg-terminal-success/20 border-terminal-success/50 text-terminal-success',
            Intermediate: 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400',
            Advanced: 'bg-terminal-error/20 border-terminal-error/50 text-terminal-error',
        };
        return colors[difficulty] || 'bg-terminal-border text-terminal-muted';
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-terminal-text mb-4">Select a Level</h2>

            <div className="grid gap-4">
                {levels.map((level) => {
                    const isActive = state.currentLevel === level.id;
                    const isCompleted = state.totalProgress === 100 && isActive;

                    return (
                        <button
                            key={level.id}
                            onClick={() => selectLevel(level.id)}
                            className={`level-card text-left ${isActive ? 'active' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isActive
                                                ? 'bg-terminal-prompt text-white'
                                                : 'bg-terminal-border text-terminal-muted'
                                            }`}
                                    >
                                        {level.id}
                                    </span>
                                    <h3 className="text-terminal-text font-semibold">{level.name}</h3>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyBadge(
                                        level.difficulty
                                    )}`}
                                >
                                    {level.difficulty}
                                </span>
                            </div>

                            <p className="text-terminal-muted text-sm mb-3 ml-11">
                                {level.description}
                            </p>

                            <div className="flex items-center gap-4 ml-11 text-xs text-terminal-muted">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {level.estimatedTime}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    {level.objectives.length} objectives
                                </span>
                            </div>

                            {isActive && (
                                <div className="mt-3 ml-11">
                                    <div className="h-1 bg-terminal-border rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-terminal-prompt transition-all duration-500"
                                            style={{ width: `${state.totalProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelSelector;
