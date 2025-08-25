import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const ChatPage = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState('Sarah M.');
  const [messages, setMessages] = useState({
    'Sarah M.': [
      { id: 1, text: 'Hey! How are you doing?', sent: false, time: '2:30 PM' },
      { id: 2, text: 'I\'m doing great! Thanks for asking 😊', sent: true, time: '2:32 PM' },
      { id: 3, text: 'Would you like to join virtual bingo tonight?', sent: false, time: '2:35 PM' }
    ],
    'Mike R.': [
      { id: 1, text: 'That karaoke session was amazing!', sent: false, time: '1:15 PM' },
      { id: 2, text: 'Yes! We should do it again soon!', sent: true, time: '1:18 PM' }
    ],
    'Virtual Bingo Room': [
      { id: 1, text: 'Welcome to tonight\'s bingo game! 🎲', sent: false, time: '8:00 PM' },
      { id: 2, text: 'Game starts in 5 minutes!', sent: false, time: '8:25 PM' }
    ]
  });
  const [newMessage, setNewMessage] = useState('');

  const chats = [
    { name: 'Sarah M.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah', online: true, lastMessage: 'Would you like to join virtual bingo tonight?' },
    { name: 'Mike R.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mike', online: false, lastMessage: 'That karaoke session was amazing!' },
    { name: 'Emma L.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Emma', online: true, lastMessage: 'Thanks for the music recommendation!' },
    { name: 'Virtual Bingo Room', avatar: '🎲', online: true, lastMessage: 'Game starts in 5 minutes!', isGroup: true },
    { name: 'Karaoke Lounge', avatar: '🎤', online: true, lastMessage: 'Next song requests?', isGroup: true }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), message]
      }));
      setNewMessage('');
    }
  };

  return (
    <div className="container">
      <div className="chat-header">
        <h1>Messages & Chat Rooms</h1>
      </div>
      
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-search">
            <input type="text" placeholder="Search conversations..." />
          </div>
          <div className="chat-list">
            {chats.map((chat, index) => (
              <div 
                key={index} 
                className={`chat-item ${activeChat === chat.name ? 'active' : ''}`}
                onClick={() => setActiveChat(chat.name)}
              >
                <div className="chat-avatar">
                  {chat.isGroup ? (
                    <span className="group-icon">{chat.avatar}</span>
                  ) : (
                    <img src={chat.avatar} alt={chat.name} />
                  )}
                  {chat.online && !chat.isGroup && <div className="online-indicator"></div>}
                </div>
                <div className="chat-info">
                  <div className="chat-name">{chat.name}</div>
                  <div className="chat-last-message">{chat.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chat-main">
          <div className="chat-header-main">
            <h3>{activeChat}</h3>
            <div className="chat-actions">
              <button className="btn-icon">📞</button>
              <button className="btn-icon">📹</button>
              <button className="btn-icon">ℹ️</button>
            </div>
          </div>
          
          <div className="chat-messages">
            {(messages[activeChat] || []).map(message => (
              <div key={message.id} className={`message ${message.sent ? 'sent' : 'received'}`}>
                <div className="message-content">{message.text}</div>
                <div className="message-time">{message.time}</div>
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <form onSubmit={handleSendMessage}>
              <div className="input-group">
                <button type="button" className="btn-icon">😊</button>
                <input 
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="button" className="btn-icon">📎</button>
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
