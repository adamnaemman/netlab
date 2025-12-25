import { useLab } from '../context/LabContext';

const NetworkTopology = () => {
    const { state, switchDevice, currentStep } = useLab();

    // Check if interfaces are configured
    const isRouterConfigured = () => {
        const router = state.devices.router;
        const g0 = router.interfaces['GigabitEthernet0/0'];
        return g0?.ip && g0?.enabled;
    };

    const isSwitchConfigured = () => {
        const sw = state.devices.switch;
        const vlan1 = sw.interfaces['Vlan1'];
        return vlan1?.ip && vlan1?.enabled;
    };

    const hasVlans = () => {
        const sw = state.devices.switch;
        return Object.keys(sw.vlans || {}).length > 0;
    };

    const getDeviceColor = (deviceType) => {
        const isActive = state.currentDevice === deviceType;
        if (isActive) return '#58a6ff';

        if (deviceType === 'router') {
            return isRouterConfigured() ? '#3fb950' : '#484f58';
        }
        if (deviceType === 'switch') {
            return (isSwitchConfigured() || hasVlans()) ? '#3fb950' : '#484f58';
        }
        return '#484f58';
    };

    const getLinkColor = () => {
        return isRouterConfigured() ? '#3fb950' : '#30363d';
    };

    // Check if this device is needed for current step
    const isDeviceNeeded = (device) => {
        return currentStep?.device === device;
    };

    return (
        <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
        >
            <h3 className="font-semibold mb-4" style={{ color: '#c9d1d9' }}>
                Network Topology
            </h3>

            <svg
                viewBox="0 0 400 280"
                className="w-full h-auto"
                style={{ maxHeight: '280px' }}
            >
                {/* Connection Lines */}
                {/* Router to Switch */}
                <line
                    x1="200" y1="70"
                    x2="200" y2="130"
                    stroke={getLinkColor()}
                    strokeWidth="3"
                    style={{ transition: 'stroke 0.5s' }}
                />

                {/* Switch to PC1 */}
                <line
                    x1="160" y1="170"
                    x2="80" y2="230"
                    stroke="#30363d"
                    strokeWidth="3"
                />

                {/* Switch to PC2 */}
                <line
                    x1="240" y1="170"
                    x2="320" y2="230"
                    stroke="#30363d"
                    strokeWidth="3"
                />

                {/* Router */}
                <g
                    className="topology-node cursor-pointer"
                    onClick={() => switchDevice('router')}
                    transform="translate(200, 45)"
                >
                    {/* Glow effect for needed device */}
                    {isDeviceNeeded('router') && (
                        <rect
                            x="-48" y="-28"
                            width="96" height="56"
                            rx="12"
                            fill="none"
                            stroke="#58a6ff"
                            strokeWidth="2"
                            opacity="0.5"
                            style={{ animation: 'pulse-border 2s infinite' }}
                        />
                    )}
                    <rect
                        x="-44" y="-24"
                        width="88" height="48"
                        rx="10"
                        fill={getDeviceColor('router')}
                        style={{ transition: 'fill 0.3s' }}
                    />
                    <text
                        x="0" y="5"
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                    >
                        {state.devices.router.hostname}
                    </text>
                    <text
                        x="0" y="-32"
                        textAnchor="middle"
                        fill={state.currentDevice === 'router' ? '#58a6ff' : '#8b949e'}
                        fontSize="10"
                    >
                        ROUTER
                    </text>
                    {/* Status indicator */}
                    {isRouterConfigured() && (
                        <circle cx="40" cy="-10" r="6" fill="#3fb950" />
                    )}
                </g>

                {/* Switch */}
                <g
                    className="topology-node cursor-pointer"
                    onClick={() => switchDevice('switch')}
                    transform="translate(200, 150)"
                >
                    {isDeviceNeeded('switch') && (
                        <rect
                            x="-58" y="-23"
                            width="116" height="46"
                            rx="8"
                            fill="none"
                            stroke="#58a6ff"
                            strokeWidth="2"
                            opacity="0.5"
                            style={{ animation: 'pulse-border 2s infinite' }}
                        />
                    )}
                    <rect
                        x="-54" y="-19"
                        width="108" height="38"
                        rx="6"
                        fill={getDeviceColor('switch')}
                        style={{ transition: 'fill 0.3s' }}
                    />
                    <text
                        x="0" y="5"
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                    >
                        {state.devices.switch.hostname}
                    </text>
                    <text
                        x="0" y="-27"
                        textAnchor="middle"
                        fill={state.currentDevice === 'switch' ? '#58a6ff' : '#8b949e'}
                        fontSize="10"
                    >
                        SWITCH
                    </text>
                    {/* Port indicators */}
                    {[-36, -18, 0, 18, 36].map((x, i) => (
                        <rect
                            key={i}
                            x={x - 6}
                            y="11"
                            width="10"
                            height="5"
                            rx="1"
                            fill="#0d1117"
                        />
                    ))}
                </g>

                {/* PC1 */}
                <g transform="translate(80, 250)">
                    <rect
                        x="-28" y="-18"
                        width="56" height="36"
                        rx="4"
                        fill="#484f58"
                    />
                    <text
                        x="0" y="3"
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                    >
                        PC1
                    </text>
                    <text
                        x="0" y="28"
                        textAnchor="middle"
                        fill="#8b949e"
                        fontSize="8"
                    >
                        VLAN 10
                    </text>
                </g>

                {/* PC2 */}
                <g transform="translate(320, 250)">
                    <rect
                        x="-28" y="-18"
                        width="56" height="36"
                        rx="4"
                        fill="#484f58"
                    />
                    <text
                        x="0" y="3"
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                    >
                        PC2
                    </text>
                    <text
                        x="0" y="28"
                        textAnchor="middle"
                        fill="#8b949e"
                        fontSize="8"
                    >
                        VLAN 20
                    </text>
                </g>

                {/* Legend */}
                <g transform="translate(10, 268)">
                    <circle cx="5" cy="0" r="4" fill="#3fb950" />
                    <text x="15" y="4" fill="#8b949e" fontSize="8">Configured</text>
                    <circle cx="85" cy="0" r="4" fill="#484f58" />
                    <text x="95" y="4" fill="#8b949e" fontSize="8">Not configured</text>
                    <circle cx="175" cy="0" r="4" fill="#58a6ff" />
                    <text x="185" y="4" fill="#8b949e" fontSize="8">Active</text>
                </g>
            </svg>

            {/* Quick Info */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: '#0d1117' }}
                >
                    <span style={{ color: '#8b949e' }}>Router IP: </span>
                    <span className="font-mono" style={{ color: '#c9d1d9' }}>
                        {state.devices.router.interfaces['GigabitEthernet0/0']?.ip || 'Not set'}
                    </span>
                </div>
                <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: '#0d1117' }}
                >
                    <span style={{ color: '#8b949e' }}>Switch: </span>
                    <span className="font-mono" style={{ color: '#c9d1d9' }}>
                        {Object.keys(state.devices.switch.vlans || {}).length} VLANs
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NetworkTopology;
