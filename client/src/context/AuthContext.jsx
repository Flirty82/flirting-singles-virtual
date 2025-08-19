import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getCurrentUserProfile } from '../services/auth';

const AuthContext = createContext({
    currentUser: null,
    userProfile: null,
    loading: true,
    signIn: () => {},
    signUp: () => {},
    signOut: () => {},
    updateUserProfile: () => {}
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                try {
                    const profile = await getCurrentUserProfile();
                    setUserProfile(profile);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading,
        setUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

