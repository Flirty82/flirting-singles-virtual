import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Favorite as FavoriteIcon,
  CardMembership as MembershipIcon,
  ContactMail as ContactIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  VideoCall as VideoCallIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    handleMenuClose();
  };

  const navItems = [
    { title: 'Home', path: '/', icon: <HomeIcon /> },
    { title: 'Memberships', path: '/memberships', icon: <MembershipIcon /> },
    { title: 'Contact', path: '/contact', icon: <ContactIcon /> }
  ];

  const userMenuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { title: 'My Profile', path: '/profile', icon: <PersonIcon /> },
    { title: 'Messages', path: '/messages', icon: <MessageIcon /> },
    { title: 'Virtual Dating', path: '/virtual-dating', icon: <VideoCallIcon /> }
  ];

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 0,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              mr: 4,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FavoriteIcon sx={{ mr: 1 }} />
            Flirting Singles
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* User Section */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <IconButton
                color="inherit"
                onClick={handleNotificationOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Messages */}
              <IconButton
                color="inherit"
                component={Link}
                to="/messages"
              >
                <Badge badgeContent={5} color="error">
                  <MessageIcon />
                </Badge>
              </IconButton>

              {/* User Avatar & Menu */}
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0, ml: 1 }}
              >
                <Avatar
                  alt={user.displayName}
                  src={user.photoURL}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    border: user.membershipLevel === 'diamond' ? '2px solid #B9F2FF' :
                           user.membershipLevel === 'platinum' ? '2px solid #E5E4E2' :
                           user.membershipLevel === 'gold' ? '2px solid #FFD700' : 'none'
                  }}
                >
                  {user.displayName?.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {user.email}
                  </Typography>
                </MenuItem>
                <MenuItem disabled>
                  <span className={`membership-badge ${user.membershipLevel || 'free'}`}>
                    {user.membershipLevel || 'Free'} Member
                  </span>
                </MenuItem>
                <Divider />
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.title}
                    onClick={() => {
                      navigate(item.path);
                      handleMenuClose();
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    {item.title}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/register"
              >
                Sign Up
              </Button>
            </Box>
          )}

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <Typography variant="body2">Sarah liked your profile</Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="body2">You have a new match!</Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="body2">John sent you a flirt</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleNotificationClose}>
              View all notifications
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <FavoriteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                LoveConnect
              </Typography>
            </ListItem>
            <Divider />
            {navItems.map((item) => (
              <ListItem
                button
                key={item.title}
                component={Link}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
            {user && (
              <>
                <Divider />
                {userMenuItems.map((item) => (
                  <ListItem
                    button
                    key={item.title}
                    component={Link}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))}
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
