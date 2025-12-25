import { useState } from 'react';

const FillBlank = ({ exercise, onAnswer, disabled }) => {
    const [input, setInput] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleCheck = () => {
        if (!input.trim()) return;

        const userAnswer = input.trim().toLowerCase();
        const correctAnswer = exercise.answer.toLowerCase();
        const correct = userAnswer === correctAnswer;

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
            handleCheck();
        }
    };

    // Parse template to render blank
    const renderTemplate = () => {
        const parts = exercise.template.split(/(_+)/);
        return parts.map((part, i) => {
            if (part.match(/_+/)) {
                return (
                    <input
                        key={i}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="blank-input mx-1"
                        style={{ width: `${Math.max(80, exercise.answer.length * 12)}px` }}
                        placeholder="?"
                        disabled={disabled || showResult}
                        autoComplete="off"
                    />
                );
            }
            return <span key={i} className="font-mono">{part}</span>;
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="text-5xl mb-6">✍️</div>
                <h2 className="text-xl font-bold text-center mb-2" style={{ color: '#3C3C3C' }}>
                    {exercise.instruction}
                </h2>

                {exercise.hint && !showResult && (
                    <p className="text-sm mb-6 text-center" style={{ color: '#AFAFAF' }}>
                        💡 {exercise.hint}
                    </p>
                )}

                {/* Template with blank */}
                <div
                    className="p-6 rounded-2xl text-lg flex flex-wrap items-center justify-center gap-1"
                    style={{ backgroundColor: '#f0f0f0' }}
                >
                    {renderTemplate()}
                </div>
            </div>

            {/* Check button */}
            <div className="p-6 border-t" style={{ borderColor: '#E5E5E5' }}>
                <button
                    onClick={handleCheck}
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
                            {isCorrect ? '🎉 Correct!' : '❌ Not quite right'}
                        </p>
                        {!isCorrect && (
                            <p className="text-sm opacity-90">
                                The answer was: <span className="font-mono font-bold">{exercise.answer}</span>
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

export default FillBlank;
