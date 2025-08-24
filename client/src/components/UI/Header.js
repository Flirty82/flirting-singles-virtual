// frontend/src/components/layout/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiUser, 
  FiMessageCircle, 
  FiBell, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
  FiVideo,
  FiCrown
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, getUnreadCount, markNotificationAsRead } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        navigate(`/messages/${notification.data.senderId}`);
        break;
      case 'like':
        navigate(`/profile/${notification.data.likerId}`);
        break;
      case 'match':
        navigate(`/matches`);
        break;
      case 'visit':
        navigate(`/profile/visits`);
        break;
      default:
        break;
    }
    
    setIsNotificationsOpen(false);
  };

  const getMembershipBadge = (membershipType) => {
    switch (membershipType) {
      case 'gold':
        return <FiCrown className="membership-badge gold" title="Gold Member" />;
      case 'platinum':
        return <FiCrown className="membership-badge platinum" title="Platinum Member" />;
      case 'diamond':
        return <FiCrown className="membership-badge diamond" title="Diamond Member" />;
      default:
        return null;
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <FiHeart className="brand-icon" />
            <span className="brand-text">FlirtingSingles</span>
          </Link>
        </div>

        {/* Main Navigation - Desktop */}
        <nav className="main-nav desktop-nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/services" className={`nav-link ${isActive('/services')}`}>
            Services
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
            Contact
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/virtual-dating" className={`nav-link ${isActive('/virtual-dating')}`}>
                <FiVideo className="nav-icon" />
                Virtual Dating
              </Link>
            </>
          )}
        </nav>

        {/* Search Bar */}
        {isAuthenticated && (
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <FiSearch />
              </button>
            </form>
          </div>
        )}

        {/* User Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="notification-container" ref={notificationsRef}>
                <button
                  className="notification-button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  aria-label="Notifications"
                >
                  <FiBell />
                  {getUnreadCount() > 0 && (
                    <span className="notification-badge">{getUnreadCount()}</span>
                  )}
                </button>
                
                {isNotificationsOpen && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <span className="notification-count">{getUnreadCount()} unread</span>
                    </div>
                    <div className="notifications-list">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="notification-icon">
                              {notification.type === 'message' && <FiMessageCircle />}
                              {notification.type === 'like' && <FiHeart />}
                              {notification.type === 'match' && <FiHeart className="match-icon" />}
                              {notification.type === 'visit' && <FiUser />}
                            </div>
                            <div className="notification-content">
                              <h4>{notification.title}</h4>
                              <p>{notification.message}</p>
                              <span className="notification-time">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 10 && (
                      <div className="notifications-footer">
                        <Link to="/notifications" onClick={() => setIsNotificationsOpen(false)}>
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Messages Link */}
              <Link to="/messages" className="header-icon-link" aria-label="Messages">
                <FiMessageCircle />
              </Link>

              {/* Profile Dropdown */}
              <div className="profile-dropdown-container" ref={profileDropdownRef}>
                <button
                  className="profile-button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  aria-label="Profile Menu"
                >
                  <div className="profile-avatar">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.firstName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                    )}
                    {getMembershipBadge(user.membershipType)}
                  </div>
                  <span className="profile-name">{user.firstName}</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="user-info">
                        <h4>{user.firstName} {user.lastName}</h4>
                        <p>@{user.username}</p>
                        <span className={`membership-status ${user.membershipType}`}>
                          {user.membershipType.charAt(0).toUpperCase() + user.membershipType.slice(1)} Member
                        </span>
                      </div>
                    </div>
                    
                    <div className="dropdown-menu">
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FiUser />
                        My Profile
                      </Link>
                      
                      <Link 
                        to="/settings" 
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FiSettings />
                        Settings
                      </Link>
                      
                      {user.membershipType === 'free' && (
                        <Link 
                          to="/membership" 
                          className="dropdown-item upgrade-link"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <FiCrown />
                          Upgrade Membership
                        </Link>
                      )}
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        <FiLogOut />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Not authenticated - show login/register buttons
            <div className="auth-buttons">
              <Link to="/login" className="auth-button login-button">
                Login
              </Link>
              <Link to="/register" className="auth-button register-button">
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          <nav className="mobile-nav-menu">
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`mobile-nav-link ${isActive('/services')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className={`mobile-nav-link ${isActive('/contact')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`mobile-nav-link ${isActive('/dashboard')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/virtual-dating" 
                  className={`mobile-nav-link ${isActive('/virtual-dating')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Virtual Dating
                </Link>
                <div className="mobile-nav-divider"></div>
                
                {!isAuthenticated && (
                  <>
                    <Link 
                      to="/login" 
                      className="mobile-nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="mobile-nav-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Join Now
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="mobile-nav-divider"></div>
                <Link 
                  to="/login" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Now
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;