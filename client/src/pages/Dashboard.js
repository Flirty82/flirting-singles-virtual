/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Favorite,
  Visibility,
  Message,
  TrendingUp,
  People,
  Event,
  Star,
  ArrowForward,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ActivityFeed from '../components/social/ActivityFeed';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    profileViews: 234,
    likes: 89,
    matches: 12,
    messages: 45
  });
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [upcomingDates, setUpcomingDates] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    // Simulate fetching data
    setRecentVisitors([
      { id: 1, name: 'Sarah J.', avatar: null, time: '2 hours ago', membershipLevel: 'gold' },
      { id: 2, name: 'Emily D.', avatar: null, time: '5 hours ago', membershipLevel: 'platinum' },
      { id: 3, name: 'Jessica M.', avatar: null, time: '1 day ago', membershipLevel: 'free' }
    ]);

    setSuggestedMatches([
      { id: 1, name: 'Amanda K.', age: 26, location: 'New York', matchPercent: 92, avatar: null },
      { id: 2, name: 'Nicole S.', age: 29, location: 'Brooklyn', matchPercent: 88, avatar: null },
      { id: 3, name: 'Rachel B.', age: 27, location: 'Manhattan', matchPercent: 85, avatar: null }
    ]);

    setUpcomingDates([
      { id: 1, name: 'Virtual Bingo Night', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), type: 'bingo' },
      { id: 2, name: 'Karaoke Party', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), type: 'karaoke' }
    ]);
  };

  const StatCard = ({ icon, title, value, color, trend }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}.light`, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
          </Box>
          {trend && (
            <Chip
              label={`+${trend}%`}
              size="small"
              color="success"
              icon={<TrendingUp />}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.displayName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your profile today
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Visibility />}
            title="Profile Views"
            value={stats.profileViews}
            color="primary"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Favorite />}
            title="Likes"
            value={stats.likes}
            color="error"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People />}
            title="Matches"
            value={stats.matches}
            color="success"
            trend={15}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Message />}
            title="Messages"
            value={stats.messages}
            color="info"
            trend={23}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Your Activity Feed</Typography>
            <ActivityFeed userId={user?.uid} />
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Profile Completion */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Profile Completion</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">75% Complete</Typography>
                <Typography variant="body2" color="text.secondary">Add photos to reach 100%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
            <Button variant="outlined" fullWidth onClick={() => navigate('/profile')}>
              Complete Profile
            </Button>
          </Paper>

          {/* Recent Visitors */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Recent Visitors</Typography>
              <Button size="small" endIcon={<ArrowForward />}>See All</Button>
            </Box>
            <List>
              {recentVisitors.map((visitor) => (
                <ListItem key={visitor.id} button onClick={() => navigate(`/profile/${visitor.id}`)}>
                  <ListItemAvatar>
                    <Avatar src={visitor.avatar}>{visitor.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={visitor.name}
                    secondary={visitor.time}
                  />
                  <Chip
                    label={visitor.membershipLevel}
                    size="small"
                    className={`membership-badge ${visitor.membershipLevel}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Suggested Matches */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Suggested Matches</Typography>
            {suggestedMatches.map((match) => (
              <Card key={match.id} sx={{ mb: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={match.avatar} sx={{ mr: 2, width: 56, height: 56 }}>
                    {match.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">{match.name}, {match.age}</Typography>
                    <Typography variant="body2" color="text.secondary">{match.location}</Typography>
                    <Chip
                      label={`${match.matchPercent}% Match`}
                      size="small"
                      color="success"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/profile/${match.id}`)}>
                    View Profile
                  </Button>
                  <Button size="small" color="secondary">Send Flirt</Button>
                </CardActions>
              </Card>
            ))}
          </Paper>

          {/* Upcoming Events */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
            <List>
              {upcomingDates.map((event) => (
                <ListItem key={event.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <Event />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={event.name}
                    secondary={event.date.toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;