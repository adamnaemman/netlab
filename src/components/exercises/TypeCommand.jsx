import { useState, useRef } from 'react';

const TypeCommand = ({ exercise, onAnswer, disabled }) => {
    const [input, setInput] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const inputRef = useRef(null);

    const checkAnswer = () => {
        const userInput = input.trim().toLowerCase();
        const expected = exercise.expectedCommand.toLowerCase();
        const alternates = (exercise.alternateCommands || []).map(c => c.toLowerCase());

        const correct = userInput === expected || alternates.includes(userInput);
        setIsCorrect(correct);
        setShowResult(true);

        setTimeout(() => {
            onAnswer(correct);
            setInput('');
            setShowResult(false);
            setIsCorrect(false);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            checkAnswer();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Instruction */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="text-5xl mb-6">⌨️</div>
                <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#3C3C3C' }}>
                    {exercise.instruction}
                </h2>

                {exercise.hint && !showResult && (
                    <p className="text-base mb-6 text-center" style={{ color: '#AFAFAF' }}>
                        💡 Hint: {exercise.hint}
                    </p>
                )}

                {/* Terminal */}
                <div className="terminal-exercise w-full max-w-lg mt-4">
                    <div className="terminal-header-duo">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="ml-4 text-gray-400 text-sm">Terminal</span>
                    </div>
                    <div className="terminal-body-duo">
                        <div className="flex items-center gap-2">
                            <span className="terminal-prompt-duo">{exercise.prompt}</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="terminal-input-duo"
                                placeholder="Type your command..."
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                disabled={disabled || showResult}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Check button */}
            <div className="p-6 border-t" style={{ borderColor: '#E5E5E5' }}>
                <button
                    onClick={checkAnswer}
                    disabled={!input.trim() || showResult}
                    className="btn-check"
                >
                    CHECK
                </button>
            </div>

            {/* Feedback */}
            {showResult && (
                <div className={`feedback-bar ${isCorrect ? 'correct' : 'wrong'}`}>
                    <div>
                        <p className="font-bold text-lg">
                            {isCorrect ? (exercise.successMessage || '🎉 Correct!') : '❌ Not quite right'}
                        </p>
                        {!isCorrect && (
                            <p className="text-sm opacity-90">
                                Expected: <span className="font-mono">{exercise.expectedCommand}</span>
                            </p>
                        )}
                    </div>
                    <span className="text-3xl">
                        {isCorrect ? '✓' : '✗'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TypeCommand;
