import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    increment,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { db } from './fireaseConfig';

//Posts collection functions
export const createPost = async (userId, postData) => {
    try {
        const postsRef = collection(db, 'posts');
        const newPost = {
            userId,
            content: postData.content,
            images: postData.images || [],
            type: postData.type || 'text', // text, image, video
            likes: [],
            likesCount: 0,
            comments: 0,
            commentsCount: 0,
            shares: [],
            sharesCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(postsRef, newPost);
        return { id: docRef.id, ...newPost };
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const getPosts = async (lastVisible = null, limitCount = 10) => {
    try {
        let q = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        if (lastVisible) {
            q = query(
                collection(db, 'posts'),
                orderedBy('createdAt', 'desc'),
                startAfter(lastVisible),
                limit(limitCount)
            );
        }

        const querySnapshot = await getDocs(q);
        const posts = [];

        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
        });

        return posts;
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
};

export const likePost = async (postId, userId) => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            likes: arrayUnion(userId),
            likesCount: increment(1),
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

export const unlikePost = async (postId, userId) => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            likes: arrayRemove(userId),
            likesCount: increment(-1),
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error unliking post:', error);
        throw error;
    }
};

export const addComment = async (postId, userId, commentText) => {
    try {
        const comment = {
            id: Date.now().toString(),
            userId,
            text: commentText,
            createdAt: serverTimestamp()
        };

        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            comments: arrayUnion(comment),
            commentsCount: increment(1),
            updatedAt: serverTimestamp()
        });

        return comment;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

// Real-time listeners
export const subscribeToPostUpdates = (callback) => {
    const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(20)
    );

    return onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
        });
        callback(posts);
    });
};

export const subscribeToUserProfile = (userId, callback) => {
    const userRef = doc(db, 'users', userId);

    return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        }
    });
};

// User functions
export const updateUserProfile = async (userId, updates) => {
    try {
        const userReg = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...updates,
            updated: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        }

        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

