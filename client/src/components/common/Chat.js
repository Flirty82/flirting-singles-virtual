// client/src/components/common/Chat.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/components/Chat.css';

const Chat = ({ user, socket, currentRoom, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(currentRoom);
  const [privateChats, setPrivateChats] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  // Available chat rooms
  const chatRooms = [
    { id: 'general', name: 'General Chat', icon: '💬' },
    { id: 'games', name: 'Games', icon: '🎮' },
    { id: 'dating', name: 'Dating Hub', icon: '💕' },
    { id: 'help', name: 'Help & Support', icon: '❓' }
  ];

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Send message
  const sendMessage = useCallback((e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      userId: user.uid,
      userName: user.displayName,
      userAvatar: user.photoURL,
      room: selectedRoom,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
    setIsTyping(false);
    
    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('stop_typing', { room: selectedRoom, userId: user.uid });
  }, [newMessage, socket, user, selectedRoom]);

  // Handle typing indicator
  const handleTyping = useCallback((value) => {
    setNewMessage(value);
    
    if (!socket) return;

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      socket.emit('start_typing', { 
        room: selectedRoom, 
        userId: user.uid, 
        userName: user.displayName 
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', { room: selectedRoom, userId: user.uid });
    }, 1000);
  }, [socket, user, selectedRoom, isTyping]);

  // Start private chat
  const startPrivateChat = useCallback((targetUser) => {
    const chatId = [user.uid, targetUser.userId].sort().join('_');
    if (!privateChats.find(chat => chat.id === chatId)) {
      const newChat = {
        id: chatId,
        name: targetUser.userName,
        type: 'private',
        participants: [user.uid, targetUser.userId]
      };
      setPrivateChats(prev => [...prev, newChat]);
    }
    setSelectedRoom(chatId);
  }, [user.uid, privateChats]);

  // Join room
  const joinRoom = useCallback((roomId) => {
    if (socket && roomId !== selectedRoom) {
      socket.emit('leave_room', selectedRoom);
      socket.emit('join_room', roomId);
      setSelectedRoom(roomId);
      setMessages([]);
      
      // Mark room as read
      setUnreadCounts(prev => ({
        ...prev,
        [roomId]: 0
      }));
    }
  }, [socket, selectedRoom]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.room === selectedRoom) {
        setMessages(prev => [...prev, message]);
      } else {
        // Increment unread count for other rooms
        setUnreadCounts(prev => ({
          ...prev,
          [message.room]: (prev[message.room] || 0) + 1
        }));
      }
    };

    const handleUserTyping = (data) => {
      if (data.room === selectedRoom && data.userId !== user.uid) {
        setTypingUsers(prev => {
          if (!prev.find(u => u.userId === data.userId)) {
            return [...prev, data];
          }
          return prev;
        });
      }
    };

    const handleUserStoppedTyping = (data) => {
      setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const handleRoomHistory = (history) => {
      setMessages(history);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    socket.on('online_users', handleOnlineUsers);
    socket.on('room_history', handleRoomHistory);

    // Join initial room
    socket.emit('join_room', selectedRoom);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
      socket.off('online_users', handleOnlineUsers);
      socket.off('room_history', handleRoomHistory);
    };
  }, [socket, selectedRoom, user.uid]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get current room info
  const getCurrentRoomInfo = () => {
    const publicRoom = chatRooms.find(room => room.id === selectedRoom);
    if (publicRoom) return publicRoom;
    
    const privateChat = privateChats.find(chat => chat.id === selectedRoom);
    if (privateChat) return { ...privateChat, icon: '💌' };
    
    return { id: selectedRoom, name: 'Unknown Room', icon: '❓' };
  };

  const currentRoomInfo = getCurrentRoomInfo();

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">{currentRoomInfo.icon}</span>
          <span className="chat-name">{currentRoomInfo.name}</span>
        </div>
        <button onClick={onClose} className="chat-close-btn">✕</button>
      </div>

      <div className="chat-rooms">
        <div className="room-tabs">
          {chatRooms.map(room => (
            <button
              key={room.id}
              onClick={() => joinRoom(room.id)}
              className={`room-tab ${selectedRoom === room.id ? 'active' : ''}`}
            >
              <span className="room-icon">{room.icon}</span>
              <span className="room-name">{room.name}</span>
              {unreadCounts[room.id] > 0 && (
                <span className="unread-badge">{unreadCounts[room.id]}</span>
              )}
            </button>
          ))}
        </div>

        {privateChats.length > 0 && (
          <div className="private-chats">
            <h4>Private Chats</h4>
            {privateChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => joinRoom(chat.id)}
                className={`room-tab private ${selectedRoom === chat.id ? 'active' : ''}`}
              >
                <span className="room-icon">💌</span>
                <span className="room-name">{chat.name}</span>
                {unreadCounts[chat.id] > 0 && (
                  <span className="unread-badge">{unreadCounts[chat.id]}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.userId === user.uid ? 'own-message' : 'other-message'}`}
          >
            {message.userId !== user.uid && (
              <img
                src={message.userAvatar || '/default-avatar.png'}
                alt={message.userName}
                className="message-avatar"
              />
            )}
            <div className="message-content">
              {message.userId !== user.uid && (
                <div className="message-header">
                  <span className="message-author">{message.userName}</span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              )}
              <div className="message-text">{message.text}</div>
              {message.userId === user.uid && (
                <div className="message-time own-time">{formatTime(message.timestamp)}</div>
              )}
            </div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">
              {typingUsers.map(u => u.userName).join(', ')} 
              {typingUsers.length === 1 ? ' is' : ' are'} typing...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          ref={messageInputRef}
          type="text"
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder={`Message ${currentRoomInfo.name}...`}
          className="chat-input"
          maxLength={500}
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          ➤
        </button>
      </form>

      {selectedRoom !== 'general' && onlineUsers.length > 0 && (
        <div className="online-users">
          <h4>Online ({onlineUsers.length})</h4>
          <div className="users-list">
            {onlineUsers.map(onlineUser => (
              <div
                key={onlineUser.userId}
                className="online-user"
                onClick={() => startPrivateChat(onlineUser)}
              >
                <img
                  src={onlineUser.userAvatar || '/default-avatar.png'}
                  alt={onlineUser.userName}
                  className="online-user-avatar"
                />
                <span className="online-user-name">{onlineUser.userName}</span>
                <div className="online-indicator"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;