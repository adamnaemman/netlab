// Command explanations for flashcards - helps users understand what each command does and why

export const commandExplanations = {
    // Mode commands
    'enable': {
        title: '🔓 Enable - Privileged Mode',
        what: 'Masuk ke Privileged EXEC mode (admin mode)',
        why: 'Diperlukan untuk akses configuration commands dan privileged commands seperti show running-config',
        syntax: 'enable',
        tip: 'Prompt akan tukar dari ">" ke "#"'
    },
    'configure terminal': {
        title: '⚙️ Configure Terminal',
        what: 'Masuk ke Global Configuration mode',
        why: 'Untuk buat perubahan pada config device seperti hostname, interface, routing, etc.',
        syntax: 'configure terminal / conf t',
        tip: 'Prompt akan tukar ke "(config)#"'
    },
    'exit': {
        title: '🚪 Exit',
        what: 'Keluar dari current configuration mode',
        why: 'Untuk kembali ke level sebelumnya dalam hierarchy config',
        syntax: 'exit',
        tip: 'Guna "end" kalau nak terus balik ke privileged mode'
    },
    'end': {
        title: '⏹️ End',
        what: 'Keluar terus ke Privileged EXEC mode',
        why: 'Shortcut untuk keluar dari mana-mana config mode terus ke "#" prompt',
        syntax: 'end',
        tip: 'Sama dengan tekan Ctrl+Z'
    },

    // Basic config
    'no ip domain-lookup': {
        title: '🚫 Disable DNS Lookup',
        what: 'Disable automatic DNS name resolution',
        why: 'Elakkan router/switch cuba resolve typos sebagai hostname (lambat dan annoying)',
        syntax: 'no ip domain-lookup',
        tip: 'Penting untuk lab supaya tak delay bila typo'
    },
    'hostname': {
        title: '🏷️ Hostname',
        what: 'Set nama device',
        why: 'Identify device dalam network, papar dalam prompt',
        syntax: 'hostname <name>',
        tip: 'Nama akan terus papar dalam prompt'
    },
    'banner motd': {
        title: '📢 Banner MOTD',
        what: 'Set Message of the Day banner',
        why: 'Papar warning message kepada sesiapa yang login - legal requirement',
        syntax: 'banner motd #message#',
        tip: 'Guna delimiter character (contoh: #) di awal dan akhir message'
    },
    'enable secret': {
        title: '🔐 Enable Secret',
        what: 'Set encrypted password untuk privileged mode',
        why: 'Secure access ke admin mode dengan strong encryption (MD5)',
        syntax: 'enable secret <password>',
        tip: 'Lebih secure dari "enable password" - guna secret selalu'
    },
    'service password-encryption': {
        title: '🔒 Service Password Encryption',
        what: 'Encrypt semua password dalam running-config',
        why: 'Protect password dari shoulder surfing bila view config',
        syntax: 'service password-encryption',
        tip: 'Type 7 encryption - weak tapi better than nothing'
    },
    'security passwords min-length': {
        title: '📏 Minimum Password Length',
        what: 'Set minimum panjang password',
        why: 'Security best practice - password pendek senang di-crack',
        syntax: 'security passwords min-length <length>',
        tip: 'CCNA requirement biasanya 10 characters'
    },

    // Console & VTY
    'line console 0': {
        title: '🖥️ Line Console',
        what: 'Masuk config untuk console port (physical connection)',
        why: 'Configure security untuk physical console access',
        syntax: 'line console 0',
        tip: 'Console port = direct cable connection ke device'
    },
    'line vty 0 15': {
        title: '🌐 Line VTY',
        what: 'Masuk config untuk Virtual Terminal lines (remote access)',
        why: 'Configure security untuk SSH/Telnet connections',
        syntax: 'line vty 0 15',
        tip: 'VTY 0-15 = 16 concurrent remote sessions'
    },
    'password': {
        title: '🔑 Password',
        what: 'Set password untuk line',
        why: 'Require password sebelum boleh access console/vty',
        syntax: 'password <password>',
        tip: 'Kena enable "login" command juga'
    },
    'login': {
        title: '✅ Login',
        what: 'Enable password checking pada line',
        why: 'Aktifkan password requirement untuk line tu',
        syntax: 'login',
        tip: 'Tanpa ni, password tak akan diminta'
    },
    'login local': {
        title: '👤 Login Local',
        what: 'Guna local username database untuk authentication',
        why: 'Memerlukan username + password (lebih secure dari password je)',
        syntax: 'login local',
        tip: 'Kena ada "username" command dulu'
    },
    'transport input ssh': {
        title: '🔒 Transport Input SSH',
        what: 'Hanya allow SSH untuk remote access',
        why: 'Block Telnet yang insecure - SSH encrypted',
        syntax: 'transport input ssh',
        tip: 'Security best practice - never use telnet'
    },

    // SSH Setup
    'username': {
        title: '👤 Username',
        what: 'Create local user account',
        why: 'Required untuk SSH authentication dengan "login local"',
        syntax: 'username <name> secret <password>',
        tip: 'Guna "secret" instead of "password" untuk encryption'
    },
    'ip domain-name': {
        title: '🌍 IP Domain Name',
        what: 'Set domain name untuk device',
        why: 'Required untuk generate RSA keys (part of key name)',
        syntax: 'ip domain-name <domain>',
        tip: 'Contoh: ccna-ptsa.com'
    },
    'crypto key generate rsa': {
        title: '🔐 Generate RSA Keys',
        what: 'Generate RSA key pair untuk SSH',
        why: 'SSH memerlukan cryptographic keys untuk secure connection',
        syntax: 'crypto key generate rsa',
        tip: 'Guna 1024 atau 2048 bits untuk key size'
    },
    'ip ssh version 2': {
        title: '🔒 SSH Version 2',
        what: 'Force SSH version 2',
        why: 'SSHv2 lebih secure dari SSHv1 - always use v2',
        syntax: 'ip ssh version 2',
        tip: 'SSHv1 ada known vulnerabilities'
    },

    // IPv6
    'ipv6 unicast-routing': {
        title: '🌐 IPv6 Unicast Routing',
        what: 'Enable IPv6 routing pada router',
        why: 'By default router tak forward IPv6 packets - kena enable',
        syntax: 'ipv6 unicast-routing',
        tip: 'Wajib untuk inter-VLAN routing dengan IPv6'
    },

    // Interfaces
    'interface': {
        title: '🔌 Interface',
        what: 'Masuk ke interface configuration mode',
        why: 'Configure specific port/interface settings',
        syntax: 'interface <type><number>',
        tip: 'Contoh: int g0/0/1, int f0/1, int vlan 4'
    },
    'interface loopback': {
        title: '🔄 Loopback Interface',
        what: 'Create virtual loopback interface',
        why: 'Virtual interface yang sentiasa UP - untuk testing dan routing ID',
        syntax: 'interface Loopback<number>',
        tip: 'Loopback tak pernah down selagi router running'
    },
    'interface range': {
        title: '📦 Interface Range',
        what: 'Select multiple interfaces sekaligus',
        why: 'Apply same config ke banyak ports sekali gus - save time',
        syntax: 'interface range <type><start>-<end>',
        tip: 'Contoh: int range f0/1-24'
    },
    'ip address': {
        title: '📍 IP Address',
        what: 'Assign IPv4 address ke interface',
        why: 'Interface perlukan IP untuk Layer 3 communication',
        syntax: 'ip address <ip> <subnet-mask>',
        tip: 'Jangan lupa "no shutdown" untuk enable'
    },
    'ipv6 address': {
        title: '📍 IPv6 Address',
        what: 'Assign IPv6 address ke interface',
        why: 'Interface perlukan IPv6 untuk dual-stack network',
        syntax: 'ipv6 address <ipv6>/prefix',
        tip: 'Contoh: 2001:db8:acad:a::1/64'
    },
    'no shutdown': {
        title: '🟢 No Shutdown',
        what: 'Enable/activate interface',
        why: 'By default interfaces administratively down - kena enable',
        syntax: 'no shutdown',
        tip: 'Check status dengan "show ip interface brief"'
    },
    'shutdown': {
        title: '🔴 Shutdown',
        what: 'Disable/deactivate interface',
        why: 'Best practice: shutdown unused ports untuk security',
        syntax: 'shutdown',
        tip: 'Prevents unauthorized access melalui unused ports'
    },

    // Subinterfaces
    'encapsulation dot1q': {
        title: '🏷️ Encapsulation dot1Q',
        what: 'Set 802.1Q VLAN tagging pada subinterface',
        why: 'Subinterface handle traffic untuk specific VLAN (Router-on-a-Stick)',
        syntax: 'encapsulation dot1Q <vlan-id> [native]',
        tip: 'Guna "native" untuk native VLAN'
    },

    // VLANs
    'vlan': {
        title: '🎨 VLAN',
        what: 'Create VLAN atau masuk VLAN config',
        why: 'Segment network ke different broadcast domains',
        syntax: 'vlan <id>',
        tip: 'VLAN 1 = default, VLAN 1002-1005 = reserved'
    },
    'name': {
        title: '📛 VLAN Name',
        what: 'Bagi nama descriptive kepada VLAN',
        why: 'Identify purpose VLAN - documentation',
        syntax: 'name <vlan-name>',
        tip: 'Contoh: Bikes, Trikes, Management, Parking'
    },

    // Trunk & Access
    'switchport mode trunk': {
        title: '🔗 Switchport Mode Trunk',
        what: 'Set port sebagai trunk port',
        why: 'Trunk carries traffic untuk multiple VLANs dengan tagging',
        syntax: 'switchport mode trunk',
        tip: 'Guna untuk switch-to-switch atau switch-to-router'
    },
    'switchport mode access': {
        title: '💻 Switchport Mode Access',
        what: 'Set port sebagai access port',
        why: 'Access port belongs to single VLAN - untuk end devices',
        syntax: 'switchport mode access',
        tip: 'PC, printer, phone connect ke access ports'
    },
    'switchport trunk native vlan': {
        title: '🏷️ Native VLAN',
        what: 'Set native VLAN untuk trunk',
        why: 'Untagged traffic on trunk assigned ke native VLAN',
        syntax: 'switchport trunk native vlan <id>',
        tip: 'Best practice: guna VLAN lain selain VLAN 1'
    },
    'switchport trunk allowed vlan': {
        title: '✅ Allowed VLANs',
        what: 'Specify which VLANs allowed on trunk',
        why: 'Security - limit VLANs yang boleh traverse trunk',
        syntax: 'switchport trunk allowed vlan <list>',
        tip: 'Contoh: 2,3,4,5,6'
    },
    'switchport access vlan': {
        title: '🎯 Access VLAN',
        what: 'Assign port ke specific VLAN',
        why: 'Determine which VLAN port belongs to',
        syntax: 'switchport access vlan <id>',
        tip: 'Device connected ke port ni masuk VLAN tu'
    },

    // Port Security
    'switchport port-security': {
        title: '🛡️ Port Security',
        what: 'Enable port security pada interface',
        why: 'Limit dan identify MAC addresses yang boleh connect',
        syntax: 'switchport port-security',
        tip: 'Kena "switchport mode access" dulu'
    },
    'switchport port-security maximum': {
        title: '🔢 Port Security Maximum',
        what: 'Set maximum MAC addresses allowed',
        why: 'Limit berapa devices boleh connect ke port',
        syntax: 'switchport port-security maximum <number>',
        tip: 'Default = 1'
    },

    // EtherChannel
    'channel-group': {
        title: '⚡ Channel Group',
        what: 'Add interface ke EtherChannel bundle',
        why: 'Combine multiple links untuk increased bandwidth dan redundancy',
        syntax: 'channel-group <number> mode active',
        tip: 'Active = use LACP protocol'
    },
    'interface port-channel': {
        title: '🔗 Port Channel',
        what: 'Configure virtual EtherChannel interface',
        why: 'Apply settings to entire EtherChannel bundle',
        syntax: 'interface port-channel <number>',
        tip: 'Settings apply to all member interfaces'
    },

    // SVI & Gateway
    'interface vlan': {
        title: '🌐 SVI (Switch Virtual Interface)',
        what: 'Create Layer 3 interface untuk VLAN',
        why: 'Allow switch punya IP address untuk management',
        syntax: 'interface vlan <id>',
        tip: 'Biasa guna untuk Management VLAN'
    },
    'ip default-gateway': {
        title: '🚪 Default Gateway',
        what: 'Set default gateway untuk switch',
        why: 'Switch perlu gateway untuk remote management dari subnet lain',
        syntax: 'ip default-gateway <ip>',
        tip: 'Point to router interface in Management VLAN'
    },

    // DHCP
    'ip dhcp excluded-address': {
        title: '🚫 DHCP Excluded Address',
        what: 'Exclude addresses dari DHCP pool',
        why: 'Reserve IP untuk devices yang perlu static IP (router, servers)',
        syntax: 'ip dhcp excluded-address <start> <end>',
        tip: 'Always exclude gateway address'
    },
    'ip dhcp pool': {
        title: '📦 DHCP Pool',
        what: 'Create DHCP address pool',
        why: 'Automatic IP assignment untuk clients dalam pool',
        syntax: 'ip dhcp pool <name>',
        tip: 'Masuk DHCP config mode'
    },
    'network': {
        title: '🌐 DHCP Network',
        what: 'Define network range untuk DHCP pool',
        why: 'Specify which subnet DHCP pool serve',
        syntax: 'network <network> <mask>',
        tip: 'Should match subinterface subnet'
    },
    'default-router': {
        title: '🚪 Default Router',
        what: 'Set default gateway untuk DHCP clients',
        why: 'Clients perlu gateway untuk access network lain',
        syntax: 'default-router <gateway-ip>',
        tip: 'Usually router subinterface IP'
    },

    // OSPFv2
    'router ospf': {
        title: '🦅 OSPFv2 Routing',
        what: 'Enable OSPF routing process',
        why: 'Dynamic routing protocol untuk routers bertukar maklumat network secara automatik',
        syntax: 'router ospf <process-id>',
        tip: 'Process ID tak semestinya sama di semua router'
    },
    'router-id': {
        title: '🆔 OSPF Router ID',
        what: 'Set unique identifier untuk OSPF router',
        why: 'Identify router dalam OSPF database, penting untuk election process',
        syntax: 'router-id <ip-address>',
        tip: 'Guna format IP address, contoh: 1.1.1.1'
    },
    'network': {
        title: '🌐 Network Advertisement',
        what: 'Declare network mana yang nak di-advertise masuk routing protocol',
        why: 'Supaya router lain tahu wujudnya network ni dan boleh route traffic ke sini',
        syntax: 'network <address> <wildcard-mask> area <id>',
        tip: 'OSPF guna wildcard mask (kebalikan subnet mask)'
    },
    'passive-interface': {
        title: '🔈 Passive Interface',
        what: 'Stop OSPF hello packets dari dihantar ke interface tertentu',
        why: 'Security dan efficiency - tak perlu hantar routing updates ke LAN (PC)',
        syntax: 'passive-interface <interface>',
        tip: 'Masih advertise network tu, tapi tak cari neighbor di port tu'
    },
    'default-information originate': {
        title: '📡 Default Route Originate',
        what: 'Advertise default route (0.0.0.0/0) ke dalam OSPF',
        why: 'Supaya semua router guna router ni sebagai gateway ke Internet',
        syntax: 'default-information originate',
        tip: 'Router ni mesti dah ada static default route dulu'
    },

    // Static Routing & NAT
    'ip route': {
        title: '🛣️ Static Route',
        what: 'Config manual path ke destination network',
        why: 'Bagi tahu router ke mana nak hantar traffic yang dia tak tahu secara dynamic',
        syntax: 'ip route <network> <mask> <next-hop/exit-int>',
        tip: '0.0.0.0 0.0.0.0 = Default Route (Gateway of Last Resort)'
    },
    'access-list': {
        title: '🛡️ Access Control List (ACL)',
        what: 'Create list untuk permit atau deny traffic',
        why: 'Filtering traffic untuk security atau identify traffic untuk NAT',
        syntax: 'access-list <number> <action> <source>',
        tip: 'Standard ACL guna range 1-99'
    },
    'ip nat inside source list': {
        title: '🔄 NAT with PAT (Overload)',
        what: 'Translate private IPs ke single public interface IP',
        why: 'Allow banyak internal PCs access Internet guna satu public IP je',
        syntax: 'ip nat inside source list <acl> interface <ext-int> overload',
        tip: '"overload" = PAT (Port Address Translation)'
    },
    'ip nat inside': {
        title: '📥 NAT Inside Interface',
        what: 'Mark interface sebagai part of internal network',
        why: 'Router perlu tahu traffic dari interface ni kena di-translate',
        syntax: 'ip nat inside',
        tip: 'Biasanya LAN port'
    },
    'ip nat outside': {
        title: '📤 NAT Outside Interface',
        what: 'Mark interface sebagai part of external network (Internet)',
        why: 'Router perlu tahu interface ni la tempat traffic keluar ke Internet',
        syntax: 'ip nat outside',
        tip: 'Biasanya WAN port'
    },
    'logging synchronous': {
        title: '📺 Logging Synchronous',
        what: 'Sync console messages dengan apa yang kita tengah type',
        why: 'Elakkan console logs "kacau" command yang kita tengah taip',
        syntax: 'logging synchronous',
        tip: 'Sangat berguna untuk elak distract masa config'
    },
    'transport input': {
        title: '🚦 Transport Input',
        what: 'Set protocols yang dibenarkan untuk remote access',
        why: 'Control sama ada nak guna Telnet (insecure) atau SSH (secure)',
        syntax: 'transport input <protocol/all/none>',
        tip: 'Always use "ssh" in production, use "telnet" only for labs'
    }
};

// Get explanation for a command
export const getExplanation = (command) => {
    const cmdLower = command.toLowerCase().trim();

    // Try exact match first
    if (commandExplanations[cmdLower]) {
        return commandExplanations[cmdLower];
    }

    // Try partial match for commands with parameters
    for (const key of Object.keys(commandExplanations)) {
        if (cmdLower.startsWith(key)) {
            return commandExplanations[key];
        }
    }

    // Special cases
    if (cmdLower.match(/^interface\s+(g|f|lo)/i)) {
        return commandExplanations['interface'];
    }
    if (cmdLower.match(/^interface\s+range/i)) {
        return commandExplanations['interface range'];
    }
    if (cmdLower.match(/^interface\s+vlan/i)) {
        return commandExplanations['interface vlan'];
    }
    if (cmdLower.match(/^interface\s+loopback/i)) {
        return commandExplanations['interface loopback'];
    }
    if (cmdLower.match(/^interface\s+port-channel/i)) {
        return commandExplanations['interface port-channel'];
    }
    if (cmdLower.match(/^hostname\s+/i)) {
        return commandExplanations['hostname'];
    }
    if (cmdLower.match(/^username\s+/i)) {
        return commandExplanations['username'];
    }
    if (cmdLower.match(/^vlan\s+\d+/i)) {
        return commandExplanations['vlan'];
    }
    if (cmdLower.match(/^ip\s+address\s+/i)) {
        return commandExplanations['ip address'];
    }
    if (cmdLower.match(/^ipv6\s+address\s+/i)) {
        return commandExplanations['ipv6 address'];
    }
    if (cmdLower.match(/^password\s+/i)) {
        return commandExplanations['password'];
    }
    if (cmdLower.match(/^router\s+ospf/i)) {
        return commandExplanations['router ospf'];
    }
    if (cmdLower.match(/^router-id/i)) {
        return commandExplanations['router-id'];
    }
    if (cmdLower.match(/^passive-interface/i)) {
        return commandExplanations['passive-interface'];
    }
    if (cmdLower.match(/^ip\s+route/i)) {
        return commandExplanations['ip route'];
    }
    if (cmdLower.match(/^access-list/i)) {
        return commandExplanations['access-list'];
    }
    if (cmdLower.match(/^ip\s+nat\s+inside\s+source/i)) {
        return commandExplanations['ip nat inside source list'];
    }
    if (cmdLower.match(/^ip\s+nat\s+inside/i)) {
        return commandExplanations['ip nat inside'];
    }
    if (cmdLower.match(/^ip\s+nat\s+outside/i)) {
        return commandExplanations['ip nat outside'];
    }
    if (cmdLower.match(/^logging\s+synchronous/i)) {
        return commandExplanations['logging synchronous'];
    }
    if (cmdLower.match(/^transport\s+input/i)) {
        return commandExplanations['transport input'];
    }
    if (cmdLower.match(/^channel-group\s+/i)) {
        return commandExplanations['channel-group'];
    }

    // Default explanation
    return {
        title: '📝 Command',
        what: command,
        why: 'Configuration command',
        syntax: command,
        tip: 'Follow the hint below'
    };
};
