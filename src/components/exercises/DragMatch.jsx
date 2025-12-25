import { useState, useEffect } from 'react';

const DragMatch = ({ exercise, onAnswer, disabled }) => {
    const [pairs, setPairs] = useState([]);
    const [leftItems, setLeftItems] = useState([]);
    const [rightItems, setRightItems] = useState([]);
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [showResult, setShowResult] = useState(false);

    // Initialize items
    useEffect(() => {
        const left = exercise.pairs.map((p, i) => ({ id: i, text: p.left, matched: false }));
        const right = exercise.pairs
            .map((p, i) => ({ id: i, text: p.right, matched: false }))
            .sort(() => Math.random() - 0.5); // Shuffle right side

        setLeftItems(left);
        setRightItems(right);
        setMatchedPairs([]);
        setSelectedLeft(null);
    }, [exercise]);

    const handleLeftClick = (item) => {
        if (disabled || item.matched) return;
        setSelectedLeft(selectedLeft?.id === item.id ? null : item);
    };

    const handleRightClick = (item) => {
        if (disabled || item.matched || !selectedLeft) return;

        // Check if match is correct
        const isMatch = exercise.pairs.some(
            p => p.left === selectedLeft.text && p.right === item.text
        );

        if (isMatch) {
            // Mark as matched
            setMatchedPairs([...matchedPairs, { left: selectedLeft.id, right: item.id }]);
            setLeftItems(leftItems.map(l =>
                l.id === selectedLeft.id ? { ...l, matched: true } : l
            ));
            setRightItems(rightItems.map(r =>
                r.id === item.id ? { ...r, matched: true } : r
            ));
        }

        setSelectedLeft(null);

        // Check if all matched
        if (matchedPairs.length + 1 === exercise.pairs.length) {
            setShowResult(true);
            setTimeout(() => {
                onAnswer(true); // For drag-match, we only allow correct matches
                setShowResult(false);
            }, 1500);
        }
    };

    const getLeftItemClass = (item) => {
        let classes = 'drag-item flex items-center justify-between';
        if (item.matched) classes += ' matched opacity-60';
        if (selectedLeft?.id === item.id) classes += ' ring-2 ring-blue-400';
        return classes;
    };

    const getRightItemClass = (item) => {
        let classes = 'drag-item flex items-center justify-between';
        if (item.matched) classes += ' matched opacity-60';
        if (selectedLeft && !item.matched) classes += ' hover:ring-2 hover:ring-blue-400';
        return classes;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Instruction */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
                <div className="text-5xl mb-4">🧩</div>
                <h2 className="text-xl font-bold text-center mb-6" style={{ color: '#3C3C3C' }}>
                    {exercise.instruction}
                </h2>

                <p className="text-sm mb-4" style={{ color: '#AFAFAF' }}>
                    Tap an item on the left, then tap its match on the right
                </p>

                {/* Matching area */}
                <div className="w-full max-w-2xl grid grid-cols-2 gap-4">
                    {/* Left column */}
                    <div className="space-y-3">
                        {leftItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleLeftClick(item)}
                                className={getLeftItemClass(item)}
                                disabled={item.matched}
                            >
                                <span className="font-mono text-sm">{item.text}</span>
                                {item.matched && <span className="text-green-500">✓</span>}
                            </button>
                        ))}
                    </div>

                    {/* Right column */}
                    <div className="space-y-3">
                        {rightItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleRightClick(item)}
                                className={getRightItemClass(item)}
                                disabled={item.matched || !selectedLeft}
                            >
                                <span className="text-sm">{item.text}</span>
                                {item.matched && <span className="text-green-500">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-6 text-center">
                    <span style={{ color: '#58CC02' }} className="font-bold">
                        {matchedPairs.length}
                    </span>
                    <span style={{ color: '#AFAFAF' }}> / {exercise.pairs.length} matched</span>
                </div>
            </div>

            {/* Feedback */}
            {showResult && (
                <div className="feedback-bar correct">
                    <div>
                        <p className="font-bold text-lg">🎉 All matched correctly!</p>
                    </div>
                    <span className="text-3xl">✓</span>
                </div>
            )}
        </div>
    );
};

export default DragMatch;
