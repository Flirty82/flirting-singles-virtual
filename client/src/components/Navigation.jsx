// client/src/components/Navigation.jsx
import React, { useState } from 'react';

const Navigation = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo" onClick={() => handleNavClick('home')}>
          💕 LoveConnect
        </div>
        
        {/* Desktop Navigation */}
        <ul className={`nav-links ${mobileMenuOpen ? 'nav-links-mobile' : ''}`}>
          <li>
            <a href="#" onClick={() => handleNavClick('home')} 
               className={currentPage === 'home' ? 'active' : ''}>
              Home
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
              Contact
            </a>
          </li>
          
          {user && (
            <>
              <li>
                <a href="#" onClick={() => handleNavClick('feed')}
                   className={currentPage === 'feed' ? 'active' : ''}>
                  Feed
                </a>
              </li>
              <li>
                <a href="#" onClick={() => handleNavClick('chat')}
                   className={currentPage === 'chat' ? 'active' : ''}>
                  Chat
                </a>
              </li>
              <li>
                <a href="#" onClick={() => handleNavClick('bingo')}
                   className={currentPage === 'bingo' ? 'active' : ''}>
                  Bingo
                </a>
              </li>
              <li>
                <a href="#" onClick={() => handleNavClick('karaoke')}
                   className={currentPage === 'karaoke' ? 'active' : ''}>
                  Karaoke
                </a>
              </li>
            </>
          )}
        </ul>

        {/* Auth Buttons */}
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
              <div className="user-avatar" onClick={() => handleNavClick('profile')}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
              <button className="btn btn-secondary" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;