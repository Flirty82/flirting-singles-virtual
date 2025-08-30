import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ currentPage, setCurrentPage, user, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = (page) => {
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    return (
        <div className="navbar">
            <div className="nav-content">
                <div className="logo" onClick={() => handleNavClick('welcome')}>
                    Flirting Singles
                </div>

                {/*Desktop Navigation*/}

                    <li>
                        <a href="#" onClick={() => handleNavClick('welcome')}
                        className={currentPage === 'welcome' ? 'active' : ''}>
                            Welcome
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleNavClick('memberships')}
                        className={currentPage === 'memberships' ? 'active' : ''}>
                            Memberships
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleNavClick('contact')}
                        className={currentPage === 'contact' ? 'active' : ''}>
                            Contact us
                        </a>
                    </li>

                    {user && (
                        <>
                           <li>
                            <a href="#" onClick={() => handleNavClick('discover')}
                            className={currentPage === 'discover' ? 'active' : ''}>
                                Discover
                            </a>
                           </li>
                           <li>
                            <a href="#" onClick={() => handleNavClick('feed')}
                            className={currentPage === 'activity-feed' ? 'active' : ''}>
                                Activity Feed
                            </a>
                           </li>
                           <li>
                            <a href="#" onClick={() => handleNavClick('chat')}
                            className={currentPage === 'chat-page' ? 'active' : ''}>
                                Chat
                            </a>
                           </li>
                           <li>
                            <a href="#" onClick={() => handleNavClick('bingo')}
                            className={currentPage === 'bingo-page' ? 'active' : ''}>
                                Bingo
                            </a>
                           </li>
                           <li>
                            <a href="#" onClick={() => handleNavClick('karaoke')}
                            className={currentPage === 'karaoke-page' ? 'active' : ''}>
                                Karaoke
                            </a>
                           </li>
                        </>
                    )}


                    {/*Auth Buttons*/}
                    <div className="auth-buttons">
                        {!user ? (
                            <>
                              <button 
                                className="btn btn-secondary"
                                onClick={() => handleNavClick('login')}
                            >
                                Login
                            </button>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleNavClick('signup')}
                            >
                                Sign Up
                            </button>
                            </>
                        ) : (
                            <div className="user-menu">
                                <div className="user-profilePicture" onClick={() => handleNavClick('profile')}>
                                    <img src={user.profilePicture} alt={user.name}/>
                                    <span>{user.firstName || user.name}</span>
                                    <span className={'membership-badge ${user.membership'}>
                                        {user.membership?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <button className="btn btn-secondary" onClick={onLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/*Mobile Menu Button*/}
                    <button
                      className="mobile-menu-button"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                
            </div>
        </div>
    );
};

export default Navigation;