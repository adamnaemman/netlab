import { useLab } from '../context/LabContext';
import { levels } from '../data/levels';

const ProgressTracker = () => {
    const { state } = useLab();
    const currentLevel = levels.find(l => l.id === state.currentLevel);

    if (!currentLevel) return null;

    return (
        <div className="bg-terminal-bg border border-terminal-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-terminal-text font-semibold">
                    Level {currentLevel.id}: {currentLevel.name}
                </h3>
                <span className="text-terminal-prompt font-mono text-lg font-bold">
                    {state.totalProgress}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar mb-4">
                <div
                    className="progress-fill"
                    style={{ width: `${state.totalProgress}%` }}
                />
            </div>

            {/* Objectives List */}
            <div className="space-y-2">
                {currentLevel.objectives.map((objective) => {
                    const isCompleted = state.completedObjectives.includes(objective.id);
                    return (
                        <div
                            key={objective.id}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${isCompleted
                                    ? 'bg-terminal-success/10 border border-terminal-success/30'
                                    : 'bg-terminal-border/30'
                                }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isCompleted
                                        ? 'bg-terminal-success text-white'
                                        : 'bg-terminal-border text-terminal-muted'
                                    }`}
                            >
                                {isCompleted ? '✓' : objective.points}
                            </div>
                            <span
                                className={`text-sm ${isCompleted ? 'text-terminal-success line-through' : 'text-terminal-text'
                                    }`}
                            >
                                {objective.description}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Completion message */}
            {state.totalProgress === 100 && (
                <div className="mt-4 p-3 bg-terminal-success/20 border border-terminal-success/50 rounded-lg animate-fade-in">
                    <p className="text-terminal-success font-semibold text-center">
                        🎉 Level Complete! Great job!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProgressTracker;
