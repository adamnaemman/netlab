import { useState } from 'react';
import LabActivity from './LabActivity';
import ENSALabActivity from './ENSALabActivity';

const PracticePage = ({ onClose }) => {
    const [expandedDevice, setExpandedDevice] = useState(null);
    const [expandedLab, setExpandedLab] = useState(null);
    const [copiedDevice, setCopiedDevice] = useState(null);
    const [showLab, setShowLab] = useState(false);
    const [showENSALab, setShowENSALab] = useState(false);

    const copyToClipboard = (text, deviceId) => {
        navigator.clipboard.writeText(text);
        setCopiedDevice(deviceId);
        setTimeout(() => setCopiedDevice(null), 2000);
    };

    const devices = [];

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0d1117' }}>
            {/* Header */}
            <div
                className="sticky top-0 z-10 p-4 flex items-center justify-between"
                style={{ backgroundColor: '#161b22', borderBottom: '3px solid #30363d' }}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all active:scale-95"
                        style={{ backgroundColor: '#0d1117', color: '#8b949e' }}
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-xl font-black" style={{ color: '#c9d1d9' }}>
                            ⌨️ Practice Mode
                        </h1>
                        <p className="text-xs" style={{ color: '#8b949e' }}>
                            SRWE v7.00 Final PT Skills Assessment
                        </p>
                    </div>
                </div>
                <div
                    className="px-3 py-1 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: '#238636', color: 'white' }}
                >
                    FULL CONFIG
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {[
                        {
                            id: 'lab1',
                            title: 'Lab Activity 1',
                            subtitle: 'ENSA - OSPFv2 & NAT',
                            description: 'Configure R1, R2, S1, S2 with OSPFv2 routing, NAT with PAT, and basic device settings!',
                            icon: '🔄',
                            color: '#1cb0f6',
                            shadow: '#0a7ab8',
                            action: () => setShowENSALab(true),
                            devices: [
                                {
                                    id: 'ensa_r1',
                                    name: 'Router R1',
                                    config: `enable
configure terminal
no ip domain-lookup
hostname R1
service password-encryption
enable secret class
banner motd #Unauthorized access is strictly prohibited.#
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 4
 password cisco
 login
 transport input telnet
 exit
interface g0/0/0
 ip address 10.67.254.2 255.255.255.252
 no shutdown
exit
interface g0/0/1
 ip address 192.168.1.1 255.255.255.0
 no shutdown
exit
interface loopback 0
 ip address 10.52.0.1 255.255.255.248
exit
router ospf 1
 router-id 1.1.1.1
 network 10.67.254.0 0.0.0.3 area 0
 network 192.168.1.0 0.0.0.255 area 0
 network 10.52.0.0 0.0.0.7 area 0
 passive-interface g0/0/1
end`
                                },
                                {
                                    id: 'ensa_r2',
                                    name: 'Router R2',
                                    config: `enable
configure terminal
no ip domain-lookup
hostname R2
service password-encryption
enable secret class
banner motd #Unauthorized access is strictly prohibited.#
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 4
 password cisco
 login
 transport input telnet
 exit
interface g0/0/0
 ip address 10.67.254.1 255.255.255.252
 no shutdown
exit
interface g0/0/1
 ip address 10.67.1.1 255.255.255.0
 no shutdown
exit
interface loopback 0
 ip address 209.165.201.1 255.255.255.224
exit
router ospf 1
 router-id 2.2.2.2
 network 10.67.254.0 0.0.0.3 area 0
 network 10.67.1.0 0.0.0.255 area 0
 passive-interface g0/0/1
 default-information originate
exit
ip route 0.0.0.0 0.0.0.0 loopback 0
access-list 1 permit 192.168.1.0 0.0.0.255
access-list 1 permit 10.67.1.0 0.0.0.255
ip nat inside source list 1 interface loopback 0 overload
interface g0/0/0
 ip nat inside
interface g0/0/1
 ip nat inside
interface loopback 0
 ip nat outside
end`
                                },
                                {
                                    id: 'ensa_s1',
                                    name: 'Switch S1',
                                    config: `enable
configure terminal
no ip domain-lookup
hostname S1
service password-encryption
enable secret class
banner motd #Unauthorized access is strictly prohibited.#
vlan 99
 name Management
exit
interface vlan 99
 ip address 192.168.1.2 255.255.255.0
 no shutdown
exit
ip default-gateway 192.168.1.1
interface f0/6
 switchport mode access
 switchport access vlan 99
 exit
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 15
 password cisco
 login
 transport input telnet
end`
                                },
                                {
                                    id: 'ensa_s2',
                                    name: 'Switch S2',
                                    config: `enable
configure terminal
no ip domain-lookup
hostname S2
service password-encryption
enable secret class
banner motd #Unauthorized access is strictly prohibited.#
interface vlan 1
 ip address 10.67.1.2 255.255.255.0
 no shutdown
exit
ip default-gateway 10.67.1.1
line console 0
 password cisco
 login
 logging synchronous
 exit
line vty 0 15
 password cisco
 login
 transport input telnet
end`
                                }
                            ]
                        },
                        {
                            id: 'lab2',
                            title: 'Lab Activity 2',
                            subtitle: 'SRWE - Inter-VLAN & Security',
                            description: 'Practice step-by-step with a simulated CLI terminal. Configure R1, S1, and S2 with guided instructions and hints!',
                            icon: '🧪',
                            color: '#58cc02',
                            shadow: '#3d8c02',
                            action: () => setShowLab(true),
                            devices: [
                                {
                                    id: 'r1',
                                    name: 'Router R1',
                                    config: `enable
configure terminal
no ip domain-lookup
hostname R1
banner motd #Unauthorized Access is Prohibited!#
enable secret ciscoenpass
service password-encryption
security passwords min-length 10
line console 0
 password ciscoconpass
 login
 exit
username admin secret admin1pass
ip domain-name ccna-ptsa.com
crypto key generate rsa
 1024

ip ssh version 2
line vty 0 15
 login local
 transport input ssh
 exit
ipv6 unicast-routing
interface Loopback0
 ip address 209.165.201.1 255.255.255.224
 ipv6 address 2001:db8:acad:209::1/64
exit
interface g0/0/1.2
 encapsulation dot1Q 2
 ip address 10.19.8.1 255.255.255.192
 ipv6 address 2001:db8:acad:a::1/64
exit
interface g0/0/1.3
 encapsulation dot1Q 3
 ip address 10.19.8.65 255.255.255.224
 ipv6 address 2001:db8:acad:b::1/64
exit
interface g0/0/1.4
 encapsulation dot1Q 4
 ip address 10.19.8.97 255.255.255.248
exit
interface g0/0/1.6
 encapsulation dot1Q 6 native
exit
interface g0/0/1
 no shutdown
exit
ip dhcp excluded-address 10.19.8.1 10.19.8.52
ip dhcp pool CCNA-A
 network 10.19.8.0 255.255.255.192
 default-router 10.19.8.1
exit
ip dhcp excluded-address 10.19.8.65 10.19.8.84
ip dhcp pool CCNA-B
 network 10.19.8.64 255.255.255.224
 default-router 10.19.8.65
exit
end`
                                },
                                {
                                    id: 's1',
                                    name: 'Switch S1',
                                    config: `enable
configure terminal
no ip domain-lookup
hostname S1
banner motd #Unauthorized Access is Prohibited!#
enable secret ciscoenpass
service password-encryption
line console 0
 password ciscoconpass
 login
 exit
username admin secret admin1pass
ip domain-name ccna-ptsa.com
crypto key generate rsa
 1024
ip ssh version 2
line vty 0 15
 login local
 transport input ssh
 exit
vlan 2
 name Bikes
vlan 3
 name Trikes
vlan 4
 name Management
vlan 5
 name Parking
vlan 6
 name Native
interface vlan 4
 ip address 10.19.8.98 255.255.255.248
 no shutdown
exit
ip default-gateway 10.19.8.97
interface range f0/1-2
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
 channel-group 1 mode active
exit
interface port-channel 1
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
exit
interface f0/5
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
exit
interface f0/6
 switchport mode access
 switchport access vlan 2
 switchport port-security
 switchport port-security maximum 3
exit
interface range f0/3-4,f0/7-24,g0/1-2
 switchport mode access
 switchport access vlan 5
 shutdown
exit
end`
                                },
                                {
                                    id: 's2',
                                    name: 'Switch S2',
                                    config: `enable
configure terminal
no ip domain-lookup
hostname S2
banner motd #Unauthorized Access is Prohibited!#
enable secret ciscoenpass
service password-encryption
line console 0
 password ciscoconpass
 login
 exit
username admin secret admin1pass
ip domain-name ccna-ptsa.com
crypto key generate rsa
 1024
ip ssh version 2
line vty 0 15
 login local
 transport input ssh
 exit
vlan 2
 name Bikes
vlan 3
 name Trikes
vlan 4
 name Management
vlan 5
 name Parking
vlan 6
 name Native
interface vlan 4
 ip address 10.19.8.99 255.255.255.248
 no shutdown
exit
ip default-gateway 10.19.8.97
interface range f0/1-2
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
 channel-group 1 mode active
exit
interface port-channel 1
 switchport mode trunk
 switchport trunk native vlan 6
 switchport trunk allowed vlan 2,3,4,5,6
exit
interface f0/18
 switchport mode access
 switchport access vlan 3
 switchport port-security
 switchport port-security maximum 3
exit
interface range f0/3-17,f0/19-24,g0/1-2
 switchport mode access
 switchport access vlan 5
 shutdown
exit
end`
                                }
                            ]
                        }
                    ].map(lab => (
                        <div
                            key={lab.id}
                            className="rounded-3xl overflow-hidden transition-all duration-300"
                            style={{
                                backgroundColor: '#161b22',
                                border: `3px solid ${expandedLab === lab.id ? lab.color : '#30363d'}`,
                                boxShadow: expandedLab === lab.id ? `0 10px 30px ${lab.color}22` : 'none'
                            }}
                        >
                            {/* Card Header (Main Action) */}
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 animate-pulse-slow"
                                        style={{
                                            background: `linear-gradient(135deg, ${lab.color} 0%, ${lab.shadow} 100%)`,
                                            boxShadow: `0 8px 20px ${lab.color}44`
                                        }}
                                    >
                                        {lab.icon}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                            <h2 className="font-black text-2xl text-white">{lab.title}</h2>
                                            <span
                                                className="px-2 py-0.5 rounded text-[10px] font-bold self-center md:self-auto"
                                                style={{ backgroundColor: `${lab.color}33`, color: lab.color, border: `1px solid ${lab.color}55` }}
                                            >
                                                {lab.subtitle}
                                            </span>
                                        </div>
                                        <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                                            {lab.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={lab.action}
                                        className="px-8 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                                        style={{
                                            backgroundColor: lab.color,
                                            color: '#000',
                                            boxShadow: `0 6px 0 ${lab.shadow}`
                                        }}
                                    >
                                        START LAB →
                                    </button>
                                </div>

                                {/* Answers Dropdown Toggle */}
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
                                        className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all hover:bg-white/5"
                                        style={{ color: lab.color, border: `1px solid ${lab.color}44` }}
                                    >
                                        <span>{expandedLab === lab.id ? 'CLOSE ANSWER KEY' : 'VIEW ANSWER KEY'}</span>
                                        <span className={`transition-transform duration-300 ${expandedLab === lab.id ? 'rotate-180' : ''}`}>▼</span>
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Answer Content */}
                            {expandedLab === lab.id && (
                                <div className="p-6 pt-0 space-y-4 animate-slide-down">
                                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {lab.devices.map(device => (
                                            <div
                                                key={device.id}
                                                className="rounded-2xl overflow-hidden transition-all border border-white/5"
                                                style={{ backgroundColor: '#0d1117' }}
                                            >
                                                <button
                                                    onClick={() => setExpandedDevice(expandedDevice === device.id ? null : device.id)}
                                                    className="w-full p-4 flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: lab.color }} />
                                                        <span className="font-bold text-sm text-white/90 group-hover:text-white transition-colors">
                                                            {device.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                                        {expandedDevice === device.id ? 'Hide' : 'Reveal'}
                                                    </span>
                                                </button>

                                                {expandedDevice === device.id && (
                                                    <div className="px-4 pb-4 animate-fade-in">
                                                        <div className="relative rounded-xl overflow-hidden group/code">
                                                            <button
                                                                onClick={() => copyToClipboard(device.config, device.id)}
                                                                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg text-[10px] font-black z-10 opacity-0 group-hover/code:opacity-100 transition-opacity"
                                                                style={{
                                                                    backgroundColor: copiedDevice === device.id ? '#238636' : lab.color,
                                                                    color: '#000'
                                                                }}
                                                            >
                                                                {copiedDevice === device.id ? '✓ COPIED' : '📋 COPY CONFIG'}
                                                            </button>
                                                            <pre className="text-[11px] font-mono p-4 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10" style={{ backgroundColor: '#000', color: '#7ee787' }}>
                                                                {device.config}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Tips Section */}
                    <div
                        className="p-6 rounded-3xl"
                        style={{ backgroundColor: '#161b22', border: '3px solid #ffc800' }}
                    >
                        <h3 className="font-black text-xl mb-4 flex items-center gap-2" style={{ color: '#ffc800' }}>
                            <span>💡</span> Tips for Packet Tracer
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                'Click on a device, go to CLI tab, and paste the configuration',
                                'For RSA key generation, wait for the prompt and enter "1024"',
                                'Don\'t forget to save the configuration with "copy run start"',
                                'Use "show running-config" to verify your configuration'
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                                    <span style={{ color: '#58cc02' }}>✓</span>
                                    <span className="text-sm text-white/80">{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lab Activity Modal */}
            {showLab && (
                <LabActivity
                    onClose={() => setShowLab(false)}
                    onComplete={() => {
                        setShowLab(false);
                    }}
                />
            )}

            {/* ENSA Lab Activity Modal */}
            {showENSALab && (
                <ENSALabActivity
                    onClose={() => setShowENSALab(false)}
                    onComplete={() => {
                        setShowENSALab(false);
                    }}
                />
            )}
        </div>
    );
};

export default PracticePage;
