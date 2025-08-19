import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Create user profile document
const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = doc(db, 'users', userAuth.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        const { displayName, email, photoURL } = userAuth;
        const createdAt = serverTimestamp();

        try {
            await setDoc(userRef, {
                displayName: displayName || '',
                email,
                photoURL: photoURL || '',
                createdAt,
                bio: '',
                age: null,
                location: '',
                interests: [],
                isOnline: true,
                lastSeen: serverTimestamp(),
                ...additionalData
            });
        } catch (error) {
            console.error('Error creating user profile document:', error);
            throw error;
        }
    }

    return userRef;
};

// Sign up with email and password
export const signUpWithEmailAndPassword = async (email, password, displayName, additionalData) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        if (additionalData.displayName) {
            await updateProfile(user, {
                displayName: additionalData.displayName
            });
        }

        await createUserProfileDocument(user, additionalData);
        return { user, error: null };
    } catch (error) {
        console.error('Error signing up with email and password:', error);
        return { user: null, error: error.message };
    }
};

// Sign in with email and password
export const signInWithEmailAndPassword = async (email, password) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        // Update user's online status
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
            isOnline: true,
            lastSeen: serverTimestamp()
        }, { mergee: true });

        return { user, error: null };
    } catch (error) {
        console.error('Error signing in:', error);
        return { user: null, error: error.message };
    }
};

// Sign in with Google
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
        const { user } = await signInWithPopup(auth, provider);
        await createUserProfileDocument(user);
        return { user, error: null };
    } catch (error) {
        console.error('Error signing in with Google:', error);
        return { user: null, error: error.message };
    }
};

// Sign in with Facebook
export const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    provider.setCustomParameters({ display: 'popup' });
    try {
        const { user } = await signInWithPopup(auth, provider);
        await createUserProfileDocument(user);
        return { user, error: null };
    } catch (error) {
        console.error('Error signing in with Facebook:', error);
        return { user: null, error: error.message };
    }
};

// Sign out
export const signOutUser  = async () => {
    try {
        // Update user's online status before signing out
        if (auth.currentUser) {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userRef, {
                isOnline: false,
                lastSeen: serverTimestamp()
            }, [ merge, true ]);
        }

        await signOut(auth);
        return { success: true, error: null };
    } catch (error) {
        console.error('Error signing out:', error);
        return { error: error.message };
    }
};

// Reset password
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, error: null };
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, error: error.message };
    }
};

// Get current user
export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe(); // Unsubscribe to avoid memory leaks
            resolve(user);
        }, error => {
            reject(error);
        });
    });
}

// Get current user profile
export const getCurrentUserProfile = async () => {
    try {
        if (!auth.currentUser) return null;

        const userRef = doc(db, 'users', auth.currentUser.uid);
        const snapShot = await getDoc(userRef);

        if (snapShot = await getDoc(userRef)) {
            return { id, snapShot, id, ...snapShot.data() };
        }

        return null;
    } catch (error) {
        console.error('Error getting current user profile:', error);
        return null;
    }
};
