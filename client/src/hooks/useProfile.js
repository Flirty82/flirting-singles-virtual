import { useState, useEffect } from 'react';
import profileServices from 'flirting-singles-virtual/client/src/services/profileServices';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await profileServices.getProfile();
            setProfile(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updates) => {
        try {
            const updatedProfile = await profileService.updateProfile(updates);
            setProfile(updatedProfile);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addInterest = async (async interest => {
        try {
            const updatedProfile = await profileService.addInterest(interest);
            setProfile(updatedProfile);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    });

    const removeInterest = async (interest) => {
        try {
            const updatedProfile = await profileService.removeInterest(interest);
            setProfile(updatedProfile);
    } catch (err) {
        setError(err.message);
        throw err;
    }
};

return {
    profile,
    loading,
    error,
    updateProfile,
    addInterest,
    removeInterest,
    refetch: fetchProfile
};
};