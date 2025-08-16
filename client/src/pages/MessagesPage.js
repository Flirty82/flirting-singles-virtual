/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Divider,
  InputAdornment,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  Search,
  MoreVert,
  VideoCall,
  Call,
  Delete,
  Block
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typing, setTyping] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL);
    setSocket(newSocket);

    // Join user room
    newSocket.emit('join-user-room', user?.uid);

    // Listen for new messages
    newSocket.on('new-message', (message) => {
      if (selectedConversation?.id === message.conversationId) {
        setMessages(prev => [...prev, message]);
      }
      // Update conversation list
      updateConversationList(message);
    });

    // Listen for typing indicators
    newSocket.on('user-typing', ({ userId, isTyping }) => {
      if (selectedConversation?.userId === userId) {
        setTyping(isTyping);
      }
    });

    fetchConversations();

    // Check if navigated from profile with recipient
    if (location.state?.recipientId) {
      // Open conversation with specific user
      openConversation(location.state.recipientId);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [user, location]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    // Simulate fetching conversations
    setConversations([
      {
        id: '1',
        userId: 'user1',
        name: 'Sarah Johnson',
        avatar: null,
        lastMessage: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        unread: 2,
        online: true,
        membershipLevel: 'gold'
      },
      {
        id: '2',
        userId: 'user2',
        name: 'Emily Davis',
        avatar: null,
        lastMessage: 'Would love to chat sometime!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unread: 0,
        online: false,
        membershipLevel: 'platinum'
      },
      {
        id: '3',
        userId: 'user3',
        name: 'Jessica Miller',
        avatar: null,
        lastMessage: 'Thanks for the flirt! 😊',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unread: 1,
        online: true,
        membershipLevel: 'diamond'
      }
    ]);
  };

  const fetchMessages = async (conversationId) => {
    // Simulate fetching messages
    setMessages([
      {
        id: '1',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        content: 'Hi there! I saw your profile and thought we might have a lot in common.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true
      },
      {
        id: '2',
        senderId: user?.uid,
        senderName: user?.displayName,
        content: 'Hi Sarah! Thanks for reaching out. What caught your attention?',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        read: true
      },
      {
        id: '3',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        content: 'I noticed we both love hiking and travel! Have you been anywhere interesting lately?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true
      },
      {
        id: '4',
        senderId: user?.uid,
        senderName: user?.displayName,
        content: 'Actually yes! Just got back from Colorado. The mountains were amazing!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true
      },
      {
        id: '5',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      }
    ]);
  };

  const openConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    // Mark messages as read
    setConversations(conversations.map(conv => 
      conv.id === conversation.id ? { ...conv, unread: 0 } : conv
    ));
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message = {
        id: Date.now().toString(),
        senderId: user?.uid,
        senderName: user?.displayName,
        recipientId: selectedConversation.userId,
        conversationId: selectedConversation.id,
        content: newMessage,
        timestamp: new Date(),
        read: false
      };

      socket.emit('private-message', {
        recipientId: selectedConversation.userId,
        message: newMessage,
        senderId: user?.uid
      });

      setMessages([...messages, message]);
      setNewMessage('');
      updateConversationList(message);
    }
  };

  const updateConversationList = (message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === message.conversationId) {
        return {
          ...conv,
          lastMessage: message.content,
          timestamp: message.timestamp,
          unread: conv.id !== selectedConversation?.id ? conv.unread + 1 : 0
        };
      }
      return conv;
    }));
  };

  const handleTyping = (isTyping) => {
    if (selectedConversation) {
      socket.emit('typing', {
        recipientId: selectedConversation.userId,
        isTyping
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ height: 'calc(100vh - 200px)', display: 'flex' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Conversations List */}
          <Grid item xs={12} md={4} sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            
            <List sx={{ overflow: 'auto', height: 'calc(100% - 72px)' }}>
              {filteredConversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  button
                  selected={selectedConversation?.id === conversation.id}
                  onClick={() => openConversation(conversation)}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      color={conversation.online ? 'success' : 'default'}
                    >
                      <Avatar
                        src={conversation.avatar}
                        sx={{
                          border: conversation.membershipLevel === 'diamond' ? '2px solid #B9F2FF' :
                                 conversation.membershipLevel === 'platinum' ? '2px solid #E5E4E2' :
                                 conversation.membershipLevel === 'gold' ? '2px solid #FFD700' : 'none'
                        }}
                      >
                        {conversation.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">{conversation.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" noWrap color="text.secondary">
                        {conversation.lastMessage}
                      </Typography>
                    }
                  />
                  {conversation.unread > 0 && (
                    <Chip
                      label={conversation.unread}
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Chat Area */}
          <Grid item xs={12} md={8}>
            {selectedConversation ? (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                  <Avatar src={selectedConversation.avatar} sx={{ mr: 2 }}>
                    {selectedConversation.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{selectedConversation.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {typing ? 'Typing...' : selectedConversation.online ? 'Online' : `Last seen ${formatDistanceToNow(selectedConversation.timestamp, { addSuffix: true })}`}
                    </Typography>
                  </Box>
                  <IconButton><VideoCall /></IconButton>
                  <IconButton><Call /></IconButton>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.senderId === user?.uid ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      <Box
                        className={`message-bubble ${message.senderId === user?.uid ? 'sent' : 'received'}`}
                        sx={{
                          maxWidth: '70%',
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: message.senderId === user?.uid ? 'primary.main' : 'grey.200',
                          color: message.senderId === user?.uid ? 'white' : 'text.primary'
                        }}
                      >
                        <Typography variant="body1">{message.content}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onFocus={() => handleTyping(true)}
                    onBlur={() => handleTyping(false)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton><AttachFile /></IconButton>
                          <IconButton><EmojiEmotions /></IconButton>
                          <IconButton color="primary" onClick={sendMessage}>
                            <Send />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>View Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Clear Chat</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Block User</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
            Delete Conversation
          </MenuItem>
        </Menu>
      </Paper>
    </Container>
  );
};
