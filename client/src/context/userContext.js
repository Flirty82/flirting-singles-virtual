import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const UserContext = createContext({});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      // Subscribe to user data changes
      const unsubscribe = onSnapshot(
        doc(db, 'users', user.uid),
        (doc) => {
          if (doc.exists()) {
            setUserData({ id: doc.id, ...doc.data() });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      );

      // Set user online status
      updateUserStatus(true);

      // Set offline status on unmount
      return () => {
        unsubscribe();
        updateUserStatus(false);
      };
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [user]);

  const updateUserStatus = async (isOnline) => {
    if (user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          isOnline,
          lastSeen: new Date()
        });
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    }
  };

  const updateProfile = async (updates) => {
    if (user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          ...updates,
          updatedAt: new Date()
        });
        return true;
      } catch (error) {
        console.error('Error updating profile:', error);
        return false;
      }
    }
  };

  const value = {
    userData,
    loading,
    onlineUsers,
    updateProfile,
    updateUserStatus
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};