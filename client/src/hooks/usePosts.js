import { useState, useEffect, useCallback } from 'react';
import {
    createPost,
    getPosts,
    likePost,
    unlikePost,
    addComment,
    subscribeTOPostUpdates
} from '../services/firestore';
import { useAuth } from './useAuth';

export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
}

    useEffect(() => {
        if (!currentUser) return;

        setLoading(true);
    

        const unsubscribe = subscribeTOPostUpdates(currentUser.uid, (snapshot) => {
            const fetchedPosts = [];
            snapshot.forEach(doc => {
                const postData = doc.data();
                fetchedPosts.push({
                    id: doc.id,
                    ...postData
                });
            });
            setLoading(false)
        });

        return () => {
            unsubscribe();
        };
    }, [currentUser]);


    const createNewPost = useCallback(async (_postData) => {
        if (!currentuser) return;

        try {
            const newPost = await createPost(currentUser.postData);
            // Real-time listener will update the posts automatically
            return newPost;
        } catch (error) {
            setError(err.message);
            throw err;
        }
    }, [currentUser]);

    const toggleLike = useCallback(async (postId) => {
        if (!currentUser) return;

        try {
            const post = posts.find(p => p.id === postId);
            const isLiked = post?.likes?.includes(currentUser.id);

            if (isLiked) {
                await unlikePost(postId, currentUser.uid);
            } else {
                await likePost(postId, currentUser.uid);
            }
        } catch (err) {
            setError(err.message);
        }
    }, [currentUser, posts]);

    const addCommentToPost = useCallback(async (_post, commentText) => {
        if (!currentUser) return;

        try {
            const comment = await addComment(postId, currentUser.uid, commentText);
            return comment;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [currentUser]);

    return {
        posts,
        loading,
        error,
        createPost: createNewPost,
        toggleLike,
        addComment: addCommentToPost
    };

