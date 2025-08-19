import React from 'react';
import Button from '../UI/Button';
import './Feed.css';

const PostActions = ({ post, isLiked, onLike, onComment, onShare }) => {
  return (
    <div className="post-actions">
      <Button
        variant="ghost"
        size="medium"
        onClick={onLike}
        className={`action-button ${isLiked ? 'liked' : ''}`}
      >
        <span className="action-icon">
          {isLiked ? '💖' : '🤍'}
        </span>
        <span className="action-text">Like</span>
      </Button>

      <Button
        variant="ghost"
        size="medium"
        onClick={onComment}
        className="action-button"
      >
        <span className="action-icon">💬</span>
        <span className="action-text">Comment</span>
      </Button>

      <Button
        variant="ghost"
        size="medium"
        onClick={onShare}
        className="action-button"
      >
        <span className="action-icon">📤</span>
        <span className="action-text">Share</span>
      </Button>
    </div>
  );
};

export default PostActions;