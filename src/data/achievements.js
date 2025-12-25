// Achievements and badges for gamification
export const achievements = [
    {
        id: "first-command",
        title: "First Command! 🎯",
        description: "Type your first CLI command",
        icon: "⌨️",
        xpBonus: 10,
        condition: "commands_typed >= 1"
    },
    {
        id: "commander",
        title: "Commander 🎖️",
        description: "Type 50 commands",
        icon: "🎖️",
        xpBonus: 50,
        condition: "commands_typed >= 50"
    },
    {
        id: "first-lesson",
        title: "Getting Started 📚",
        description: "Complete your first lesson",
        icon: "📚",
        xpBonus: 15,
        condition: "lessons_completed >= 1"
    },
    {
        id: "unit-master",
        title: "Unit Master 🏅",
        description: "Complete an entire unit",
        icon: "🏅",
        xpBonus: 30,
        condition: "units_completed >= 1"
    },
    {
        id: "perfect-lesson",
        title: "Perfect! ✨",
        description: "Complete a lesson with no mistakes",
        icon: "✨",
        xpBonus: 20,
        condition: "perfect_lessons >= 1"
    },
    {
        id: "streak-3",
        title: "On Fire! 🔥",
        description: "Maintain a 3-day streak",
        icon: "🔥",
        xpBonus: 25,
        condition: "streak >= 3"
    },
    {
        id: "streak-7",
        title: "Week Warrior 💪",
        description: "Maintain a 7-day streak",
        icon: "💪",
        xpBonus: 50,
        condition: "streak >= 7"
    },
    {
        id: "streak-30",
        title: "Dedicated! 🌟",
        description: "Maintain a 30-day streak",
        icon: "🌟",
        xpBonus: 200,
        condition: "streak >= 30"
    },
    {
        id: "ip-master",
        title: "IP Master 🔢",
        description: "Complete all IP address lessons",
        icon: "🔢",
        xpBonus: 50,
        condition: "ip_unit_complete"
    },
    {
        id: "config-pro",
        title: "Config Pro ⚙️",
        description: "Configure 10 device settings",
        icon: "⚙️",
        xpBonus: 40,
        condition: "configurations >= 10"
    },
    {
        id: "quick-learner",
        title: "Quick Learner ⚡",
        description: "Complete 5 lessons in one day",
        icon: "⚡",
        xpBonus: 35,
        condition: "daily_lessons >= 5"
    },
    {
        id: "network-ninja",
        title: "Network Ninja 🥷",
        description: "Complete all beginner units",
        icon: "🥷",
        xpBonus: 100,
        condition: "all_beginner_units_complete"
    }
];

// Level thresholds for user leveling
export const levelThresholds = [
    { level: 1, xp: 0, title: "Newbie" },
    { level: 2, xp: 50, title: "Beginner" },
    { level: 3, xp: 150, title: "Learner" },
    { level: 4, xp: 300, title: "Student" },
    { level: 5, xp: 500, title: "Apprentice" },
    { level: 6, xp: 750, title: "Junior Engineer" },
    { level: 7, xp: 1100, title: "Engineer" },
    { level: 8, xp: 1500, title: "Senior Engineer" },
    { level: 9, xp: 2000, title: "Expert" },
    { level: 10, xp: 3000, title: "Network Master" }
];

// Get user level from XP
export const getUserLevel = (xp) => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (xp >= levelThresholds[i].xp) {
            return levelThresholds[i];
        }
    }
    return levelThresholds[0];
};

// Get XP needed for next level
export const getXPForNextLevel = (xp) => {
    const currentLevel = getUserLevel(xp);
    const nextLevel = levelThresholds.find(l => l.xp > xp);
    if (!nextLevel) return null;
    return {
        needed: nextLevel.xp - xp,
        total: nextLevel.xp - currentLevel.xp,
        progress: ((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100
    };
};

// Daily goals
export const dailyGoals = [
    { xp: 10, name: "Casual", description: "5 minutes a day" },
    { xp: 20, name: "Regular", description: "10 minutes a day" },
    { xp: 30, name: "Serious", description: "15 minutes a day" },
    { xp: 50, name: "Intense", description: "20+ minutes a day" }
];
