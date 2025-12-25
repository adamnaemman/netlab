import { useLab } from '../context/LabContext';
import { useAuth } from '../context/AuthContext';
import { units, levels } from '../data/levels';
import { useState } from 'react';
import Guidebook from './Guidebook';
import ProfilePage from './ProfilePage';
import ComingSoon from './ComingSoon';

const HomeScreen = () => {
    const { state, startLevel, isLevelComplete, isLevelUnlocked } = useLab();
    const { user, isGuest, signOut } = useAuth();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showGuidebook, setShowGuidebook] = useState(false);
    const [guidebookUnit, setGuidebookUnit] = useState(1);
    const [showProfile, setShowProfile] = useState(false);
    const [comingSoon, setComingSoon] = useState(null); // {feature, icon}

    const openGuidebook = (unitId = 1) => {
        setGuidebookUnit(unitId);
        setShowGuidebook(true);
    };

    return (
        <div
            className="min-h-screen flex flex-col lg:flex-row"
            style={{ backgroundColor: '#0d1117' }}
        >
            {/* Guidebook Modal */}
            {showGuidebook && <Guidebook onClose={() => setShowGuidebook(false)} initialUnit={guidebookUnit} />}

            {/* Profile Modal */}
            {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}

            {/* Coming Soon Modal */}
            {comingSoon && <ComingSoon feature={comingSoon.feature} icon={comingSoon.icon} onClose={() => setComingSoon(null)} />}

            {/* Mobile Header */}
            <div
                className="lg:hidden sticky top-0 z-50 p-3 flex items-center justify-between"
                style={{ backgroundColor: '#161b22', borderBottom: '3px solid #30363d' }}
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: '#0d1117' }}
                    >
                        ☰
                    </button>
                    <span className="text-2xl">🌐</span>
                    <span className="font-black text-lg" style={{ color: '#58cc02' }}>NetLab</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-sm" style={{ color: '#ff9600' }}>🔥 {state.streak}</span>
                    <span className="font-bold text-sm" style={{ color: '#ffc800' }}>⚡ {state.xp}</span>
                    <span className="font-bold text-sm" style={{ color: '#ff4b4b' }}>❤️ {state.hearts}</span>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div
                    className="lg:hidden fixed inset-0 z-[60]"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
                    onClick={() => setShowMobileMenu(false)}
                >
                    <div
                        className="w-64 h-full p-4"
                        style={{ backgroundColor: '#161b22' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                style={{ backgroundColor: '#58cc02', boxShadow: '0 4px 0 #46a302' }}
                            >
                                🌐
                            </div>
                            <span className="text-2xl font-black" style={{ color: '#58cc02' }}>NetLab</span>
                        </div>
                        <nav className="space-y-2">
                            <NavItem icon="🏠" label="LEARN" active onClick={() => { setShowMobileMenu(false); setShowGuidebook(false); setShowProfile(false); }} />
                            <NavItem icon="📖" label="GUIDEBOOK" onClick={() => { setShowMobileMenu(false); setShowProfile(false); openGuidebook(); }} />
                            <NavItem icon="⌨️" label="PRACTICE" onClick={() => { setShowMobileMenu(false); setComingSoon({ feature: 'Practice Mode', icon: '⌨️' }); }} />
                            <NavItem icon="🏆" label="LEADERBOARDS" onClick={() => { setShowMobileMenu(false); setComingSoon({ feature: 'Leaderboards', icon: '🏆' }); }} />
                            <NavItem icon="🛒" label="SHOP" onClick={() => { setShowMobileMenu(false); setComingSoon({ feature: 'Shop', icon: '🛒' }); }} />
                            <NavItem icon="👤" label="PROFILE" onClick={() => { setShowMobileMenu(false); setShowGuidebook(false); setShowProfile(true); }} />
                        </nav>

                        {/* Mobile Auth Controls */}
                        <div className="mt-8 pt-6 border-t" style={{ borderColor: '#30363d' }}>
                            {isGuest && (
                                <button
                                    onClick={() => { setShowMobileMenu(false); signOut(); }}
                                    className="w-full mb-4 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                                    style={{ backgroundColor: '#1cb0f6', color: 'white', boxShadow: '0 4px 0 #1899d6' }}
                                >
                                    <span>✨</span> CREATE ACCOUNT
                                </button>
                            )}
                            <button
                                onClick={() => { setShowMobileMenu(false); signOut(); }}
                                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 opacity-70 hover:opacity-100 transition-all"
                                style={{ backgroundColor: '#21262d', color: '#f85149', border: '1px solid #30363d' }}
                            >
                                🚪 {isGuest ? 'Exit Guest Mode' : 'Logout Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Sidebar - Desktop only - FIXED */}
            <aside
                className="w-64 flex-shrink-0 border-r hidden lg:flex flex-col h-screen sticky top-0"
                style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}
            >
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-8 p-3 rounded-2xl" style={{ backgroundColor: '#0d1117' }}>
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: '#58cc02', boxShadow: '0 4px 0 #46a302' }}
                        >
                            🌐
                        </div>
                        <span className="text-2xl font-black" style={{ color: '#58cc02' }}>NetLab</span>
                    </div>
                    <nav className="space-y-2">
                        <NavItem icon="🏠" label="LEARN" active />
                        <NavItem icon="📖" label="GUIDEBOOK" onClick={() => openGuidebook()} />
                        <NavItem icon="⌨️" label="PRACTICE" onClick={() => setComingSoon({ feature: 'Practice Mode', icon: '⌨️' })} />
                        <NavItem icon="🏆" label="LEADERBOARDS" onClick={() => setComingSoon({ feature: 'Leaderboards', icon: '🏆' })} />
                        <NavItem icon="🛒" label="SHOP" onClick={() => setComingSoon({ feature: 'Shop', icon: '🛒' })} />
                        <NavItem icon="👤" label="PROFILE" onClick={() => setShowProfile(true)} />
                    </nav>
                </div>
                <div className="mt-auto p-4 space-y-3">
                    {/* User Profile */}
                    <div className="p-3 rounded-2xl" style={{ backgroundColor: '#0d1117', border: '2px solid #30363d' }}>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                                style={{ backgroundColor: isGuest ? '#6e7681' : '#1cb0f6' }}
                            >
                                {isGuest ? '👤' : '✉️'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate" style={{ color: '#c9d1d9' }}>
                                    {isGuest ? 'Guest' : user?.email?.split('@')[0]}
                                </p>
                                <p className="text-xs" style={{ color: '#6e7681' }}>
                                    {isGuest ? 'Local progress' : 'Synced'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Streak Card */}
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: '#0d1117', border: '3px solid #ff9600' }}>
                        <div className="flex items-center gap-3">
                            <div className="text-4xl animate-bounce">🔥</div>
                            <div>
                                <p className="text-2xl font-black" style={{ color: '#ff9600' }}>{state.streak}</p>
                                <p className="text-sm font-bold" style={{ color: '#8b949e' }}>day streak!</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={signOut}
                        className="w-full py-2 rounded-xl text-sm font-bold transition-all"
                        style={{ backgroundColor: '#21262d', color: '#f85149', border: '1px solid #30363d' }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Center - Learning Path */}
            <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
                <div className="py-4 lg:py-8 px-4">
                    {units.map((unit, unitIndex) => {
                        const unitLevels = unit.levels;
                        const completedInUnit = unitLevels.filter(l => isLevelComplete(l.id)).length;
                        const unitProgress = (completedInUnit / unitLevels.length) * 100;

                        return (
                            <div key={unit.id} className="mb-8 lg:mb-12">
                                {/* Guest Banner - Only for guest users on mobile, above Unit 1 */}
                                {isGuest && unitIndex === 0 && (
                                    <div
                                        className="lg:hidden mx-auto max-w-lg mb-6 p-4 rounded-2xl animate-fade-in"
                                        style={{
                                            background: 'linear-gradient(135deg, #1cb0f6 0%, #0d90d1 100%)',
                                            boxShadow: '0 4px 15px rgba(28, 176, 246, 0.3)'
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl">✨</div>
                                            <div className="flex-1">
                                                <p className="font-black text-white text-sm">Sync your progress!</p>
                                                <p className="text-white/80 text-xs">Create an account to save your XP across devices.</p>
                                            </div>
                                            <button
                                                onClick={signOut}
                                                className="px-4 py-2 bg-white rounded-xl text-xs font-black"
                                                style={{ color: '#1cb0f6' }}
                                            >
                                                SIGN UP
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Unit Header */}
                                <div
                                    className="sticky top-14 lg:top-0 z-10 p-3 sm:p-4 rounded-xl lg:rounded-2xl mb-6 max-w-lg mx-auto"
                                    style={{
                                        background: `linear-gradient(135deg, ${unit.color} 0%, ${unit.color}dd 100%)`,
                                        boxShadow: `0 4px 0 ${unit.color}88`
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl"
                                                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                            >
                                                {unit.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white/80">UNIT {unit.id}</p>
                                                <p className="text-sm sm:text-lg font-black text-white">{unit.name}</p>
                                            </div>
                                        </div>
                                        {/* Guidebook Button on Unit Header */}
                                        <button
                                            onClick={() => openGuidebook(unit.id)}
                                            className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                        >
                                            <span>📖</span>
                                            <span className="hidden sm:inline">Guide</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                                            <div className="h-full rounded-full transition-all" style={{ width: `${unitProgress}%`, backgroundColor: 'white' }} />
                                        </div>
                                        <span className="text-sm font-black text-white">{completedInUnit}/{unitLevels.length}</span>
                                    </div>
                                </div>

                                {/* Levels - Zigzag path */}
                                <div className="max-w-sm mx-auto">
                                    {unitLevels.map((level, levelIndex) => {
                                        const completed = isLevelComplete(level.id);
                                        const unlocked = isLevelUnlocked(level.id);
                                        const isNext = unlocked && !completed;
                                        const offset = levelIndex % 2 === 0 ? '-20px' : '20px';

                                        return (
                                            <div
                                                key={level.id}
                                                className="relative mb-6"
                                                style={{ marginLeft: offset }}
                                            >
                                                {levelIndex > 0 && (
                                                    <div
                                                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-6 rounded-full"
                                                        style={{ backgroundColor: completed ? unit.color : '#30363d' }}
                                                    />
                                                )}

                                                <div className="flex flex-col items-center">
                                                    {isNext && levelIndex === unitLevels.findIndex(l => !isLevelComplete(l.id)) && (
                                                        <div
                                                            className="mb-2 px-3 py-1 rounded-lg text-xs font-black animate-bounce"
                                                            style={{ backgroundColor: unit.color, color: 'white', boxShadow: `0 3px 0 ${unit.color}88` }}
                                                        >
                                                            {completedInUnit === 0 ? '🚀 START' : '👉 NEXT'}
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => unlocked && startLevel(level.id)}
                                                        disabled={!unlocked}
                                                        className="relative group"
                                                        style={{ cursor: unlocked ? 'pointer' : 'not-allowed' }}
                                                    >
                                                        {isNext && (
                                                            <div
                                                                className="absolute inset-0 rounded-full animate-ping opacity-20"
                                                                style={{ backgroundColor: unit.color }}
                                                            />
                                                        )}

                                                        <div
                                                            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-transform transform active:scale-95"
                                                            style={{
                                                                backgroundColor: completed ? unit.color : unlocked ? unit.color : '#30363d',
                                                                opacity: completed || unlocked ? 1 : 0.5,
                                                                boxShadow: unlocked ? `0 4px 0 ${unit.color}88` : 'none',
                                                                border: completed ? '3px solid #ffc800' : 'none',
                                                            }}
                                                        >
                                                            {completed ? '✓' : unlocked ? unit.icon : '🔒'}
                                                        </div>

                                                        {completed && (
                                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                                <span className="text-lg sm:text-xl">👑</span>
                                                            </div>
                                                        )}

                                                        <div
                                                            className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-black"
                                                            style={{
                                                                backgroundColor: '#0d1117',
                                                                color: unlocked ? unit.color : '#6e7681',
                                                                border: `2px solid ${unlocked ? unit.color : '#30363d'}`
                                                            }}
                                                        >
                                                            {levelIndex + 1}
                                                        </div>
                                                    </button>

                                                    <p
                                                        className="mt-2 text-xs sm:text-sm font-bold text-center max-w-[100px] sm:max-w-[120px]"
                                                        style={{ color: unlocked ? '#c9d1d9' : '#6e7681' }}
                                                    >
                                                        {level.name}
                                                    </p>
                                                    <p className="text-xs" style={{ color: '#8b949e' }}>
                                                        ⚡ {level.totalXP} XP
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {unitIndex === 0 && (
                                    <div className="flex justify-center mt-4">
                                        <div className="relative">
                                            <div className="text-4xl sm:text-5xl">🧑‍💻</div>
                                            <div
                                                className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap"
                                                style={{ backgroundColor: '#30363d', color: '#c9d1d9' }}
                                            >
                                                Keep going! 💪
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="text-center mt-6 opacity-50 pb-8">
                        <div className="text-3xl mb-2">🔒</div>
                        <p className="font-bold text-sm" style={{ color: '#6e7681' }}>More units coming soon!</p>
                        <p className="text-xs" style={{ color: '#484f58' }}>Inter-VLAN Routing • ACLs • NAT</p>
                    </div>
                </div>
            </main>

            {/* Right Sidebar - Desktop only - FIXED */}
            <aside
                className="w-80 flex-shrink-0 border-l hidden xl:flex flex-col h-screen sticky top-0 p-4 overflow-y-auto"
                style={{ backgroundColor: '#161b22', borderColor: '#30363d' }}
            >
                {/* Guidebook Card */}
                <button
                    onClick={() => setShowGuidebook(true)}
                    className="w-full rounded-3xl p-4 mb-4 flex items-center gap-3 transition-all active:scale-98"
                    style={{ backgroundColor: '#0d1117', border: '3px solid #9333ea' }}
                >
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: '#9333ea' }}
                    >
                        📖
                    </div>
                    <div className="text-left">
                        <p className="font-black" style={{ color: '#9333ea' }}>Guidebook</p>
                        <p className="text-xs" style={{ color: '#8b949e' }}>Learn all commands</p>
                    </div>
                    <span className="ml-auto text-lg" style={{ color: '#8b949e' }}>→</span>
                </button>

                <div className="flex items-center justify-center gap-3 mb-6">
                    <StatBubble icon="🔥" value={state.streak} color="#ff9600" label="streak" />
                    <StatBubble icon="💎" value="500" color="#1cb0f6" label="gems" />
                    <StatBubble icon="❤️" value={state.hearts} color="#ff4b4b" label="lives" />
                </div>

                <div className="rounded-3xl p-5 mb-4" style={{ backgroundColor: '#0d1117', border: '3px solid #ffc800' }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">⚡</div>
                        <div>
                            <p className="font-black text-xl" style={{ color: '#ffc800' }}>{state.xp} XP</p>
                            <p className="text-sm" style={{ color: '#8b949e' }}>total earned!</p>
                        </div>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: '#30363d' }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, (state.xp / 100) * 100)}%`, background: 'linear-gradient(90deg, #ffc800, #ff9600)' }} />
                    </div>
                </div>

                <div className="rounded-3xl p-5 mb-4" style={{ backgroundColor: '#0d1117', border: '3px solid #58cc02' }}>
                    <p className="font-black text-lg mb-4" style={{ color: '#c9d1d9' }}>📊 Progress</p>
                    {units.map(unit => {
                        const unitLevels = unit.levels;
                        const completedInUnit = unitLevels.filter(l => isLevelComplete(l.id)).length;
                        const progress = (completedInUnit / unitLevels.length) * 100;
                        return (
                            <div key={unit.id} className="mb-3 last:mb-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold" style={{ color: '#c9d1d9' }}>{unit.icon} {unit.name}</span>
                                    <span className="text-xs font-bold" style={{ color: unit.color }}>{completedInUnit}/{unitLevels.length}</span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#30363d' }}>
                                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: unit.color }} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-3xl p-5" style={{ backgroundColor: '#0d1117', border: '3px solid #1cb0f6' }}>
                    <p className="font-black text-lg mb-4" style={{ color: '#c9d1d9' }}>🎯 Daily Quests</p>
                    <QuestCard icon="⚡" title="Earn 50 XP" progress={Math.min(100, (state.xp / 50) * 100)} current={state.xp} goal={50} color="#ffc800" />
                    <QuestCard icon="📚" title="Complete 3 levels" progress={(state.completedLevels.length / 3) * 100} current={state.completedLevels.length} goal={3} color="#58cc02" />
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 px-4"
                style={{ backgroundColor: '#161b22', borderTop: '3px solid #30363d' }}
            >
                <BottomNavItem icon="🏠" label="Learn" active onClick={() => { setShowGuidebook(false); setShowProfile(false); }} />
                <BottomNavItem icon="📖" label="Guide" onClick={() => { setShowProfile(false); openGuidebook(); }} />
                <BottomNavItem icon="🏆" label="Ranks" onClick={() => setComingSoon({ feature: 'Leaderboards', icon: '🏆' })} />
                <BottomNavItem icon="🎯" label="Quests" onClick={() => setComingSoon({ feature: 'Quests', icon: '🎯' })} />
                <BottomNavItem icon="👤" label="Profile" onClick={() => { setShowGuidebook(false); setShowProfile(true); }} />
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-sm transition-all"
        style={{
            backgroundColor: active ? '#58cc02' : 'transparent',
            color: active ? 'white' : '#8b949e',
            boxShadow: active ? '0 4px 0 #46a302' : 'none',
        }}
    >
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
    </button>
);

const BottomNavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 px-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-bold" style={{ color: active ? '#58cc02' : '#8b949e' }}>{label}</span>
    </button>
);

const StatBubble = ({ icon, value, color, label }) => (
    <div className="text-center">
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1"
            style={{ backgroundColor: '#0d1117', border: `3px solid ${color}` }}
        >
            {icon}
        </div>
        <p className="font-black" style={{ color }}>{value}</p>
        <p className="text-xs" style={{ color: '#8b949e' }}>{label}</p>
    </div>
);

const QuestCard = ({ icon, title, progress, current, goal, color }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl mb-2 last:mb-0" style={{ backgroundColor: '#161b22' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#0d1117' }}>{icon}</div>
        <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: '#c9d1d9' }}>{title}</p>
            <div className="h-2 rounded-full overflow-hidden mt-1" style={{ backgroundColor: '#30363d' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, progress)}%`, backgroundColor: color }} />
            </div>
        </div>
        <span className="text-xs font-bold" style={{ color: '#8b949e' }}>{current}/{goal}</span>
    </div>
);

export default HomeScreen;
