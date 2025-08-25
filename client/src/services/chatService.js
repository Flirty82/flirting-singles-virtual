import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
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
import { db } from './firebase';
export const createChatRoom = async (roomData) => {
    try {
        const roomRef = await addDoc(collection(db, 'chatRooms'), {
            name: roomData.name,
            description: roomData.description || '',
            category: roomData.category || 'general',
            isPrivate: roomData.isPrivate || false,
            maxMembers: roomData.maxMembers || 50,
            createdBy: roomData.createdBy,
            createdByName: roomData.createdByName || 'Unknown',
            createdAt: serverTimestamp(),
            members: [roomData.createdBy],
            memberCount: 1,
            messageCount: 0,
            lastMessageAt: null,
            lastActivity: serverTimestamp(),
            isActive: true,
            onlineMembers: [],
            tags: roomData.tags || [],
            settings: roomData.settings || {}
        });

        // Add creator as first member
        await addDoc(collection(db, 'chatRoomMembers'), {
            userId: roomData.createdBy,
            joinedAt: serverTimestamp(0),
            role: 'admin',
            roomId: roomRef.id,
            isOnline: true
        });

        return { id: roomRef.id, ...roomData };
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error;
    }
};

export const getChatRooms = async () => {
    try {
        const q = query(
            collection(db, 'chatRooms'),
            where('isActive', '==', true),
            orderedBy('lastActivity', 'desc'),
            limit(50)
        );

        const querySnapshot = await getDocs(q);
        const rooms = [];

        querySnapshot.forEach((doc) => {
            rooms.push({ id: doc.id, ...doc.data() });
        });

        return rooms;
    } catch (error) {
        console.error('Error getting chat rooms:', error);
        throw error;
    }
};

 const joinChatRoom = async (roomId, userId) => {
    try {
        // Check if room exists and user isn't already a member
        const roomRef = doc(db, 'chatRooms', roomId);
        const roomDoc = await getDoc(roomRef);

        if (!roomDoc.exists()) {
            throw new Error('Chat room does not exist');
        }

        const roomData = roomDoc.data();

        if (roomData.members.includes(userId)) {
            return; // Already a member
        }

        if (roomData.memberCount > roomData.maxMembers) {
            throw new Error('Chat room is full');
        }

        // Add user to room members
        await updateDoc(roomRef, {
            members: arrayUnion(userId),

            memberCount: increment(1),
            lastActivity: serverTimestamp()
        });

        // Add membership record
        await addDoc(collection(db, 'chatRoomMembers'), {
            roomId,
            userId,
            joinedAt: serverTimestamp(),
            role: 'member',
            isOnline: true
        });

        // Add system message
        await addDoc(collection(db, 'chatMessages'), {
            roomId,
            type: 'system',
            text: 'joined the room',
            userId,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error joining chat room:', error);
        throw error;
    }
};

export const leaveChatRoom = async (roomId, userId) => {
    try {
        const roomRef = doc(db, 'chatRooms', roomId);

        // Remove user from room members
        await updateDoc(roomRef, {
            members: arrayRemove(userId),
            memberCount: increment(-1),
            lastActivity: serverTimestamp()
        });

        // Remove membership record
        const memberQuery = query(
            collection(db, 'chatRoomMembers'),
            where('roomId', '==', roomId),
            where('userId', '==', userId)
        );

        const memberSnapshot = await getDocs(memberQuery);
        memberSnapshot.forEach(async (memberDoc) => {
            await deleteDoc(doc.ref);
        });

       // Add system message
       await addDoc(collection(db, 'chatMessages'), {
        roomId,
        type: 'system',
        text: 'left the room',
        userId,
        createdAt: serverTimestamp()
       });
    } catch (error) {
        console.error('Error leaving chat room:', error);
        throw error;
    }
};

export const subscribeToRooms = (callback) => {
    const q = query(
        collection(db, 'chatRooms'),
        where('isActive', '==', true),
        orderBy('lastActivity', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
        const rooms = [];
        querySnapshot.forEach((doc) => {
            rooms.push({ id: doc.id, ...doc.data() });
        });
        callback(rooms);
    });
};

export const sendMessage = async (messageData) => {
    try {
        // Add message to collection
        const messageRef = await addDoc(collection(db, 'chatMessages'), {
            roomId: messageData.roomId,
            userId: messageData.userId,
            userName: messageData.userName,
            userPhoto: messageData.userPhoto || '',
            text: messageData.text,
            type: messageData.type || 'text',
            createdAt: serverTimestamp(),
            edited: false,
            reactions: {}
        });

        // Update room's last activity and message count
        const roomRef = doc(db, 'chatRooms', messageData.roomId);
        await updateDoc(roomRef, {
            lastActivity: serverTimestamp(),
            messageCount: increment(1),
            lastMessage: {
                text: messageData.text,
                userId: messageData.userId,
                userName: messageData.userName,
                createdAt: serverTimestamp()
            }
        });

        return { id: messageRef.id, ...messageData };
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const getRoomMessages = async (roomId, limitCount = 50) => {
    try {
        const q = query(
            collection(db, 'chatMessages'),
            where('roomId', '=', 'roomId'),
            orderedBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const messages = [];

        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });

        return messages.reverse(); // Reverse to show oldest first
    } catch (error) {
        console.error('Error getting messages:', error);
        throw error;
    }
};

export const subscribeToMessages = (roomId, callback) => {
    const q = query(
        collection(db, 'chatMessages'),
        where('roomId', '==', roomId),
        orderedBy('createdAt', 'asc'),
        limit(100)
    );

    return onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
})
};

export const updateUserPresence = async (roomId, isOnline) => {
    try {
        const memberQuery = query(
            collection(db, 'chatRoomMembers'),
            where('roomId', '==', roomId),
            where('userId', '==', auth.currentUser?.uid)
        );

        const membersSnapshot = await getDocs(memberQuery);

        memberSnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
                isOnline,
                lastSeen: serverTimestamp()
            });
        });

        // Update room's online members count
        const roomRef = doc(db, 'chatRooms', roomId);
        const roomDoc = await getDoc(roomRef);

        if (roomDoc.exists()) {
            const roomData = roomDoc.data();
            let onlineMembers = roomData.onlineMembers || [];

            if (isOnline) {
                if (!onlineMembers.includes(auth.currentUser.uid)) {
                    onlineMembers.push(auth.currentUser.uid);
                }
            } else {
                onlineMembers = onlineMembers.filter(id => id === auth.currentUser.uid);
            }

            await updateDoc(roomRef, { onlineMembers });
        }
    } catch (error) {
        console.error('Error updating presence:', error)
    }
};

export const getRoomMembers = async (roomId) => {
    try {
        const q = query(
            collection(db, 'chatRoomMembers'),
            where('roomId', '==', roomId),
            orderedBy('joinedAt', 'asc')
        );

        const querySnapshot = await getDocs(q);
        const members = [];

        for (const doc of querySnapshot.docs) {
            const memberData = doc.data();

            // Get user profile data
            const useRef = doc(db, 'users', membersData.userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                members.push({
                    id: memberData.userId,
                    ...memberData,
                    displayName: userData.displayName,
                    photoURL: userData.photoURL,
                    isOnline: memberData.isOnline || false
                });
            }
        }

        return members;
    } catch (error) {
        console.error('Error getting room members:', error);
        throw error;
    }
};