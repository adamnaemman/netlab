import { useState } from 'react';

const MultipleChoice = ({ exercise, onAnswer, disabled }) => {
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleSelect = (index) => {
        if (disabled || showResult) return;
        setSelected(index);
    };

    const handleCheck = () => {
        if (selected === null) return;
        setShowResult(true);
        const isCorrect = selected === exercise.correctIndex;

        // Delay before calling onAnswer to show feedback
        setTimeout(() => {
            onAnswer(isCorrect);
            setSelected(null);
            setShowResult(false);
        }, 1500);
    };

    const getOptionClass = (index) => {
        let classes = 'option-btn';

        if (showResult) {
            if (index === exercise.correctIndex) {
                classes += ' correct';
            } else if (index === selected) {
                classes += ' wrong';
            }
        } else if (index === selected) {
            classes += ' selected';
        }

        return classes;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Question */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#3C3C3C' }}>
                    {exercise.question}
                </h2>

                {/* Options */}
                <div className="w-full max-w-lg space-y-3">
                    {exercise.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(index)}
                            className={getOptionClass(index)}
                            disabled={disabled || showResult}
                        >
                            <span className="flex items-center gap-3">
                                <span
                                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm"
                                    style={{
                                        borderColor: selected === index ? '#1CB0F6' : '#E5E5E5',
                                        backgroundColor: selected === index ? 'rgba(28, 176, 246, 0.1)' : 'transparent'
                                    }}
                                >
                                    {index + 1}
                                </span>
                                {option}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Check button */}
            <div className="p-6 border-t" style={{ borderColor: '#E5E5E5' }}>
                <button
                    onClick={handleCheck}
                    disabled={selected === null || showResult}
                    className="btn-check"
                >
                    CHECK
                </button>
            </div>

            {/* Feedback */}
            {showResult && (
                <div className={`feedback-bar ${selected === exercise.correctIndex ? 'correct' : 'wrong'}`}>
                    <div>
                        <p className="font-bold text-lg">
                            {selected === exercise.correctIndex ? '🎉 Correct!' : '❌ Incorrect'}
                        </p>
                        {exercise.explanation && selected !== exercise.correctIndex && (
                            <p className="text-sm opacity-90">{exercise.explanation}</p>
                        )}
                    </div>
                    <span className="text-3xl">
                        {selected === exercise.correctIndex ? '✓' : '✗'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default MultipleChoice;
