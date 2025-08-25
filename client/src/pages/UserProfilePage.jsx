import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    age: user.age || '',
    bio: user.bio || '',
    interests: user.interests || '',
    location: user.location || ''
  });

  const handleSave = () => {
    updateUser(formData);
    setEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <img src={user.avatar} alt={user.name} className="profile-avatar-large" />
            <button className="btn btn-secondary">Change Photo</button>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <h4>Membership</h4>
              <span className={`membership-badge ${user.membership}`}>
                {user.membership.charAt(0).toUpperCase() + user.membership.slice(1)}
              </span>
            </div>
            <div className="stat-item">
              <h4>Member Since</h4>
              <span>{new Date(user.joinDate).getFullYear()}</span>
            </div>
            <div className="stat-item">
              <h4>Matches</h4>
              <span>12</span>
            </div>
            <div className="stat-item">
              <h4>Messages</h4>
              <span>48</span>
            </div>
          </div>
        </div>
        
        <div className="profile-main">
          <div className="profile-section">
            <div className="section-header">
              <h3>Personal Information</h3>
              <button 
                className="btn btn-secondary"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {editing ? (
              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input 
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="form-group">
                  <label>Interests</label>
                  <input 
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="Music, Movies, Travel..."
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <strong>Name:</strong> {user.name}
                </div>
                <div className="info-item">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="info-item">
                  <strong>Age:</strong> {formData.age || 'Not specified'}
                </div>
                <div className="info-item">
                  <strong>Bio:</strong> {formData.bio || 'No bio added yet'}
                </div>
                <div className="info-item">
                  <strong>Interests:</strong> {formData.interests || 'No interests added yet'}
                </div>
                <div className="info-item">
                  <strong>Location:</strong> {formData.location || 'Location not specified'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ActivityFeedPage, ChatPage, BingoPage, KaraokePage, ProfilePage };