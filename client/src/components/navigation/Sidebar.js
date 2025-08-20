// frontend/src/components/layout/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome,
  FiUser,
  FiMessageCircle,
  FiHeart,
  FiMail,
  FiVideo,
  FiTrendingUp,
  FiSettings,
  FiUsers,
  FiCalendar,
  FiStar,
  FiGift,
  FiShield,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiSearch
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const { getUnreadCount, notifications } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    {
      section: 'Main',
      items: [
        {
          icon: <FiHome />,
          label: 'Activity Feed',
          path: '/dashboard',
          description: 'See what\'s happening'
        },
        {
          icon: <FiUser />,
          label: 'My Profile',
          path: '/profile',
          description: 'View and edit your profile'
        },
        {
          icon: <FiSearch />,
          label: 'Discover',
          path: '/discover',
          description: 'Find new connections'
        }
      ]
    },
    {
      section: 'Communication',
      items: [
        {
          icon: <FiMessageCircle />,
          label: 'Messages',
          path: '/messages',
          description: 'Chat with your matches',
          badge: getUnreadCount() > 0 ? getUnreadCount() : null
        },
        {
          icon: <FiHeart />,
          label: 'Flirts',
          path: '/flirts',
          description: 'Send and receive flirts'
        },
        {
          icon: <FiMail />,
          label: 'Invites',
          path: '/invites',
          description: 'Event and activity invites'
        }
      ]
    },
    {
      section: 'Dating',
      items: [
        {
          icon: <FiVideo />,
          label: 'Virtual Dating',
          path: '/virtual-dating',
          description: 'Video dates and meetups',
          premium: true
        },
        {
          icon: <FiUsers />,
          label: 'Matches',
          path: '/matches',
          description: 'Your mutual matches'
        },
        {
          icon: <FiCalendar />,
          label: 'Date Ideas',
          path: '/date-ideas',
          description: 'Plan your perfect date'
        }
      ]
    },
    {
      section: 'Social',
      items: [
        {
          icon: <FiTrendingUp />,
          label: 'Trending',
          path: '/trending',
          description: 'Popular posts and topics'
        },
        {
          icon: <FiStar />,
          label: 'Favorites',
          path: '/favorites',
          description: 'Your saved profiles'
        },
        {
          icon: <FiUsers />,
          label: 'Groups',
          path: '/groups',
          description: 'Join communities'
        }
      ]
    }
  ];

  const bottomItems = [
    {
      icon: <FiGift />,
      label: 'Upgrade',
      path: '/membership',
      description: 'Get premium features',
      highlight: user?.membershipType === 'free'
    },
    {
      icon: <FiShield />,
      label: 'Safety',
      path: '/safety',
      description: 'Safety center and reports'
    },
    {
      icon: <FiHelpCircle />,
      label: 'Help',
      path: '/help',
      description: 'Get support'
    },
    {
      icon: <FiSettings />,
      label: 'Settings',
      path: '/settings',
      description: 'Account preferences'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getMembershipColor = (membershipType) => {
    switch (membershipType) {
      case 'gold': return '#ffd700';
      case 'platinum': return '#e5e4e2';
      case 'diamond': return '#b9f2ff';
      default: return '#6c757d';
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.firstName} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
              )}
              <div 
                className="membership-indicator"
                style={{ backgroundColor: getMembershipColor(user?.membershipType) }}
              />
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <h3>{user?.firstName} {user?.lastName}</h3>
                <p>@{user?.username}</p>
                <span 
                  className="membership-badge"
                  style={{ color: getMembershipColor(user?.membershipType) }}
                >
                  {user?.membershipType?.charAt(0).toUpperCase() + user?.membershipType?.slice(1)} Member
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="nav-section">
              {!isCollapsed && (
                <div className="section-header">
                  <span className="section-title">{section.section}</span>
                </div>
              )}
              
              <ul className="nav-items">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? 'active' : ''} ${item.premium && user?.membershipType === 'free' ? 'premium-required' : ''}`}
                      title={isCollapsed ? item.label : item.description}
                    >
                      <div className="nav-icon">
                        {item.icon}
                        {item.premium && user?.membershipType === 'free' && (
                          <div className="premium-lock">
                            <FiStar size={8} />
                          </div>
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <div className="nav-content">
                          <span className="nav-label">{item.label}</span>
                          <span className="nav-description">{item.description}</span>
                        </div>
                      )}
                      
                      {item.badge && (
                        <div className="nav-badge">
                          {item.badge}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="sidebar-bottom">
          <ul className="nav-items">
            {bottomItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
                  title={isCollapsed ? item.label : item.description}
                >
                  <div className="nav-icon">
                    {item.icon}
                  </div>
                  
                  {!isCollapsed && (
                    <div className="nav-content">
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-description">{item.description}</span>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Profile Completion */}
          {!user?.profileCompleted && !isCollapsed && (
            <div className="profile-completion-card">
              <div className="completion-header">
                <FiUser className="completion-icon" />
                <h4>Complete Your Profile</h4>
              </div>
              <p>Add more details to get better matches</p>
              <Link to="/profile/setup" className="completion-button">
                Complete Profile
              </Link>
            </div>
          )}

          {/* Quick Stats */}
          {!isCollapsed && (
            <div className="quick-stats">
              <div className="stat-item">
                <FiHeart className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{user?.stats?.likesReceived || 0}</span>
                  <span className="stat-label">Likes</span>
                </div>
              </div>
              <div className="stat-item">
                <FiEye className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{user?.stats?.profileViews || 0}</span>
                  <span className="stat-label">Views</span>
                </div>
              </div>
              <div className="stat-item">
                <FiMessageCircle className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{user?.stats?.messagesReceived || 0}</span>
                  <span className="stat-label">Messages</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Notifications Preview */}
        {!isCollapsed && notifications.length > 0 && (
          <div className="sidebar-notifications">
            <div className="notifications-header">
              <FiBell className="notifications-icon" />
              <span>Recent Activity</span>
            </div>
            <div className="notifications-list">
              {notifications.slice(0, 3).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => navigate(notification.path || '/notifications')}
                >
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {notifications.length > 3 && (
              <Link to="/notifications" className="view-all-notifications">
                View all notifications
              </Link>
            )}
          </div>
        )}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle navigation menu"
      >
        <FiUser />
      </button>
    </>
  );
};

export default Sidebar;