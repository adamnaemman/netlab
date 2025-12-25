import { useGame } from '../context/GameContext';
import { curriculum } from '../data/curriculum';

const LearningPath = () => {
    const { state, startLesson, isLessonCompleted, isUnitUnlocked } = useGame();

    const getUnitProgress = (unit) => {
        const completed = unit.lessons.filter(l => isLessonCompleted(l.id)).length;
        return { completed, total: unit.lessons.length };
    };

    const canStartLesson = (lesson, unit, lessonIndex) => {
        // First lesson of unlocked unit is always available
        if (!isUnitUnlocked(unit.id)) return false;
        if (lessonIndex === 0) return true;

        // Can start if previous lesson is completed
        const prevLesson = unit.lessons[lessonIndex - 1];
        return isLessonCompleted(prevLesson.id);
    };

    const getNextLesson = () => {
        for (const unit of curriculum) {
            if (!isUnitUnlocked(unit.id)) continue;
            for (const lesson of unit.lessons) {
                if (!isLessonCompleted(lesson.id)) {
                    return lesson.id;
                }
            }
        }
        return null;
    };

    const nextLessonId = getNextLesson();

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            {/* Path items */}
            <div className="relative">
                {/* Connecting line */}
                <div
                    className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2"
                    style={{ backgroundColor: '#E5E5E5' }}
                />

                {curriculum.map((unit, unitIndex) => {
                    const progress = getUnitProgress(unit);
                    const isUnlocked = isUnitUnlocked(unit.id);
                    const isComplete = progress.completed === progress.total;

                    return (
                        <div key={unit.id} className="relative mb-12">
                            {/* Unit header */}
                            <div className="relative z-10 flex flex-col items-center mb-6">
                                <div
                                    className={`unit-circle ${!isUnlocked ? 'locked' : ''}`}
                                    style={{ backgroundColor: isUnlocked ? unit.color : undefined }}
                                >
                                    <span>{unit.icon}</span>
                                </div>
                                {isComplete && (
                                    <div className="unit-crown text-2xl">👑</div>
                                )}
                                <h3
                                    className="mt-3 font-bold text-center"
                                    style={{ color: isUnlocked ? '#3C3C3C' : '#AFAFAF' }}
                                >
                                    {unit.title}
                                </h3>
                                <p className="text-sm" style={{ color: '#AFAFAF' }}>
                                    {progress.completed}/{progress.total} lessons
                                </p>
                            </div>

                            {/* Lessons in unit */}
                            {isUnlocked && (
                                <div className="flex flex-wrap justify-center gap-4 relative z-10">
                                    {unit.lessons.map((lesson, lessonIndex) => {
                                        const completed = isLessonCompleted(lesson.id);
                                        const canStart = canStartLesson(lesson, unit, lessonIndex);
                                        const isCurrent = lesson.id === nextLessonId;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => canStart && startLesson(lesson.id)}
                                                className={`lesson-node ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!canStart ? 'locked' : ''}`}
                                                disabled={!canStart}
                                                title={lesson.title}
                                            >
                                                {completed ? '✓' : lessonIndex + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Locked unit overlay */}
                            {!isUnlocked && (
                                <div className="flex justify-center">
                                    <div
                                        className="px-4 py-2 rounded-full text-sm font-bold"
                                        style={{ backgroundColor: '#E5E5E5', color: '#AFAFAF' }}
                                    >
                                        🔒 Complete previous unit to unlock
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Coming soon */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                        style={{ backgroundColor: '#E5E5E5' }}
                    >
                        🚧
                    </div>
                    <h3 className="mt-3 font-bold" style={{ color: '#AFAFAF' }}>
                        More Coming Soon!
                    </h3>
                    <p className="text-sm" style={{ color: '#AFAFAF' }}>
                        VLANs, Routing, Security & more
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
