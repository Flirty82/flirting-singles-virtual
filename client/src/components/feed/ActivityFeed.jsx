import React, { useState, useEffect } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import Post from './Post';
import CreatePost from './CreatePost';
import LoadingSpinner from '../UI/LoadingSpinner';
import './Feed.css';

const ActivityFeed = () => {
  const { posts, loading, error, createPost } = usePosts();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('all'); // all, following, nearby

  if (loading) {
    return (
      <div className="feed-loading">
        <LoadingSpinner size="large" />
        <p>Loading your feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-error">
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h2>Your Feed</h2>
        <div className="feed-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Posts
          </button>
          <button 
            className={`filter-btn ${filter === 'following' ? 'active' : ''}`}
            onClick={() => setFilter('following')}
          >
            Following
          </button>
          <button 
            className={`filter-btn ${filter === 'nearby' ? 'active' : ''}`}
            onClick={() => setFilter('nearby')}
          >
            Nearby
          </button>
        </div>
      </div>

      <CreatePost onCreatePost={createPost} />

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-feed-icon">📱</div>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
          </div>
        ) : (
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
