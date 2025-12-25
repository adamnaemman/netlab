// Complete curriculum with units, lessons, and exercises for beginners
export const curriculum = [
    {
        id: 1,
        title: "What is a Network?",
        description: "Learn the basics of computer networks",
        icon: "🌐",
        color: "#58CC02",
        lessons: [
            {
                id: "1-1",
                title: "Networks Are Everywhere",
                type: "concept",
                xpReward: 15,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "Welcome to Networking! 🎉",
                            text: "A network is simply two or more devices connected together to share information.",
                            image: "network-basic",
                            highlight: "network"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Networks in Your Life",
                            text: "Your home WiFi is a network! It connects your phone, laptop, and smart TV together.",
                            image: "home-network",
                            highlight: "WiFi"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "The Internet",
                            text: "The Internet is the world's largest network - billions of devices connected globally!",
                            image: "internet",
                            highlight: "Internet"
                        }
                    },
                    {
                        type: "multiple-choice",
                        question: "What is a network?",
                        options: [
                            "A single computer",
                            "Two or more devices connected together",
                            "A type of cable",
                            "A software program"
                        ],
                        correctIndex: 1,
                        explanation: "A network connects devices so they can communicate and share resources."
                    }
                ]
            },
            {
                id: "1-2",
                title: "Meet the Devices",
                type: "concept",
                xpReward: 15,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "The Router 📡",
                            text: "A router connects different networks together and decides where to send data.",
                            image: "router",
                            highlight: "router"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "The Switch 🔀",
                            text: "A switch connects devices within the SAME network, like computers in an office.",
                            image: "switch",
                            highlight: "switch"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "End Devices 💻",
                            text: "Computers, phones, printers - these are 'end devices' that people use directly.",
                            image: "end-devices",
                            highlight: "end devices"
                        }
                    },
                    {
                        type: "drag-match",
                        instruction: "Match each device to its job:",
                        pairs: [
                            { left: "Router", right: "Connects different networks" },
                            { left: "Switch", right: "Connects devices in same network" },
                            { left: "Computer", right: "End device for users" }
                        ]
                    },
                    {
                        type: "multiple-choice",
                        question: "Which device connects devices within the SAME network?",
                        options: ["Router", "Switch", "Modem", "Firewall"],
                        correctIndex: 1,
                        explanation: "Switches connect devices together within a local network (LAN)."
                    }
                ]
            },
            {
                id: "1-3",
                title: "IP Addresses",
                type: "concept",
                xpReward: 20,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "What's an IP Address? 🏠",
                            text: "An IP address is like a home address for your device on the network.",
                            image: "ip-address",
                            highlight: "IP address"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "IP Address Format",
                            text: "IPv4 addresses have 4 numbers separated by dots. Example: 192.168.1.1",
                            image: "ip-format",
                            highlight: "192.168.1.1",
                            code: true
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Each Number: 0-255",
                            text: "Each part of an IP address can be from 0 to 255. So 192.168.1.256 is INVALID!",
                            image: "ip-range",
                            highlight: "0 to 255"
                        }
                    },
                    {
                        type: "multiple-choice",
                        question: "Which is a valid IP address?",
                        options: [
                            "192.168.1.300",
                            "192.168.1.1",
                            "192.168.1",
                            "192.168.1.1.1"
                        ],
                        correctIndex: 1,
                        explanation: "192.168.1.1 is valid - each number is between 0-255 and there are exactly 4 parts."
                    },
                    {
                        type: "fill-blank",
                        instruction: "Complete the IP address:",
                        template: "192.168._____.1",
                        answer: "1",
                        hint: "This is a common home network IP pattern"
                    }
                ]
            },
            {
                id: "1-4",
                title: "Unit 1 Review",
                type: "quiz",
                xpReward: 30,
                exercises: [
                    {
                        type: "multiple-choice",
                        question: "What connects different networks together?",
                        options: ["Switch", "Router", "Cable", "Computer"],
                        correctIndex: 1
                    },
                    {
                        type: "multiple-choice",
                        question: "How many numbers are in an IPv4 address?",
                        options: ["2", "3", "4", "6"],
                        correctIndex: 2
                    },
                    {
                        type: "drag-match",
                        instruction: "Match the terms:",
                        pairs: [
                            { left: "192.168.1.1", right: "IP Address" },
                            { left: "Router", right: "Connects networks" },
                            { left: "Switch", right: "Connects local devices" }
                        ]
                    },
                    {
                        type: "multiple-choice",
                        question: "What is the maximum value for one part of an IP address?",
                        options: ["99", "199", "255", "999"],
                        correctIndex: 2
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Your First Commands",
        description: "Learn to use the command line interface",
        icon: "⌨️",
        color: "#1CB0F6",
        locked: false,
        lessons: [
            {
                id: "2-1",
                title: "Meet the CLI",
                type: "concept",
                xpReward: 15,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "The Command Line Interface 💻",
                            text: "Network engineers type commands to configure devices. This is called the CLI (Command Line Interface).",
                            image: "cli",
                            highlight: "CLI"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "The Prompt",
                            text: "The prompt shows you're ready to type. It looks like: Router>",
                            image: "prompt",
                            highlight: "Router>",
                            code: true
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Why CLI?",
                            text: "CLI is faster and more powerful than clicking buttons. All professionals use it!",
                            image: "cli-power",
                            highlight: "faster and more powerful"
                        }
                    },
                    {
                        type: "multiple-choice",
                        question: "What does CLI stand for?",
                        options: [
                            "Computer Link Interface",
                            "Command Line Interface",
                            "Control Layer Input",
                            "Central Login Interface"
                        ],
                        correctIndex: 1
                    }
                ]
            },
            {
                id: "2-2",
                title: "User Mode vs Privileged Mode",
                type: "concept",
                xpReward: 20,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "User Mode 👤",
                            text: "When you first connect, you're in User Mode. You can only view basic info.",
                            image: "user-mode",
                            highlight: "User Mode",
                            code: "Router>"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Privileged Mode 🔐",
                            text: "To make changes, you need Privileged Mode. The prompt changes to: Router#",
                            image: "priv-mode",
                            highlight: "Router#",
                            code: true
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "The 'enable' Command",
                            text: "Type 'enable' to enter Privileged Mode. It's like getting admin access!",
                            image: "enable",
                            highlight: "enable",
                            code: true
                        }
                    },
                    {
                        type: "drag-match",
                        instruction: "Match the prompts to their modes:",
                        pairs: [
                            { left: "Router>", right: "User Mode" },
                            { left: "Router#", right: "Privileged Mode" }
                        ]
                    },
                    {
                        type: "multiple-choice",
                        question: "What command enters Privileged Mode?",
                        options: ["privileged", "admin", "enable", "sudo"],
                        correctIndex: 2
                    }
                ]
            },
            {
                id: "2-3",
                title: "Type Your First Command",
                type: "practice",
                xpReward: 25,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "Let's Practice! 🎯",
                            text: "Now you'll type your first real command. Ready?",
                            image: "practice",
                            highlight: "Let's Practice"
                        }
                    },
                    {
                        type: "type-command",
                        instruction: "Enter Privileged Mode",
                        prompt: "Router>",
                        expectedCommand: "enable",
                        hint: "Type 'enable' to get admin access",
                        successMessage: "Great job! You're now in Privileged Mode!"
                    },
                    {
                        type: "type-command",
                        instruction: "Now go back to User Mode",
                        prompt: "Router#",
                        expectedCommand: "disable",
                        hint: "Type 'disable' to return to User Mode",
                        successMessage: "Perfect! You know how to switch modes!"
                    },
                    {
                        type: "multiple-choice",
                        question: "You see 'Router#' - which mode are you in?",
                        options: ["User Mode", "Privileged Mode", "Config Mode", "Interface Mode"],
                        correctIndex: 1
                    }
                ]
            },
            {
                id: "2-4",
                title: "Practice: Modes",
                type: "practice",
                xpReward: 25,
                exercises: [
                    {
                        type: "type-command",
                        instruction: "You're at User Mode. Enter Privileged Mode.",
                        prompt: "Router>",
                        expectedCommand: "enable",
                        hint: "What command gives you admin access?"
                    },
                    {
                        type: "fill-blank",
                        instruction: "Complete the command to exit Privileged Mode:",
                        template: "Router# dis_____",
                        answer: "able",
                        hint: "The opposite of enable"
                    },
                    {
                        type: "multiple-choice",
                        question: "Which prompt shows User Mode?",
                        options: ["Router#", "Router>", "Router(config)#", "Router(config-if)#"],
                        correctIndex: 1
                    },
                    {
                        type: "drag-match",
                        instruction: "Match the command to what it does:",
                        pairs: [
                            { left: "enable", right: "Enter Privileged Mode" },
                            { left: "disable", right: "Return to User Mode" },
                            { left: "?", right: "Show available commands" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Configuring Devices",
        description: "Start making real changes to network devices",
        icon: "⚙️",
        color: "#FF9600",
        locked: false,
        lessons: [
            {
                id: "3-1",
                title: "Config Mode",
                type: "concept",
                xpReward: 15,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "Configuration Mode 🔧",
                            text: "To change device settings, you need Configuration Mode.",
                            image: "config-mode",
                            highlight: "Configuration Mode"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Getting to Config Mode",
                            text: "From Privileged Mode, type 'configure terminal' (or 'conf t' for short)",
                            image: "conf-t",
                            highlight: "conf t",
                            code: true
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "The Config Prompt",
                            text: "In Config Mode, your prompt looks like: Router(config)#",
                            image: "config-prompt",
                            highlight: "Router(config)#",
                            code: true
                        }
                    },
                    {
                        type: "multiple-choice",
                        question: "What command enters Configuration Mode?",
                        options: ["config", "configure terminal", "setup", "settings"],
                        correctIndex: 1
                    },
                    {
                        type: "type-command",
                        instruction: "Enter Configuration Mode",
                        prompt: "Router#",
                        expectedCommand: "configure terminal",
                        alternateCommands: ["conf t", "conf term"],
                        hint: "You can also type 'conf t' as a shortcut"
                    }
                ]
            },
            {
                id: "3-2",
                title: "Setting a Hostname",
                type: "practice",
                xpReward: 20,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "What's a Hostname? 🏷️",
                            text: "A hostname is the name of your device. It helps you identify which device you're configuring.",
                            image: "hostname",
                            highlight: "hostname"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "The hostname Command",
                            text: "In Config Mode, type 'hostname' followed by the name you want.",
                            image: "hostname-cmd",
                            highlight: "hostname R1",
                            code: true
                        }
                    },
                    {
                        type: "fill-blank",
                        instruction: "Set the hostname to 'MainRouter':",
                        template: "Router(config)# ________ MainRouter",
                        answer: "hostname",
                        hint: "What command sets the device name?"
                    },
                    {
                        type: "type-command",
                        instruction: "Set this router's hostname to 'R1'",
                        prompt: "Router(config)#",
                        expectedCommand: "hostname R1",
                        hint: "Type hostname followed by R1",
                        successMessage: "The prompt changed to R1(config)#! 🎉"
                    },
                    {
                        type: "multiple-choice",
                        question: "After typing 'hostname CoreSwitch', what will the prompt show?",
                        options: [
                            "Router(config)#",
                            "CoreSwitch(config)#",
                            "hostname(config)#",
                            "Switch(config)#"
                        ],
                        correctIndex: 1
                    }
                ]
            },
            {
                id: "3-3",
                title: "Understanding Interfaces",
                type: "concept",
                xpReward: 20,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "What are Interfaces? 🔌",
                            text: "Interfaces are the physical ports on a device where you plug in cables.",
                            image: "interfaces",
                            highlight: "Interfaces"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Interface Names",
                            text: "Interfaces have names like 'GigabitEthernet0/0' or 'FastEthernet0/1'",
                            image: "interface-names",
                            highlight: "GigabitEthernet0/0",
                            code: true
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Short Names",
                            text: "You can use shortcuts: 'g0/0' = GigabitEthernet0/0, 'f0/1' = FastEthernet0/1",
                            image: "short-names",
                            highlight: "g0/0"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Configuring an Interface",
                            text: "Type 'interface g0/0' to configure that specific port.",
                            image: "interface-config",
                            highlight: "interface g0/0",
                            code: true
                        }
                    },
                    {
                        type: "drag-match",
                        instruction: "Match the shortcuts:",
                        pairs: [
                            { left: "g0/0", right: "GigabitEthernet0/0" },
                            { left: "f0/1", right: "FastEthernet0/1" },
                            { left: "g0/1", right: "GigabitEthernet0/1" }
                        ]
                    }
                ]
            },
            {
                id: "3-4",
                title: "Lab: Basic Configuration",
                type: "practice",
                xpReward: 35,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "Time for a Lab! 🧪",
                            text: "You'll now configure a router from scratch. Let's go!",
                            image: "lab",
                            highlight: "Lab"
                        }
                    },
                    {
                        type: "type-command",
                        instruction: "First, enter Privileged Mode",
                        prompt: "Router>",
                        expectedCommand: "enable"
                    },
                    {
                        type: "type-command",
                        instruction: "Now enter Configuration Mode",
                        prompt: "Router#",
                        expectedCommand: "configure terminal",
                        alternateCommands: ["conf t"]
                    },
                    {
                        type: "type-command",
                        instruction: "Set the hostname to 'HQ-Router'",
                        prompt: "Router(config)#",
                        expectedCommand: "hostname HQ-Router"
                    },
                    {
                        type: "type-command",
                        instruction: "Enter the GigabitEthernet0/0 interface",
                        prompt: "HQ-Router(config)#",
                        expectedCommand: "interface g0/0",
                        alternateCommands: ["interface gigabitethernet0/0", "int g0/0"]
                    },
                    {
                        type: "multiple-choice",
                        question: "What mode are you in when you see 'HQ-Router(config-if)#'?",
                        options: ["User Mode", "Privileged Mode", "Global Config Mode", "Interface Config Mode"],
                        correctIndex: 3,
                        explanation: "The 'if' stands for interface - you're configuring an interface!"
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "IP Address Assignment",
        description: "Configure IP addresses on interfaces",
        icon: "🔢",
        color: "#CE82FF",
        locked: false,
        lessons: [
            {
                id: "4-1",
                title: "Assigning IP Addresses",
                type: "concept",
                xpReward: 20,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "Giving Devices Addresses 📍",
                            text: "Each interface needs an IP address to communicate on the network.",
                            image: "ip-assign",
                            highlight: "IP address"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "The IP Address Command",
                            text: "In interface mode, type: ip address [IP] [SUBNET MASK]",
                            image: "ip-cmd",
                            highlight: "ip address",
                            code: true
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Example",
                            text: "ip address 192.168.1.1 255.255.255.0",
                            image: "ip-example",
                            highlight: "192.168.1.1",
                            code: true
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "What's a Subnet Mask?",
                            text: "255.255.255.0 is the most common subnet mask. It defines the network size.",
                            image: "subnet",
                            highlight: "255.255.255.0"
                        }
                    },
                    {
                        type: "fill-blank",
                        instruction: "Complete the command to set IP 10.0.0.1:",
                        template: "ip address ________ 255.255.255.0",
                        answer: "10.0.0.1",
                        hint: "Type the IP address"
                    }
                ]
            },
            {
                id: "4-2",
                title: "Enabling Interfaces",
                type: "concept",
                xpReward: 15,
                exercises: [
                    {
                        type: "concept-card",
                        content: {
                            title: "Interfaces Start OFF 🔴",
                            text: "By default, router interfaces are shut down (disabled).",
                            image: "shutdown",
                            highlight: "shut down"
                        }
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "Turn It On! 🟢",
                            text: "Type 'no shutdown' to enable an interface and bring it online.",
                            image: "no-shutdown",
                            highlight: "no shutdown",
                            code: true
                        }
                    },
                    {
                        type: "multiple-choice",
                        question: "What command enables a disabled interface?",
                        options: ["enable", "start", "no shutdown", "activate"],
                        correctIndex: 2
                    },
                    {
                        type: "type-command",
                        instruction: "Enable this interface",
                        prompt: "Router(config-if)#",
                        expectedCommand: "no shutdown",
                        alternateCommands: ["no shut"],
                        successMessage: "Interface is now UP! 🟢"
                    }
                ]
            },
            {
                id: "4-3",
                title: "Complete IP Configuration",
                type: "practice",
                xpReward: 30,
                exercises: [
                    {
                        type: "type-command",
                        instruction: "Enter Privileged Mode",
                        prompt: "Router>",
                        expectedCommand: "enable"
                    },
                    {
                        type: "type-command",
                        instruction: "Enter Configuration Mode",
                        prompt: "Router#",
                        expectedCommand: "conf t",
                        alternateCommands: ["configure terminal"]
                    },
                    {
                        type: "type-command",
                        instruction: "Enter interface GigabitEthernet0/0",
                        prompt: "Router(config)#",
                        expectedCommand: "interface g0/0",
                        alternateCommands: ["int g0/0"]
                    },
                    {
                        type: "type-command",
                        instruction: "Assign IP address 192.168.1.1 with mask 255.255.255.0",
                        prompt: "Router(config-if)#",
                        expectedCommand: "ip address 192.168.1.1 255.255.255.0"
                    },
                    {
                        type: "type-command",
                        instruction: "Enable the interface",
                        prompt: "Router(config-if)#",
                        expectedCommand: "no shutdown",
                        alternateCommands: ["no shut"]
                    },
                    {
                        type: "concept-card",
                        content: {
                            title: "🎉 Congratulations!",
                            text: "You just configured a complete interface with an IP address!",
                            image: "celebration"
                        }
                    }
                ]
            }
        ]
    }
];

// Get lesson by ID
export const getLessonById = (lessonId) => {
    for (const unit of curriculum) {
        const lesson = unit.lessons.find(l => l.id === lessonId);
        if (lesson) return { lesson, unit };
    }
    return null;
};

// Get next lesson
export const getNextLesson = (currentLessonId) => {
    let foundCurrent = false;
    for (const unit of curriculum) {
        for (const lesson of unit.lessons) {
            if (foundCurrent) return { lesson, unit };
            if (lesson.id === currentLessonId) foundCurrent = true;
        }
    }
    return null;
};

// Calculate total XP available
export const getTotalXP = () => {
    return curriculum.reduce((total, unit) =>
        total + unit.lessons.reduce((lessonTotal, lesson) =>
            lessonTotal + lesson.xpReward, 0), 0);
};
