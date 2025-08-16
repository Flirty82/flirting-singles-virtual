import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs
} from '@mui/material';
import {
  VideoCall,
  VideocamOff,
  Mic,
  MicOff,
  ScreenShare,
  StopScreenShare,
  CallEnd,
  Chat,
  SportsEsports,
  MusicNote,
  Settings,
  People
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import VirtualBingo from '../../components/games/VirtualBingo';
import VirtualKaraoke from '../components/games/VirtualKaraoke';
import io from 'socket.io-client';

const VirtualDating = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showActivityPicker, setShowActivityPicker] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  const activities = [
    { id: 'bingo', name: 'Virtual Bingo', icon: <SportsEsports />, description: 'Play bingo together!' },
    { id: 'karaoke', name: 'Virtual Karaoke', icon: <MusicNote />, description: 'Sing your hearts out!' },
    { id: 'trivia', name: 'Trivia Night', icon: <SportsEsports />, description: 'Test your knowledge!' },
    { id: 'movie', name: 'Watch Party', icon: <VideoCall />, description: 'Watch movies together!' }
  ];

  useEffect(() => {
    // Initialize socket and WebRTC
    const newSocket = io(process.env.REACT_APP_SERVER_URL);
    setSocket(newSocket);

    // Check if navigating from profile
    if (location.state?.partnerId) {
      startVideoCall(location.state.partnerId);
    }

    initializeMediaDevices();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      newSocket.disconnect();
    };
  }, [location]);

  const initializeMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const startVideoCall = async (partnerId) => {
    // WebRTC implementation would go here
    console.log('Starting video call with:', partnerId);
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        // Replace video track with screen share
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      // Stop screen sharing
      setIsScreenSharing(false);
    }
  };

  const endCall = () => {
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setCurrentRoom(null);
  };

  const selectActivity = (activity) => {
    setSelectedActivity(activity);
    setShowActivityPicker(false);
    setActiveTab(1); // Switch to activity tab
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Virtual Dating Room</Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Video Date" icon={<VideoCall />} />
        <Tab label="Activities" icon={<SportsEsports />} />
        <Tab label="Chat" icon={<Chat />} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Video Area */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
              <Grid container spacing={2}>
                {/* Remote Video */}
                <Grid item xs={12} md={currentRoom ? 8 : 12}>
                  <Box className="video-container" sx={{ position: 'relative', paddingTop: '56.25%' }}>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#000',
                        borderRadius: 8
                      }}
                    />
                    {!currentRoom && (
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        color: 'white'
                      }}>
                        <People sx={{ fontSize: 80, opacity: 0.5, mb: 2 }} />
                        <Typography variant="h5" sx={{ opacity: 0.7 }}>
                          Waiting for your date to join...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Local Video */}
                {currentRoom && (
                  <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'relative' }}>
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{
                          width: '100%',
                          borderRadius: 8,
                          backgroundColor: '#000'
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          color: 'white',
                          bgcolor: 'rgba(0,0,0,0.5)',
                          px: 1,
                          borderRadius: 1
                        }}
                      >
                        You
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Controls */}
              <Box className="video-controls" sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <IconButton
                  onClick={toggleVideo}
                  sx={{ bgcolor: isVideoOn ? 'primary.main' : 'error.main', color: 'white' }}
                >
                  {isVideoOn ? <VideoCall /> : <VideocamOff />}
                </IconButton>
                <IconButton
                  onClick={toggleAudio}
                  sx={{ bgcolor: isAudioOn ? 'primary.main' : 'error.main', color: 'white' }}
                >
                  {isAudioOn ? <Mic /> : <MicOff />}
                </IconButton>
                <IconButton
                  onClick={toggleScreenShare}
                  sx={{ bgcolor: isScreenSharing ? 'warning.main' : 'grey.700', color: 'white' }}
                >
                  {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>
                <IconButton
                  onClick={endCall}
                  sx={{ bgcolor: 'error.main', color: 'white' }}
                >
                  <CallEnd />
                </IconButton>
                <IconButton sx={{ bgcolor: 'grey.700', color: 'white' }}>
                  <Settings />
                </IconButton>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Quick Activities</Typography>
              <List>
                {activities.slice(0, 3).map((activity) => (
                  <ListItem
                    key={activity.id}
                    button
                    onClick={() => selectActivity(activity)}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {activity.icon}
                    </Avatar>
                    <ListItemText
                      primary={activity.name}
                      secondary={activity.description}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setShowActivityPicker(true)}
                sx={{ mt: 1 }}
              >
                Browse All Activities
              </Button>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Date Info</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Duration" secondary="00:15:32" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Connection" secondary="Excellent" />
                  <Chip label="HD" size="small" color="success" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          {selectedActivity ? (
            <>
              {selectedActivity.id === 'bingo' && (
                <VirtualBingo roomId={currentRoom} participants={participants} />
              )}
              {selectedActivity.id === 'karaoke' && (
                <VirtualKaraoke roomId={currentRoom} participants={participants} />
              )}
              <Button
                variant="outlined"
                onClick={() => setSelectedActivity(null)}
                sx={{ mt: 2 }}
              >
                Choose Different Activity
              </Button>
            </>
          ) : (
            <Grid container spacing={3}>
              {activities.map((activity) => (
                <Grid item xs={12} sm={6} md={3} key={activity.id}>
                  <Card
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => selectActivity(activity)}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ width: 80, height: 80, margin: '0 auto', mb: 2, bgcolor: 'primary.main' }}>
                        {activity.icon}
                      </Avatar>
                      <Typography variant="h6">{activity.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3, height: 500 }}>
          <Typography variant="h6" gutterBottom>Chat</Typography>
          {/* Chat implementation */}
        </Paper>
      )}

      {/* Activity Picker Dialog */}
      <Dialog
        open={showActivityPicker}
        onClose={() => setShowActivityPicker(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Choose an Activity</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {activities.map((activity) => (
              <Grid item xs={12} sm={6} key={activity.id}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => selectActivity(activity)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {activity.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{activity.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowActivityPicker(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VirtualDating;