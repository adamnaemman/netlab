import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLab } from '../context/LabContext';
import { units } from '../data/levels';

const ProfilePage = ({ onClose }) => {
    const { user, isGuest, signOut } = useAuth();
    const { state, isLevelComplete } = useLab();
    const [activeTab, setActiveTab] = useState('stats');

    // Calculate stats
    const totalLevels = units.reduce((acc, unit) => acc + unit.levels.length, 0);
    const completedLevels = units.reduce((acc, unit) =>
        acc + unit.levels.filter(l => isLevelComplete(l.id)).length, 0
    );
    const progressPercent = Math.round((completedLevels / totalLevels) * 100);

    // Achievements based on progress
    const achievements = [
        { id: 1, icon: '🎯', name: 'First Steps', desc: 'Complete your first level', unlocked: completedLevels >= 1 },
        { id: 2, icon: '🔥', name: 'On Fire', desc: 'Reach a 3-day streak', unlocked: state.streak >= 3 },
        { id: 3, icon: '⚡', name: 'Power User', desc: 'Earn 100 XP', unlocked: state.xp >= 100 },
        { id: 4, icon: '🏆', name: 'Unit Master', desc: 'Complete Unit 1', unlocked: units[0]?.levels.every(l => isLevelComplete(l.id)) },
        { id: 5, icon: '💎', name: 'Gem Collector', desc: 'Earn 500 XP', unlocked: state.xp >= 500 },
        { id: 6, icon: '🌟', name: 'Network Pro', desc: 'Complete all levels', unlocked: completedLevels === totalLevels },
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0d1117' }}>
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 border-b flex-shrink-0"
                style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                        <h1 className="text-lg font-black" style={{ color: '#c9d1d9' }}>Profile</h1>
                        <p className="text-xs" style={{ color: '#8b949e' }}>Your learning journey</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: '#21262d', color: '#8b949e' }}
                >
                    ✕
                </button>
            </div>

            {/* Profile Header */}
            <div className="p-4" style={{ backgroundColor: '#161b22' }}>
                <div className="flex items-center gap-4">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                        style={{
                            backgroundColor: isGuest ? '#6e7681' : '#58cc02',
                            boxShadow: isGuest ? '0 4px 0 #484f58' : '0 4px 0 #46a302'
                        }}
                    >
                        {isGuest ? '👤' : '🧑‍💻'}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-black" style={{ color: '#c9d1d9' }}>
                            {isGuest ? 'Guest User' : user?.email?.split('@')[0]}
                        </h2>
                        <p className="text-sm" style={{ color: '#8b949e' }}>
                            {isGuest ? 'Progress saved locally' : user?.email}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 rounded-full text-xs font-bold"
                                style={{ backgroundColor: '#1f2937', color: '#58cc02' }}>
                                Level {Math.floor(state.xp / 100) + 1}
                            </span>
                            {state.streak > 0 && (
                                <span className="px-2 py-1 rounded-full text-xs font-bold"
                                    style={{ backgroundColor: '#292211', color: '#ff9600' }}>
                                    🔥 {state.streak} streak
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-3" style={{ backgroundColor: '#161b22', borderBottom: '1px solid #30363d' }}>
                {[
                    { id: 'stats', label: '📊 Stats', color: '#58cc02' },
                    { id: 'achievements', label: '🏆 Achievements', color: '#ffc800' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex-1 py-2 rounded-xl font-bold text-sm transition-all"
                        style={{
                            backgroundColor: activeTab === tab.id ? tab.color : '#21262d',
                            color: activeTab === tab.id ? 'white' : '#8b949e',
                            boxShadow: activeTab === tab.id ? `0 3px 0 ${tab.color}88` : 'none',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {activeTab === 'stats' && (
                    <div className="space-y-4">
                        {/* XP Progress */}
                        <div className="rounded-2xl p-4" style={{ backgroundColor: '#161b22', border: '2px solid #30363d' }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold" style={{ color: '#c9d1d9' }}>⚡ Total XP</span>
                                <span className="text-2xl font-black" style={{ color: '#ffc800' }}>{state.xp}</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#30363d' }}>
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${(state.xp % 100)}%`,
                                        background: 'linear-gradient(90deg, #ffc800, #ff9600)'
                                    }}
                                />
                            </div>
                            <p className="text-xs mt-1" style={{ color: '#6e7681' }}>
                                {100 - (state.xp % 100)} XP to next level
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <StatCard icon="🎯" label="Levels Done" value={completedLevels} total={totalLevels} color="#58cc02" />
                            <StatCard icon="🔥" label="Day Streak" value={state.streak} color="#ff9600" />
                            <StatCard icon="❤️" label="Hearts" value={state.hearts} total={5} color="#ff4b4b" />
                            <StatCard icon="📈" label="Progress" value={`${progressPercent}%`} color="#1cb0f6" />
                        </div>

                        {/* Unit Progress */}
                        <div className="rounded-2xl p-4" style={{ backgroundColor: '#161b22', border: '2px solid #30363d' }}>
                            <h3 className="font-bold mb-3" style={{ color: '#c9d1d9' }}>📚 Unit Progress</h3>
                            <div className="space-y-3">
                                {units.map(unit => {
                                    const completed = unit.levels.filter(l => isLevelComplete(l.id)).length;
                                    const total = unit.levels.length;
                                    const percent = (completed / total) * 100;
                                    return (
                                        <div key={unit.id}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm" style={{ color: '#c9d1d9' }}>{unit.icon} {unit.name}</span>
                                                <span className="text-xs font-bold" style={{ color: unit.color }}>{completed}/{total}</span>
                                            </div>
                                            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#30363d' }}>
                                                <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: unit.color }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="space-y-3">
                        <p className="text-sm mb-4" style={{ color: '#8b949e' }}>
                            🎖️ {unlockedCount}/{achievements.length} achievements unlocked
                        </p>
                        {achievements.map(achievement => (
                            <div
                                key={achievement.id}
                                className="rounded-xl p-4 flex items-center gap-4"
                                style={{
                                    backgroundColor: achievement.unlocked ? '#161b22' : '#0d1117',
                                    border: `2px solid ${achievement.unlocked ? '#ffc800' : '#30363d'}`,
                                    opacity: achievement.unlocked ? 1 : 0.6,
                                }}
                            >
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                    style={{
                                        backgroundColor: achievement.unlocked ? '#292211' : '#21262d',
                                    }}
                                >
                                    {achievement.unlocked ? achievement.icon : '🔒'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold" style={{ color: achievement.unlocked ? '#ffc800' : '#6e7681' }}>
                                        {achievement.name}
                                    </p>
                                    <p className="text-xs" style={{ color: '#8b949e' }}>{achievement.desc}</p>
                                </div>
                                {achievement.unlocked && (
                                    <span style={{ color: '#58cc02' }}>✓</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex-shrink-0" style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}>
                <button
                    onClick={signOut}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#21262d', color: '#f85149', border: '1px solid #30363d' }}
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, label, value, total, color }) => (
    <div className="rounded-xl p-3" style={{ backgroundColor: '#161b22', border: '2px solid #30363d' }}>
        <div className="text-2xl mb-1">{icon}</div>
        <p className="text-xl font-black" style={{ color }}>
            {value}{total !== undefined && <span style={{ color: '#6e7681' }}>/{total}</span>}
        </p>
        <p className="text-xs" style={{ color: '#8b949e' }}>{label}</p>
    </div>
);

export default ProfilePage;
