import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getLessonById } from '../data/curriculum';
import MultipleChoice from './exercises/MultipleChoice';
import ConceptCard from './exercises/ConceptCard';
import TypeCommand from './exercises/TypeCommand';
import DragMatch from './exercises/DragMatch';
import FillBlank from './exercises/FillBlank';
import CelebrationModal from './CelebrationModal';

const LessonScreen = () => {
    const {
        state,
        loseHeart,
        completeLesson,
        completeExercise,
        setView,
        addXP
    } = useGame();

    const [showCelebration, setShowCelebration] = useState(false);
    const [earnedXP, setEarnedXP] = useState(0);

    const lessonData = getLessonById(state.currentLessonId);

    if (!lessonData) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Lesson not found</p>
            </div>
        );
    }

    const { lesson, unit } = lessonData;
    const exercises = lesson.exercises;
    const currentExercise = exercises[state.currentExerciseIndex];
    const progress = ((state.currentExerciseIndex) / exercises.length) * 100;

    const handleAnswer = (isCorrect) => {
        if (!isCorrect) {
            loseHeart();

            // Check if out of hearts
            if (state.hearts <= 1) {
                // Out of hearts - go back to home
                setTimeout(() => setView('home'), 1500);
                return;
            }
        } else {
            // Add small XP for correct answer
            addXP(2);
        }

        // Move to next exercise
        if (state.currentExerciseIndex < exercises.length - 1) {
            completeExercise();
        } else {
            // Lesson complete!
            const isPerfect = state.sessionMistakes === 0;
            const bonusXP = isPerfect ? 10 : 0;
            const totalXP = lesson.xpReward + bonusXP + (state.sessionMistakes === 0 ? 5 : 0);

            setEarnedXP(totalXP);
            setShowCelebration(true);
        }
    };

    const handleCelebrationClose = () => {
        setShowCelebration(false);
        completeLesson(lesson.id, earnedXP, state.sessionMistakes === 0);
    };

    const handleExit = () => {
        if (confirm('Are you sure you want to exit? Your progress in this lesson will be lost.')) {
            setView('home');
        }
    };

    const renderExercise = () => {
        if (!currentExercise) return null;

        const props = {
            exercise: currentExercise,
            onAnswer: handleAnswer,
            disabled: state.hearts === 0,
        };

        switch (currentExercise.type) {
            case 'concept-card':
                return <ConceptCard {...props} onContinue={handleAnswer} />;
            case 'multiple-choice':
                return <MultipleChoice {...props} />;
            case 'type-command':
                return <TypeCommand {...props} />;
            case 'drag-match':
                return <DragMatch {...props} />;
            case 'fill-blank':
                return <FillBlank {...props} />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-gray-500">Unknown exercise type: {currentExercise.type}</p>
                        <button
                            onClick={() => handleAnswer(true)}
                            className="btn-primary mt-4"
                        >
                            Skip
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Header */}
            <header className="px-4 py-3 flex items-center gap-4 border-b" style={{ borderColor: '#E5E5E5' }}>
                {/* Exit button */}
                <button
                    onClick={handleExit}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="#AFAFAF" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Progress bar */}
                <div className="flex-1 progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Hearts */}
                <div className="heart">
                    <span className="heart-icon">❤️</span>
                    <span>{state.hearts}</span>
                </div>
            </header>

            {/* Lesson content */}
            <main className="flex-1 overflow-auto">
                {renderExercise()}
            </main>

            {/* Celebration modal */}
            {showCelebration && (
                <CelebrationModal
                    xpEarned={earnedXP}
                    isPerfect={state.sessionMistakes === 0}
                    lessonTitle={lesson.title}
                    onClose={handleCelebrationClose}
                />
            )}
        </div>
    );
};

export default LessonScreen;
