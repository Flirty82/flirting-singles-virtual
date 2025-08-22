import React, { useState, useRef, useCallback } from 'react';
import { User, Camera, Settings, Heart, Users, MessageCircle, MapPin, Calendar, Mail, Phone, Edit3, Save, X, Upload, Trash2, Eye, EyeOff, Lock, Bell, Shield, CreditCard, Check, AlertCircle } from 'lucide-react';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    location: 'New York, NY',
    bio: 'Adventure seeker, coffee enthusiast, and dog lover. Looking for someone who shares my passion for exploring new places and trying new experiences.',
    interests: ['Travel', 'Photography', 'Hiking', 'Cooking', 'Music', 'Movies'],
    lookingFor: 'Long-term relationship',
    relationshipStatus: 'Single',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face'
    ],
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  });

  const [settings, setSettings] = useState({
    privacy: {
      profileVisibility: 'public',
      showAge: true,
      showLocation: true,
      showLastSeen: false
    },
    notifications: {
      messages: true,
      likes: true,
      matches: true,
      profileVisits: false,
      emailNotifications: true
    },
    account: {
      twoFactor: false,
      emailVerified: true,
      phoneVerified: false
    }
  });

  const [newInterest, setNewInterest] = useState('');
  const fileInputRef = useRef(null);
  const profilePictureInputRef = useRef(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
    showNotification('Settings updated successfully');
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditing(false);
      showNotification('Profile updated successfully!');
    } catch (error) {
      showNotification('Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
      showNotification(`Added "${newInterest.trim()}" to interests`);
    }
  };

  const removeInterest = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
    showNotification(`Removed "${interest}" from interests`);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          photos: [...prev.photos, e.target.result]
        }));
        showNotification('Photo added successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
        showNotification('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    setProfileData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    showNotification('Photo removed');
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const ProfileView = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg border border-pink-100 p-8">
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={profileData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <button 
              onClick={() => profilePictureInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-pink-500 text-white rounded-full p-3 hover:bg-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Camera size={18} />
            </button>
            <input
              ref={profilePictureInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-gray-600 text-xl mb-3">
                  {calculateAge(profileData.dateOfBirth)} years old
                </p>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin size={18} className="text-pink-500" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart size={18} className="text-purple-500" />
                    <span>{profileData.relationshipStatus}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={isEditing ? saveProfile : () => setIsEditing(true)}
                disabled={loading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isEditing
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : isEditing ? (
                  <Save size={18} />
                ) : (
                  <Edit3 size={18} />
                )}
                <span>{loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="mr-3 text-pink-500" size={24} />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'First Name', field: 'firstName', type: 'text' },
            { label: 'Last Name', field: 'lastName', type: 'text' },
            { label: 'Email', field: 'email', type: 'email' },
            { label: 'Phone', field: 'phone', type: 'tel' },
            { label: 'Date of Birth', field: 'dateOfBirth', type: 'date' },
            { label: 'Location', field: 'location', type: 'text' }
          ].map((item) => (
            <div key={item.field} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{item.label}</label>
              {isEditing ? (
                <input
                  type={item.type}
                  value={profileData[item.field]}
                  onChange={(e) => handleInputChange(item.field, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-200"
                />
              ) : (
                <p className="text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                  {item.type === 'date' ? new Date(profileData[item.field]).toLocaleDateString() : profileData[item.field]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <MessageCircle className="mr-3 text-purple-500" size={24} />
          About Me
        </h2>
        {isEditing ? (
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-200 resize-none"
            placeholder="Tell others about yourself..."
          />
        ) : (
          <p className="text-gray-700 leading-relaxed bg-gray-50 px-4 py-4 rounded-xl">{profileData.bio}</p>
        )}
      </div>

      {/* Interests */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Heart className="mr-3 text-pink-500" size={24} />
          Interests
        </h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {profileData.interests.map((interest, index) => (
            <span
              key={index}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700 border border-pink-200 hover:shadow-md transition-all duration-200"
            >
              {interest}
              {isEditing && (
                <button
                  onClick={() => removeInterest(interest)}
                  className="ml-2 text-pink-600 hover:text-pink-800 hover:bg-pink-200 rounded-full p-1 transition-all duration-200"
                >
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="flex space-x-3">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add new interest..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && addInterest()}
            />
            <button
              onClick={addInterest}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Photos */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Camera className="mr-3 text-purple-500" size={24} />
          Photos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileData.photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600 transform hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[3/4] border-3 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 group"
            >
              <div className="text-center">
                <Upload size={32} className="mx-auto mb-3 text-gray-400 group-hover:text-pink-500 transition-colors" />
                <p className="text-gray-600 font-medium">Add Photo</p>
                <p className="text-gray-400 text-sm mt-1">Max 5MB</p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-8">
      {/* Privacy Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Eye className="mr-3 text-pink-500" size={24} />
          Privacy Settings
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSettingsChange('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-200"
            >
              <option value="public">Public</option>
              <option value="members">Members Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          {[
            { key: 'showAge', label: 'Show Age', desc: 'Display your age on your profile' },
            { key: 'showLocation', label: 'Show Location', desc: 'Display your location to other users' },
            { key: 'showLastSeen', label: 'Show Last Seen', desc: 'Let others see when you were last active' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
              <button
                onClick={() => handleSettingsChange('privacy', item.key, !settings.privacy[item.key])}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
                  settings.privacy[item.key] ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                  settings.privacy[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Bell className="mr-3 text-purple-500" size={24} />
          Notification Settings
        </h2>
        <div className="space-y-4">
          {[
            { key: 'messages', label: 'New Messages', desc: 'Get notified when you receive messages' },
            { key: 'likes', label: 'Likes & Matches', desc: 'Get notified about likes and new matches' },
            { key: 'profileVisits', label: 'Profile Visits', desc: 'Get notified when someone views your profile' },
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
              <button
                onClick={() => handleSettingsChange('notifications', item.key, !settings.notifications[item.key])}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
                  settings.notifications[item.key] ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                  settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Shield className="mr-3 text-pink-500" size={24} />
          Account Security
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <span className="text-sm font-semibold text-gray-700">Two-Factor Authentication</span>
              <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={() => handleSettingsChange('account', 'twoFactor', !settings.account.twoFactor)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
                settings.account.twoFactor ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                settings.account.twoFactor ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          {[
            { key: 'emailVerified', label: 'Email Verified', desc: 'Your email address is verified' },
            { key: 'phoneVerified', label: 'Phone Verified', desc: 'Your phone number is verified' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                settings.account[item.key] 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {settings.account[item.key] ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          ))}
          
          <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
            <Lock className="inline mr-2" size={16} />
            Change Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
          <AlertCircle className="mr-3" size={24} />
          Danger Zone
        </h2>
        <div className="space-y-4">
          <button className="w-full px-6 py-3 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
            Deactivate Account
          </button>
          <button className="w-full px-6 py-3 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg border-l-4 animate-slide-in ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-500 text-green-800' 
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <Check size={18} className="text-green-600" />
            ) : (
              <AlertCircle size={18} className="text-red-600" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  LoveConnect
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {[MessageCircle, Users, Bell].map((Icon, index) => (
                <button key={index} className="p-2 text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-200">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 p-1 bg-white rounded-2xl shadow-lg border border-gray-100">
          {[
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserProfilePage;