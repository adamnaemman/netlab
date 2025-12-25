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

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!isLogin && trimmedPassword !== confirmPassword.trim()) {
            setError('Passwords do not match');
            return;
        }

        if (trimmedPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(trimmedEmail, trimmedPassword);
                if (error) {
                    // Handle specific error cases
                    if (error.message.toLowerCase().includes('email not confirmed')) {
                        throw new Error('Please check your email and click the confirmation link before logging in.');
                    }
                    if (error.message.toLowerCase().includes('invalid login credentials')) {
                        throw new Error('Incorrect email or password. Please try again.');
                    }
                    throw error;
                }
            } else {
                const { error } = await signUp(trimmedEmail, trimmedPassword);
                if (error) throw error;

                // If Supabase immediately returns a user/session (confirmation disabled)
                // the onAuthStateChange will handle redirection.
                // Otherwise, show success message.
                setSuccess('✅ Registration initiated! If you don\'t see the dashboard, check your email for a confirmation link.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
            style={{ backgroundColor: '#0d1117' }}
        >
            {/* Background Aesthetic Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20" style={{ backgroundColor: '#58cc02' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10" style={{ backgroundColor: '#1cb0f6' }} />

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Logo & Branding */}
                <div className="text-center mb-6 sm:mb-8">
                    <div
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 transition-transform hover:rotate-12"
                        style={{
                            background: 'linear-gradient(135deg, #58cc02 0%, #46a302 100%)',
                            boxShadow: '0 8px 20px rgba(88, 204, 2, 0.3), 0 4px 0 #3d8c02'
                        }}
                    >
                        🌐
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter" style={{ color: '#58cc02' }}>
                        Net<span className="text-white">Lab</span>
                    </h1>
                    <p className="text-sm sm:text-base mt-2 font-medium" style={{ color: '#8b949e' }}>
                        Cisco Networking <span style={{ color: '#1cb0f6' }}>Made Fun</span>
                    </p>
                </div>

                {/* Auth Card with Glassmorphism */}
                <div
                    className="w-full rounded-3xl p-5 sm:p-8 backdrop-blur-xl transition-all duration-500"
                    style={{
                        backgroundColor: 'rgba(22, 27, 34, 0.8)',
                        border: '1px solid rgba(48, 54, 61, 0.5)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Tabs */}
                    <div className="flex p-1 rounded-2xl mb-6 sm:mb-8" style={{ backgroundColor: '#0d1117' }}>
                        <button
                            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                            className="flex-1 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300"
                            style={{
                                backgroundColor: isLogin ? '#58cc02' : 'transparent',
                                color: isLogin ? 'white' : '#8b949e',
                                boxShadow: isLogin ? '0 4px 0 #46a302' : 'none',
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                            className="flex-1 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300"
                            style={{
                                backgroundColor: !isLogin ? '#1cb0f6' : 'transparent',
                                color: !isLogin ? 'white' : '#8b949e',
                                boxShadow: !isLogin ? '0 4px 0 #1899d6' : 'none',
                            }}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest ml-1" style={{ color: '#6e7681' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 h-14 rounded-2xl text-sm sm:text-base font-semibold outline-none transition-all duration-300 focus:scale-[1.02]"
                                style={{
                                    backgroundColor: '#0d1117',
                                    border: '1px solid #30363d',
                                    color: '#c9d1d9',
                                    caretColor: isLogin ? '#58cc02' : '#1cb0f6'
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest ml-1" style={{ color: '#6e7681' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 h-14 rounded-2xl text-sm sm:text-base font-semibold outline-none transition-all duration-300 focus:scale-[1.02]"
                                style={{
                                    backgroundColor: '#0d1117',
                                    border: '1px solid #30363d',
                                    color: '#c9d1d9',
                                    caretColor: isLogin ? '#58cc02' : '#1cb0f6'
                                }}
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-2 animate-fade-in">
                                <label className="block text-xs font-black uppercase tracking-widest ml-1" style={{ color: '#6e7681' }}>
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 h-14 rounded-2xl text-sm sm:text-base font-semibold outline-none transition-all duration-300 focus:scale-[1.02]"
                                    style={{
                                        backgroundColor: '#0d1117',
                                        border: '1px solid #30363d',
                                        color: '#c9d1d9',
                                        caretColor: '#1cb0f6'
                                    }}
                                />
                            </div>
                        )}

                        {/* Status Messages */}
                        {error && (
                            <div
                                className="p-4 rounded-2xl text-sm font-bold text-center animate-fade-in"
                                style={{ backgroundColor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)' }}
                            >
                                ⚠️ {error}
                            </div>
                        )}

                        {success && (
                            <div
                                className="p-4 rounded-2xl text-sm font-bold text-center animate-fade-in"
                                style={{ backgroundColor: 'rgba(88, 204, 2, 0.1)', color: '#58cc02', border: '1px solid rgba(88, 204, 2, 0.2)' }}
                            >
                                ✨ {success}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={(e) => {
                                // Ensure the form submits on mobile touch
                                if (!loading) {
                                    handleSubmit(e);
                                }
                            }}
                            className="group relative w-full h-14 sm:h-16 rounded-2xl font-black text-lg sm:text-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer select-none overflow-hidden"
                            style={{
                                backgroundColor: isLogin ? '#58cc02' : '#1cb0f6',
                                color: 'white',
                                boxShadow: isLogin ? '0 6px 0 #3d8c02' : '0 6px 0 #1899d6',
                                touchAction: 'manipulation',
                                WebkitTapHighlightColor: 'transparent',
                                zIndex: 50,
                                position: 'relative',
                            }}
                        >
                            <span className="relative z-10 pointer-events-none">
                                {loading ? '⏳ PROCESSING...' : isLogin ? 'LOGIN NOW' : 'CREATE ACCOUNT'}
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px" style={{ backgroundColor: '#30363d' }} />
                        <span className="text-xs font-black" style={{ color: '#484f58' }}>QUICK START</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: '#30363d' }} />
                    </div>

                    {/* Guest Button */}
                    <button
                        onClick={continueAsGuest}
                        className="w-full h-14 rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-95 cursor-pointer select-none"
                        style={{
                            backgroundColor: '#21262d',
                            color: '#c9d1d9',
                            border: '1px solid #30363d',
                            touchAction: 'manipulation',
                            WebkitTapHighlightColor: 'transparent',
                        }}
                    >
                        🚀 Explore as Guest
                    </button>
                    <p className="text-xs text-center mt-4 font-medium" style={{ color: '#484f58' }}>
                        Guest mode saves progress locally. <br className="sm:hidden" /> No email required.
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center sm:text-right px-4">
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ color: '#30363d' }}>
                        Version 2.5.0 • Made with ❤️ for Engineers
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
