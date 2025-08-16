import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOutUser } from '../../services/auth';
import Avatar from '../UI/Avatar';
import Button from '../UI/Button';
import './Navbar.css';

const Navbar = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { currentUser, userProfile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(fasle);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await signOutUser();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: '/dashbaord', label: 'Feed', icon: '' },
        { path: '/messages', label: 'Messages', icon: '' },
        { path: 'profile', label: 'Profile', icon: '' },
        { path: 'settings', label: 'Settings', icon: '' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/*Logo*/}
                <Link to="/dashboard" className="navbar-logo">
                <span className="logo-icon">FS</span>
                <span className="logo-text">Flirting Singles</span>
                </Link>
                {*/DesktopNavigation*/}
                <div className="navbar-nav desktop-nav">
                    {navItems.map((item) => (
                        <Link
                           key={item.path}
                           to={item.path}
                           className={'nav-link ${isActivePath(item.path) ? 'active' : ''}'}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/*Search Bar*/}
                <div className="navbar-search">
                    <input
                       type="text"
                       placeholder="Search"
                       className="search-input"
                    />
                    <button className="search-button">
                        Search
                    </button>
            </div>

            {/*Profile Menu*/}
            <div className="navbar-profile" ref={profileMenuRef}>
                <button
                  className="profile-button"
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                >
                    <Avatar
                       src={userProfile?.photoURL}
                       alt={userProfile?.displayName || currentUser?.email}
                       size="small"
                       online={userProfile?.isOnline}
                    />
                    <span className="profile-name">
                        {userProfile?.displayName || 'User'}
                    </span>
                </button>

                {isProifleMenuOpen && (
                    <div className="profile-dropdown">
                        <div className="dropdown-header">
                            <Avatar
                               src={userProfile?.photoURL}
                               alt={userProfile?.displayName || currentUser?.email}
                               size="medium"
                            />
                            <div className="dropdown-user-info">
                                <div className="dropdown-name">
                                    {userProfile?.displayName || 'User'}
                                </div>
                                <div className="dropwdown-email">
                                    {currentUser?.email}
                                </div>
                            </div>
                        </div>

                        <div className="dropdown-divider"></div>

                            <Link
                               to="/profile"
                               className="dropdown-item"
                               onClick={() => setIsProfileMenuOpen(false)}
                            >
                                <span className="dropdown-icon">
                                </span>
                                View Profile
                            </Link>

                            <Link
                               to="/settings"
                               className="dropdown-item"
                               onClick={() => setIsProfileMenuOpen(false)}
                            >
                                <span className="dropdown-icon"></span>
                                Settings 
                            </Link>
                            
                            <div className="dropdown-divider"></div>

                            <button
                               className="dropdown-item sign-out"
                               onClick={handleSignOut}
                            >
                                <span className="dropdown-icon"></span>
                                Sign Out
                            </button>
                        </div>
                )}
            </div>

            {/*Mobile Menu Button*/}
            <button
                className="mobile-menu-button"
                onClick={() => setIsProfileMenuOpen(!isProifleMenuOpen)}
            >
                <span className={'hamburger ${isMobileMenuOpen ? 'open' : ''}'}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
            </button>
            </div>

            {/*Mobile Navigation*/}
            {isMobileMenuOpen && (
                <div className="mobile-nav">
                    <div className="mobile-nav-content">
                        {navItems.map((item) => (
                            <Link 
                                key={item.path}
                                to={item.path}
                                className={'mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}'}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="mobile-nav-icon">{item.icon}</span>
                                <span className="mobile-nav-label">{item.label}</span>
                            </Link>
                        ))}

                        <div className="mobile-nav-divider"></div>
                        <button 
                           className="mobile-nav-link mobile-nav-signout"
                           onClick={handleSignuOut}
                        >
                            <span className="mobile-nav-icon"></span>
                            <span className="mobile-nav-label">Sign Out</span>
                            </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;