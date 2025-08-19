import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { uploadImage } from '../../services/storage';
import Button from '../UI/Button';
import Avatar from '../UI/Avatar';
import Modal from '../UI/Modal';
import './Feed.css';

const CreatePost = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser, userProfile } = useAuth();
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && images.length === 0) return;

    setLoading(true);

    try {
      let uploadedImages = [];

      // Upload images if any
      if (images.length > 0) {
        setUploading(true);
        uploadedImages = await Promise.all(
          images.map(async (image) => {
            const result = await uploadImage(image.file, 'posts');
            return {
              url: result.url,
              path: result.path,
              name: result.name
            };
          })
        );
        setUploading(false);
      }

      const postData = {
        content: content.trim(),
        images: uploadedImages,
        type: uploadedImages.length > 0 ? 'image' : 'text'
      };

      await onCreatePost(postData);

      // Reset form
      setContent('');
      setImages([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            file,
            preview: e.target.result,
            id: Date.now() + Math.random()
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <>
      <div className="create-post-trigger">
        <div className="create-post-header">
          <Avatar
            src={userProfile?.photoURL}
            alt={userProfile?.displayName}
            size="medium"
          />
          <button
            className="create-post-input"
            onClick={() => setIsModalOpen(true)}
          >
            What's on your mind, {userProfile?.displayName?.split(' ')[0] || 'there'}?
          </button>
        </div>
        
        <div className="create-post-actions">
          <button 
            className="action-btn"
            onClick={() => setIsModalOpen(true)}
          >
            📷 Photo
          </button>
          <button 
            className="action-btn"
            onClick={() => setIsModalOpen(true)}
          >
            🎵 Music
          </button>
          <button 
            className="action-btn"
            onClick={() => setIsModalOpen(true)}
          >
            📍 Location
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Post"
        size="medium"
      >
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="post-author">
            <Avatar
              src={userProfile?.photoURL}
              alt={userProfile?.displayName}
              size="medium"
            />
            <div className="author-info">
              <h4>{userProfile?.displayName}</h4>
              <select className="privacy-select">
                <option value="public">🌍 Public</option>
                <option value="friends">👥 Friends</option>
                <option value="private">🔒 Only me</option>
              </select>
            </div>
          </div>

          <textarea
            className="post-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            maxLength={500}
          />

          <div className="character-count">
            {content.length}/500
          </div>

          {images.length > 0 && (
            <div className="image-preview-container">
              <h5>Selected Images</h5>
              <div className="image-previews">
                {images.map((image) => (
                  <div key={image.id} className="image-preview">
                    <img src={image.preview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(image.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="post-options">
            <div className="option-buttons">
              <button
                type="button"
                className="option-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 Add Photos
              </button>
              <button
                type="button"
                className="option-btn"
                disabled
              >
                😊 Feeling
              </button>
              <button
                type="button"
                className="option-btn"
                disabled
              >
                📍 Check In
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          <div className="post-submit">
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading || uploading}
              disabled={!content.trim() && images.length === 0}
            >
              {uploading ? 'Uploading Images...' : 'Share Post'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePost;