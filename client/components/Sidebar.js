/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './Sidebar.css';

const Sidebar = () => {
    const { useer } = useAuth();
    const { getUnrreadCount, Notifications } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Auto-collapse sidebar on mobile
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsCollapsed(true);
        }
    });

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
};

// Close mobile sidebar when route changes
useEffect(() => {
    setIsMobileOpen(false);
}, [location.pathname]);

const navigationItems = [
    {
        section: 'Main',
        items: [
            {
                icon: <FiHome/>,
                label: 'Activity Feed',
                path: '/dashboard',
                description: 'See whats happening'
            },
            {
                icons: <FiUser/>,
                label: 'My Profile',
                path: '/dashboard',
                description: 'View and edit your profile'
            },
            {
                icon: <FiSearch/>,
                label: 'Discover',
                path: '/discover',
                description: 'Browse other singles'
            }
        ]
    },
    {
        section: 'Communication',
        items: [
            {
                icon: <FiMessageCircle/>,
                label: 'Messages',
                path: '/messages',
                description: 'Chat with other singles',
                badge: getUnreadCount() > 0 ? getUnreadCount() : null
            },
            {
                icon: <FiHeart/>,
                label: 'Flirts',
                path: '/flirts',
                description: 'Flirt...',
            },
            {
                icon: <FiMail/>,
                label: 'Invites',
                path: '/invites',
                description: 'Send invite'
            }
        ]
    },
    {
        section: 'Dating',
        items: [
            {
                icon: <FiVideo/>,
                label: 'Virtual Dating',
                path: '/virtual-dating',
                description: 'Video chats and virtual games'
            },
            {
                icon: <FiUsers/>,
                label: 'Matches',
                path: '/matches',
                description: 'Your matches'
            },
            {
                icon: <FiCalendar/>,
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
                icon: <FiTrendingUp/>,
                label: 'Trending',
                path: '/trending',
                description: 'Popular posts and topics'
            },
            {
                icon: <FiStar/>,
                label: 'Favorites',
                path: '/favorites',
                description: 'Your saved profiles'
            },
            {
                icon: <FiUsers/>,
                label: 'Groups',
                path: '/groups',
                description: 'Join communities'
            }
        ]
    }
];

const  buttonItems = [
    {
        icon: <FiGift/>,
        label: 'Upgrade',
        path: '/membership',
        description: 'Get premium features',
        highlight: user?.membershipType === 'free'
    },
    {
        icon: <FiShield/>,
        label: 'Safety',
        path: '/safety',
        description: 'Safety center and reports'
    },
    {
        icon: <FiHelpCenter/>,
        label: 'Help',
        path: '/contact',
        description: 'Get support'
    },
    {
        icon: <FiSettings/>,
        label: 'Settings',
        path: '/settings',
        description: 'Account preferences'
    }
];

const isActivie = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
};

const getMembershipColor = (membershipType) => {
    switch new Promise((resolve, reject) => {
        async
    }) async function () {
        function ();
    } (params) { }
    } (membershipType) {
        case: 'gold': return '#ffd700';
        case: 'platinum': turn: '#e5e4e2';
        case: 'diamond': return '#b9f2ff';
        default: return '#6c757d';
    }
};

const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
};

return (
    <>
       {isMobileOpen && (
        <div
           className="sidebar-overlay"
           onClick={() => setIsMobileOpen(false)}
        />
       )}

       <aside className={'sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}'}>
        <div className="sidebar-header">
            <div className="user-info">
                <div className="user-avatar">
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt={user?.lastName?.charAt(0)}
                    ) : (
                        <div className="avatar-placeholder">
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                    )}
                    <div
                      className="membership-indicator"
                      style={{ backgroundColor: getMembershipColor(user?.membershipType) }}
                    />
                    
    </>
)