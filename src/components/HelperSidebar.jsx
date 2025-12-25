import { useLab } from '../context/LabContext';

const HelperSidebar = () => {
    const {
        state,
        currentLevel,
        currentStep,
        switchDevice,
        resetLevel,
        levelProgress
    } = useLab();

    if (!currentLevel) return null;

    return (
        <div
            className="helper-sidebar w-full lg:w-80 lg:h-full flex flex-col"
            style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}
        >
            {/* Scenario - Mobile responsive */}
            <div className="p-3 sm:p-4 border-b" style={{ borderColor: '#30363d' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#c9d1d9' }}>
                    📋 Scenario
                </h3>
                <p className="text-xs sm:text-sm break-words" style={{ color: '#8b949e' }}>
                    {currentLevel.scenario}
                </p>
            </div>

            {/* Device Switcher - Responsive */}
            <div className="p-3 sm:p-4 border-b" style={{ borderColor: '#30363d' }}>
                <h3 className="font-bold text-xs sm:text-sm mb-2" style={{ color: '#8b949e' }}>
                    Active Device
                </h3>
                <div className="flex gap-2">
                    {['router', 'switch'].map((device) => (
                        <button
                            key={device}
                            onClick={() => switchDevice(device)}
                            className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all`}
                            style={{
                                backgroundColor: state.currentDevice === device ? '#58a6ff' : 'transparent',
                                color: state.currentDevice === device ? 'white' : '#8b949e',
                                border: state.currentDevice === device ? 'none' : '1px solid #30363d',
                            }}
                        >
                            {device === 'router' ? '📡' : '🔀'} {device.charAt(0).toUpperCase() + device.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Task - Wrapped content */}
            {currentStep && (
                <div className="p-3 sm:p-4 border-b" style={{ borderColor: '#30363d' }}>
                    <h3 className="font-bold text-xs sm:text-sm mb-2" style={{ color: '#58a6ff' }}>
                        🎯 Current Task
                    </h3>
                    <p className="font-medium text-sm mb-3 break-words" style={{ color: '#c9d1d9' }}>
                        {currentStep.description}
                    </p>

                    {/* Hint box - Wrapped */}
                    <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: '#0d1117', border: '1px solid #30363d' }}
                    >
                        <div className="flex items-start gap-2">
                            <span className="flex-shrink-0">💡</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm break-words" style={{ color: '#8b949e' }}>
                                    {currentStep.hint}
                                </p>
                                {state.sessionMistakes > 0 && (
                                    <div className="mt-2">
                                        <span className="text-xs" style={{ color: '#8b949e' }}>Command: </span>
                                        <code
                                            className="text-xs px-2 py-1 rounded break-all inline-block mt-1"
                                            style={{ backgroundColor: '#21262d', color: '#58a6ff' }}
                                        >
                                            {currentStep.command}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* XP reward */}
                    <div className="mt-3 text-xs sm:text-sm" style={{ color: '#ffc800' }}>
                        ⚡ +{currentStep.xp} XP on completion
                    </div>

                    {/* Wrong device warning - Wrapped */}
                    {currentStep.device !== state.currentDevice && (
                        <div
                            className="mt-3 p-3 rounded-lg text-xs sm:text-sm break-words"
                            style={{ backgroundColor: 'rgba(210, 153, 34, 0.15)', color: '#d29922' }}
                        >
                            ⚠️ This task requires the <strong>{currentStep.device}</strong>.
                            <button
                                onClick={() => switchDevice(currentStep.device)}
                                className="underline ml-1 font-bold"
                            >
                                Switch now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* All Steps - Responsive cards */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <h3 className="font-bold text-xs sm:text-sm mb-3" style={{ color: '#8b949e' }}>
                    📝 All Tasks ({state.currentStepIndex}/{currentLevel.steps.length})
                </h3>

                <div className="space-y-2">
                    {currentLevel.steps.map((step, index) => {
                        const isCompleted = index < state.currentStepIndex;
                        const isCurrent = index === state.currentStepIndex;

                        return (
                            <div
                                key={step.id}
                                className="p-2 sm:p-3 rounded-lg"
                                style={{
                                    backgroundColor: isCurrent ? '#1a2c32' : '#0d1117',
                                    border: isCurrent ? '2px solid #58a6ff' : '1px solid #30363d'
                                }}
                            >
                                <div className="flex items-start gap-2 sm:gap-3">
                                    {/* Status icon */}
                                    <div
                                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={{
                                            backgroundColor: isCompleted ? '#3fb950' :
                                                isCurrent ? '#58a6ff' :
                                                    '#30363d',
                                            color: isCompleted || isCurrent ? 'white' : '#8b949e',
                                        }}
                                    >
                                        {isCompleted ? '✓' : index + 1}
                                    </div>

                                    {/* Description - Wrapped */}
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-xs sm:text-sm break-words ${isCompleted ? 'line-through' : ''}`}
                                            style={{
                                                color: isCompleted ? '#8b949e' :
                                                    isCurrent ? '#c9d1d9' :
                                                        '#6e7681'
                                            }}
                                        >
                                            {step.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className="text-xs" style={{ color: '#ffc800' }}>
                                                +{step.xp} XP
                                            </span>
                                            <span className="text-xs" style={{ color: '#6e7681' }}>
                                                {step.device === 'router' ? '📡 Router' : '🔀 Switch'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Progress summary */}
            <div className="p-3 sm:p-4 border-t" style={{ borderColor: '#30363d' }}>
                <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
                    <span style={{ color: '#8b949e' }}>Progress</span>
                    <span style={{ color: '#3fb950' }}>{Math.round(levelProgress)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#30363d' }}>
                    <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${levelProgress}%`, backgroundColor: '#3fb950' }}
                    />
                </div>
            </div>

            {/* Reset button */}
            <div className="p-3 sm:p-4 border-t" style={{ borderColor: '#30363d' }}>
                <button
                    onClick={resetLevel}
                    className="w-full py-2 text-xs sm:text-sm rounded-lg transition-colors"
                    style={{
                        color: '#f85149',
                        border: '1px solid rgba(248, 81, 73, 0.3)',
                        backgroundColor: 'transparent'
                    }}
                >
                    🔄 Restart Level
                </button>
            </div>
        </div>
    );
};

export default HelperSidebar;
