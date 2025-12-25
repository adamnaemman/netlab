import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            // ALWAYS clear any existing session on app load
            // This forces users to login every time they open the app
            localStorage.removeItem('netlab_guest_mode');

            if (isSupabaseConfigured()) {
                // Sign out any existing session to force login
                await supabase.auth.signOut();
            }

            // Set state to not authenticated, showing login page
            setUser(null);
            setIsGuest(false);
            setLoading(false);
        };

        initAuth();

        // Listen for auth changes (for when user logs in)
        if (isSupabaseConfigured()) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
                setIsGuest(false);
            });

            return () => subscription.unsubscribe();
        }
    }, []);

    // Sign up with email/password
    const signUp = async (email, password) => {
        if (!isSupabaseConfigured()) {
            return { error: { message: 'Supabase not configured' } };
        }
        const { data, error } = await supabase.auth.signUp({ email, password });
        return { data, error };
    };

    // Sign in with email/password
    const signIn = async (email, password) => {
        if (!isSupabaseConfigured()) {
            return { error: { message: 'Supabase not configured' } };
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { data, error };
    };

    // Sign out
    const signOut = async () => {
        if (isGuest) {
            localStorage.removeItem('netlab_guest_mode');
            setIsGuest(false);
            setUser(null);
            return;
        }
        if (isSupabaseConfigured()) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    // Continue as guest
    const continueAsGuest = () => {
        localStorage.setItem('netlab_guest_mode', 'true');
        setIsGuest(true);
        setLoading(false);
    };

    const value = {
        user,
        loading,
        isGuest,
        isAuthenticated: Boolean(user) || isGuest,
        signUp,
        signIn,
        signOut,
        continueAsGuest,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
