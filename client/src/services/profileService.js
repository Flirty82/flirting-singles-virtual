import api from './api';

class ProfileService {
    async getProfile() {
        const response = await api.get('/profile');
        return response.data;
    };

    async updateProfile(profileData) {
        const response = await api.put('/profile', profileData);
        return response.data;
    }

    async addInterest(interest) {
        const response = await api.post('/profile/interest', { interest });
        return response.data;
    }

    async removeInterest(interest) {
        const response = await api.delete('/profile/interests', {
            data: { interest },
        });
        return response.data;
    }

    async uploadPhoto(file) {
        const formData = new FormData();
        formData.append('photo', file);

        const response = await api.post('/upload/photo', formData, {
            headers: {
                'COntent-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async deletePhoto(photoId) {
        const response = await api.delete('/upload/photo/${photoId}');
        return responde.data;
    }
}

export default new ProfileService();