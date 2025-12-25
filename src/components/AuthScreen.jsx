import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
    const { signIn, signUp, continueAsGuest } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) {
                    // Handle specific error cases
                    if (error.message.toLowerCase().includes('email not confirmed')) {
                        throw new Error('Please check your email and click the confirmation link before logging in.');
                    }
                    throw error;
                }
            } else {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setSuccess('✅ Account created! Check your email (and spam folder) to confirm before logging in.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4"
            style={{ backgroundColor: '#0d1117' }}
        >
            {/* Logo & Branding */}
            <div className="text-center mb-4 sm:mb-8">
                <div
                    className="w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-2 sm:mb-4"
                    style={{ backgroundColor: '#58cc02', boxShadow: '0 4px 0 #46a302' }}
                >
                    🌐
                </div>
                <h1 className="text-2xl sm:text-4xl font-black" style={{ color: '#58cc02' }}>NetLab</h1>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2" style={{ color: '#8b949e' }}>
                    Learn Cisco networking the fun way!
                </p>
            </div>

            {/* Auth Card */}
            <div
                className="w-full max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-6"
                style={{ backgroundColor: '#161b22', border: '2px solid #30363d' }}
            >
                {/* Tabs */}
                <div className="flex gap-2 mb-4 sm:mb-6">
                    <button
                        onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                        className="flex-1 py-2 sm:py-3 rounded-xl font-bold text-sm transition-all"
                        style={{
                            backgroundColor: isLogin ? '#58cc02' : '#21262d',
                            color: isLogin ? 'white' : '#8b949e',
                            boxShadow: isLogin ? '0 3px 0 #46a302' : 'none',
                        }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                        className="flex-1 py-2 sm:py-3 rounded-xl font-bold text-sm transition-all"
                        style={{
                            backgroundColor: !isLogin ? '#1cb0f6' : '#21262d',
                            color: !isLogin ? 'white' : '#8b949e',
                            boxShadow: !isLogin ? '0 3px 0 #1899d6' : 'none',
                        }}
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: '#8b949e' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-sm font-medium outline-none transition-all"
                            style={{
                                backgroundColor: '#0d1117',
                                border: '2px solid #30363d',
                                color: '#c9d1d9',
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-2" style={{ color: '#8b949e' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                            style={{
                                backgroundColor: '#0d1117',
                                border: '2px solid #30363d',
                                color: '#c9d1d9',
                            }}
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold mb-2" style={{ color: '#8b949e' }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                                style={{
                                    backgroundColor: '#0d1117',
                                    border: '2px solid #30363d',
                                    color: '#c9d1d9',
                                }}
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div
                            className="p-3 rounded-xl text-sm text-center"
                            style={{ backgroundColor: 'rgba(248, 81, 73, 0.15)', color: '#f85149' }}
                        >
                            ❌ {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div
                            className="p-3 rounded-xl text-sm text-center"
                            style={{ backgroundColor: 'rgba(88, 204, 2, 0.15)', color: '#58cc02' }}
                        >
                            ✓ {success}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer select-none"
                        style={{
                            backgroundColor: isLogin ? '#58cc02' : '#1cb0f6',
                            color: 'white',
                            boxShadow: isLogin ? '0 4px 0 #46a302' : '0 4px 0 #1899d6',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        {loading ? '⏳ Loading...' : isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px" style={{ backgroundColor: '#30363d' }} />
                    <span className="text-xs font-bold" style={{ color: '#6e7681' }}>OR</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#30363d' }} />
                </div>

                {/* Guest Button */}
                <button
                    onClick={continueAsGuest}
                    className="w-full py-3 sm:py-4 rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer select-none"
                    style={{
                        backgroundColor: '#21262d',
                        color: '#8b949e',
                        border: '2px solid #30363d',
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                    }}
                >
                    👤 Continue as Guest
                </button>
                <p className="text-xs text-center mt-3" style={{ color: '#6e7681' }}>
                    Guest progress is saved locally only
                </p>
            </div>

            {/* Footer */}
            <p className="mt-8 text-xs" style={{ color: '#484f58' }}>
                🧑‍💻 Built for network learners
            </p>
        </div>
    );
};

export default AuthScreen;
