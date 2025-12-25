const ComingSoon = ({ feature, icon, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <div
                className="w-full max-w-sm rounded-3xl p-6 text-center"
                style={{ backgroundColor: '#161b22', border: '3px solid #30363d' }}
            >
                <div
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-4"
                    style={{ backgroundColor: '#21262d' }}
                >
                    {icon}
                </div>
                <h2 className="text-2xl font-black mb-2" style={{ color: '#c9d1d9' }}>{feature}</h2>
                <p className="text-4xl font-black mb-2" style={{ color: '#ffc800' }}>Coming Soon!</p>
                <p className="text-sm mb-6" style={{ color: '#8b949e' }}>
                    We're working hard to bring this feature to you. Stay tuned!
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl font-bold text-sm"
                    style={{ backgroundColor: '#58cc02', color: 'white', boxShadow: '0 4px 0 #46a302' }}
                >
                    Got it!
                </button>
            </div>
        </div>
    );
};

export default ComingSoon;
