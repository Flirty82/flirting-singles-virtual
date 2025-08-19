import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { useUserProfile } from '../../hooks/useFirestore';
import Avatar from '../UI/Avatar';
import Button from '../UI/Button';
import PostActions from './PostActions';
import './Feed.css';

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { currentUser } = useAuth();
  const { toggleLike, addComment } = usePosts();
  const { data: author } = useUserProfile(post.userId);

  const isLiked = post.likes?.includes(currentUser?.uid);
  const likesCount = post.likesCount || 0;
  const commentsCount = post.commentsCount || 0;

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(post.id, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatPostDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };

  return (
    <article className="post">
      <div className="post-header">
        <div className="post-author">
          <Avatar
            src={author?.photoURL}
            alt={author?.displayName}
            size="medium"
            online={author?.isOnline}
          />
          <div className="author-info">
            <h4 className="author-name">{author?.displayName || 'Unknown User'}</h4>
            <div className="post-meta">
              <span className="post-time">{formatPostDate(post.createdAt)}</span>
              <span className="post-privacy">🌍</span>
            </div>
          </div>
        </div>
        
        <div className="post-menu">
          <button className="menu-btn">⋯</button>
        </div>
      </div>

      <div className="post-content">
        {post.content && (
          <p className="post-text">{post.content}</p>
        )}
        
        {post.images && post.images.length > 0 && (
          <div className={`post-images ${post.images.length === 1 ? 'single-image' : 'multiple-images'}`}>
            {post.images.map((image, index) => (
              <div key={index} className="post-image-container">
                <img
                  src={image.url}
                  alt={`Post image ${index + 1}`}
                  className="post-image"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="post-stats">
        {likesCount > 0 && (
          <div className="likes-count">
            <span className="like-icon">💖</span>
            <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          </div>
        )}
        
        {commentsCount > 0 && (
          <div className="comments-count">
            <button 
              className="comments-btn"
              onClick={() => setShowComments(!showComments)}
            >
              {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
            </button>
          </div>
        )}
      </div>

      <PostActions
        post={post}
        isLiked={isLiked}
        onLike={handleLike}
        onComment={() => setShowComments(!showComments)}
        onShare={() => {}}
      />

      {showComments && (
        <div className="post-comments">
          <form onSubmit={handleComment} className="comment-form">
            <Avatar
              src={currentUser?.photoURL}
              alt="Your avatar"
              size="small"
            />
            <div className="comment-input-container">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <Button
                type="submit"
                variant="primary"
                size="small"
                disabled={!newComment.trim()}
              >
                Post
              </Button>
            </div>
          </form>

          <div className="comments-list">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="comment">
                <Avatar
                  src={comment.userPhoto}
                  alt={comment.userName}
                  size="small"
                />
                <div className="comment-content">
                  <div className="comment-bubble">
                    <h5 className="comment-author">{comment.userName}</h5>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                  <div className="comment-meta">
                    <span className="comment-time">
                      {formatPostDate(comment.createdAt)}
                    </span>
                    <button className="comment-like">Like</button>
                    <button className="comment-reply">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default Post;
