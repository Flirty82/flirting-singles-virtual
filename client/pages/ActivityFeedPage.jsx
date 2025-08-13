import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const ActivityFeedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Sarah M.',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah',
      content: 'Just had an amazing virtual karaoke session! 🎤 Looking forward to meeting more music lovers!',
      time: '2 hours ago',
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      user: 'Mike R.',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mike',
      content: 'Virtual bingo night was so much fun! Who else is joining tomorrow? 🎲',
      time: '4 hours ago',
      likes: 8,
      comments: 5
    },
    {
      id: 3,
      user: 'Emma L.',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Emma',
      content: 'Thanks to LoveConnect, I found my soulmate! ❤️ We met through the music matching feature!',
      time: '1 day ago',
      likes: 25,
      comments: 12
    }
  ]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        user: user.name,
        avatar: user.avatar,
        content: newPost,
        time: 'Just now',
        likes: 0,
        comments: 0
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="container">
      <div className="feed-header">
        <h1>Activity Feed</h1>
        <p>Share your thoughts and connect with the community</p>
      </div>
      
      <div className="activity-feed">
        <div className="post-form">
          <div className="post-form-header">
            <img src={user.avatar} alt={user.name} className="post-avatar" />
            <span>What's on your mind, {user.firstName || user.name}?</span>
          </div>
          <form onSubmit={handlePostSubmit}>
            <textarea 
              placeholder="Share something with the community..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows="3"
            />
            <div className="post-form-actions">
              <div className="post-options">
                <button type="button" className="btn-icon">📷 Photo</button>
                <button type="button" className="btn-icon">🎵 Music</button>
                <button type="button" className="btn-icon">📍 Location</button>
              </div>
              <button type="submit" className="btn btn-primary" disabled={!newPost.trim()}>
                Post
              </button>
            </div>
          </form>
        </div>
        
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img src={post.avatar} alt={post.user} className="post-avatar" />
                <div className="post-user-info">
                  <div className="post-user">{post.user}</div>
                  <div className="post-time">{post.time}</div>
                </div>
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-actions">
                <button 
                  className="post-action-btn"
                  onClick={() => handleLike(post.id)}
                >
                  ❤️ {post.likes}
                </button>
                <button className="post-action-btn">
                  💬 {post.comments}
                </button>
                <button className="post-action-btn">
                  🔄 Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
