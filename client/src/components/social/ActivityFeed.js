// frontend/src/components/social/ActivityFeed.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiShare2, 
  FiMoreHorizontal,
  FiImage,
  FiVideo,
  FiSmile,
  FiMapPin,
  FiTrendingUp,
  FiClock,
  FiEye,
  FiBookmark,
  FiFlag,
  FiEdit3,
  FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import Comments from './Comments';
import LoadingSpinner, { PostSkeleton } from '../common/LoadingSpinner';
import './ActivityFeed.css';

const ActivityFeed = ({ feedType = 'public', userId = null }) => {
  const { user } = useAuth();
  const { isUserOnline } = useSocket();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  
  const observerRef = useRef();

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Posts', icon: <FiTrendingUp /> },
    { value: 'following', label: 'Following', icon: <FiHeart /> },
    { value: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
    { value: 'recent', label: 'Recent', icon: <FiClock /> }
  ];

  // Load initial posts
  useEffect(() => {
    loadPosts(true);
  }, [feedType, userId, filter]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadPosts(false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loadingMore]);

  const loadPosts = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPosts = generateMockPosts(isInitial ? 10 : 5);
      
      if (isInitial) {
        setPosts(mockPosts);
      } else {
        setPosts(prev => [...prev, ...mockPosts]);
      }
      
      // Simulate end of posts
      if (posts.length > 30) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const generateMockPosts = (count) => {
    const postTypes = ['text', 'image', 'video', 'poll', 'milestone'];
    const authors = [
      { name: 'Sarah Johnson', username: 'sarah_j', avatar: '/images/user1.jpg' },
      { name: 'Mike Chen', username: 'mike_c', avatar: '/images/user2.jpg' },
      { name: 'Emma Davis', username: 'emma_d', avatar: '/images/user3.jpg' },
      { name: 'Alex Rivera', username: 'alex_r', avatar: '/images/user4.jpg' }
    ];

    const contents = [
      "Just had the most amazing coffee date! ☕ Sometimes the best connections happen over simple conversations.",
      "Hiking this morning reminded me why I love being outdoors. Nature has a way of putting everything in perspective. 🏔️",
      "Cooking class was so much fun today! Made some new friends and learned to make the perfect pasta. 👨‍🍳",
      "Finally finished reading that book everyone's been talking about. Totally worth the hype! 📚",
      "Weekend farmer's market finds! Nothing beats fresh, local produce. 🥕🥬",
      "Movie night with friends was exactly what I needed. Good friends and good films never disappoint. 🎬"
    ];

    return Array.from({ length: count }, (_, index) => ({
      id: Date.now() + index + Math.random(),
      author: authors[Math.floor(Math.random() * authors.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      type: postTypes[Math.floor(Math.random() * postTypes.length)],
      images: Math.random() > 0.6 ? ['/images/post1.jpg'] : [],
      location: Math.random() > 0.7 ? 'Dallas, TX' : null,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      shares: Math.floor(Math.random() * 10),
      isLiked: Math.random() > 0.7,
      isBookmarked: Math.random() > 0.8,
      views: Math.floor(Math.random() * 200),
      visibility: 'public'
    }));
  };

  const handlePostAction = async (postId, action, data = null) => {
    try {
      switch (action) {
        case 'like':
          setPosts(prev => prev.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1
              };
            }
            return post;
          }));
          break;
          
        case 'bookmark':
          setPosts(prev => prev.map(post => {
            if (post.id === postId) {
              return { ...post, isBookmarked: !post.isBookmarked };
            }
            return post;
          }));
          break;
          
        case 'share':
          setPosts(prev => prev.map(post => {
            if (post.id === postId) {
              return { ...post, shares: post.shares + 1 };
            }
            return post;
          }));
          break;
          
        case 'comment':
          setSelectedPost(postId);
          setShowComments(true);
          break;
          
        case 'report':
          // Handle report functionality
          console.log('Report post:', postId);
          break;
          
        case 'delete':
          setPosts(prev => prev.filter(post => post.id !== postId));
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling post action:', error);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="activity-feed">
        <div className="feed-header">
          <h2>Activity Feed</h2>
        </div>
        <div className="feed-content">
          {Array.from({ length: 3 }, (_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      {/* Feed Header */}
      <div className="feed-header">
        <div className="feed-title">
          <h2>Activity Feed</h2>
          <p>Stay connected with the community</p>
        </div>
        
        {feedType === 'public' && (
          <button 
            className="create-post-button"
            onClick={() => setShowCreatePost(true)}
          >
            <FiEdit3 />
            Create Post
          </button>
        )}
      </div>

      {/* Feed Filters */}
      <div className="feed-filters">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-button ${filter === option.value ? 'active' : ''}`}
            onClick={() => setFilter(option.value)}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleNewPost}
        />
      )}

      {/* Feed Content */}
      <div className="feed-content">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <FiHeart className="empty-icon" />
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
            <button 
              className="create-first-post"
              onClick={() => setShowCreatePost(true)}
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onAction={handlePostAction}
                getTimeAgo={getTimeAgo}
                isUserOnline={isUserOnline}
              />
            ))}

            {/* Load More Trigger */}
            {hasMore && (
              <div ref={observerRef} className="load-more-trigger">
                {loadingMore && (
                  <div className="loading-more">
                    <LoadingSpinner size="small" text="Loading more posts..." />
                  </div>
                )}
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="end-of-feed">
                <p>You've seen all the posts!</p>
                <button 
                  className="refresh-feed"
                  onClick={() => loadPosts(true)}
                >
                  Refresh Feed
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Comments Modal */}
      {showComments && selectedPost && (
        <Comments
          postId={selectedPost}
          onClose={() => {
            setShowComments(false);
            setSelectedPost(null);
          }}
        />
      )}

      {/* Feed Stats (for premium users) */}
      {user?.membershipType !== 'free' && (
        <div className="feed-stats">
          <div className="stats-card">
            <h4>Your Engagement</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <FiEye className="stat-icon" />
                <span className="stat-value">1.2k</span>
                <span className="stat-label">Views</span>
              </div>
              <div className="stat-item">
                <FiHeart className="stat-icon" />
                <span className="stat-value">89</span>
                <span className="stat-label">Likes</span>
              </div>
              <div className="stat-item">
                <FiMessageCircle className="stat-icon" />
                <span className="stat-value">34</span>
                <span className="stat-label">Comments</span>
              </div>
              <div className="stat-item">
                <FiShare2 className="stat-icon" />
                <span className="stat-value">12</span>
                <span className="stat-label">Shares</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;