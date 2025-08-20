// client/src/components/dating/VirtualDinner.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MembershipGate from '../common/MembershipGate';
import Instructions from '../common/Instructions';
import '../../styles/components/Dating.css';

const VirtualDinner = ({ user, socket }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [datePartner, setDatePartner] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [orderStatus, setOrderStatus] = useState('browsing'); // browsing, ordered, eating, finished
  const [conversationTopics, setConversationTopics] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // Check diamond membership
  if (user.membershipType !== 'diamond') {
    return (
      <MembershipGate feature="Virtual Dinner Dates">
        <div className="membership-required">
          <h2>💎 Diamond Membership Required</h2>
          <p>Virtual dinner dates are exclusive to Diamond members</p>
          <button onClick={() => navigate('/dating')} className="back-btn">
            ← Back to Dating Hub
          </button>
        </div>
      </MembershipGate>
    );
  }

  // Virtual restaurants
  const virtualRestaurants = [
    {
      id: 'italian_bistro',
      name: 'Romantic Italian Bistro',
      ambiance: 'Candlelit tables with soft jazz music',
      specialty: 'Authentic Italian cuisine',
      image: '/restaurants/italian-bistro.jpg',
      menu: [
        { id: 1, name: 'Spaghetti Carbonara', price: '$18', description: 'Creamy pasta with pancetta' },
        { id: 2, name: 'Margherita Pizza', price: '$16', description: 'Fresh mozzarella and basil' },
        { id: 3, name: 'Tiramisu', price: '$8', description: 'Classic Italian dessert' }
      ]
    },
    {
      id: 'french_cafe',
      name: 'Parisian Café',
      ambiance: 'Cozy café with street views',
      specialty: 'French pastries and coffee',
      image: '/restaurants/french-cafe.jpg',
      menu: [
        { id: 1, name: 'Croissant Benedict', price: '$14', description: 'Flaky croissant with poached eggs' },
        { id: 2, name: 'French Onion Soup', price: '$12', description: 'Rich broth with gruyere cheese' },
        { id: 3, name: 'Crème Brûlée', price: '$9', description: 'Vanilla custard with caramelized sugar' }
      ]
    },
    {
      id: 'sushi_bar',
      name: 'Zen Sushi Bar',
      ambiance: 'Minimalist design with bamboo accents',
      specialty: 'Fresh sushi and sake',
      image: '/restaurants/sushi-bar.jpg',
      menu: [
        { id: 1, name: 'Omakase Selection', price: '$45', description: "Chef's choice sushi selection" },
        { id: 2, name: 'Dragon Roll', price: '$16', description: 'Eel and avocado roll' },
        { id: 3, name: 'Mochi Ice Cream', price: '$7', description: 'Sweet rice cake dessert' }
      ]
    }
  ];

  // Conversation starters
  const dinnerTopics = [
    "What's your favorite cuisine and why?",
    "Tell me about the best meal you've ever had",
    "If you could have dinner with anyone, who would it be?",
    "What's your go-to comfort food?",
    "Do you enjoy cooking? What's your specialty?",
    "What's the most adventurous food you've tried?",
    "Coffee or tea person?",
    "Sweet or savory snacks?",
    "What's your ideal date night restaurant?",
    "Any food allergies or dietary preferences I should know about?"
  ];

  // Initialize video call
  const initializeVideoCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: videoEnabled, 
        audio: audioEnabled 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error initializing video call:', error);
      setConnectionStatus('error');
    }
  }, [videoEnabled, audioEnabled]);

  // Join dinner session
  useEffect(() => {
    if (socket && user && sessionId) {
      socket.emit('join_dinner_session', {
        sessionId,
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL
      });
    }
  }, [socket, user, sessionId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleSessionUpdate = (data) => {
      setSessionData(data.session);
      setDatePartner(data.partner);
      if (data.restaurant) setSelectedRestaurant(data.restaurant);
    };

    const handlePartnerJoined = (data) => {
      setDatePartner(data.partner);
      setConnectionStatus('partner_joined');
    };

    const handleRestaurantSelected = (data) => {
      setSelectedRestaurant(data.restaurant);
    };

    const handleOrderUpdate = (data) => {
      setOrderStatus(data.status);
    };

    const handleConversationTopic = (data) => {
      setConversationTopics(prev => [...prev, data.topic]);
    };

    socket.on('dinner_session_update', handleSessionUpdate);
    socket.on('dinner_partner_joined', handlePartnerJoined);
    socket.on('restaurant_selected', handleRestaurantSelected);
    socket.on('order_status_update', handleOrderUpdate);
    socket.on('conversation_topic_suggested', handleConversationTopic);

    return () => {
      socket.off('dinner_session_update', handleSessionUpdate);
      socket.off('dinner_partner_joined', handlePartnerJoined);
      socket.off('restaurant_selected', handleRestaurantSelected);
      socket.off('order_status_update', handleOrderUpdate);
      socket.off('conversation_topic_suggested', handleConversationTopic);
    };
  }, [socket]);

  // Initialize video when partner joins
  useEffect(() => {
    if (datePartner && connectionStatus === 'partner_joined') {
      initializeVideoCall();
    }
  }, [datePartner, connectionStatus, initializeVideoCall]);

  // Select restaurant
  const selectRestaurant = useCallback((restaurant) => {
    if (socket) {
      socket.emit('select_restaurant', {
        sessionId,
        restaurant,
        userId: user.uid
      });
    }
  }, [socket, sessionId, user.uid]);

  // Order meal
  const orderMeal = useCallback((meal) => {
    setSelectedMeal(meal);
    if (socket) {
      socket.emit('order_meal', {
        sessionId,
        meal,
        userId: user.uid
      });
    }
    setOrderStatus('ordered');
  }, [socket, sessionId, user.uid]);

  // Suggest conversation topic
  const suggestTopic = useCallback(() => {
    const randomTopic = dinnerTopics[Math.floor(Math.random() * dinnerTopics.length)];
    if (socket) {
      socket.emit('suggest_conversation_topic', {
        sessionId,
        topic: randomTopic,
        userId: user.uid
      });
    }
  }, [socket, sessionId, user.uid]);

  // Toggle video/audio
  const toggleVideo = useCallback(() => {
    setVideoEnabled(prev => !prev);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
      }
    }
  }, [videoEnabled]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
      }
    }
  }, [audioEnabled]);

  // End dinner
  const endDinner = useCallback(() => {
    if (socket) {
      socket.emit('end_dinner_session', {
        sessionId,
        userId: user.uid
      });
    }
    navigate('/dating');
  }, [socket, sessionId, user.uid, navigate]);

  const dinnerInstructions = {
    title: "Virtual Dinner Date Guide",
    steps: [
      "Wait for your date partner to join the session",
      "Together, browse and select a virtual restaurant",
      "Explore the menu and order your meals",
      "Enjoy conversation while your 'meal' is being prepared",
      "Use the video chat to connect with your date",
      "Try the conversation starters if you need help breaking the ice",
      "Share your dining experience and get to know each other"
    ],
    tips: [
      "Make sure your camera and microphone are working",
      "Choose a quiet, well-lit space for the best experience",
      "Be respectful and engaging in conversation",
      "Try different restaurants for variety in future dates",
      "The experience is about connection, not actual food delivery"
    ]
  };

  if (!datePartner) {
    return (
      <div className="virtual-dinner-waiting">
        <div className="waiting-content">
          <h2>🍽️ Waiting for Your Date Partner</h2>
          <div className="waiting-animation">
            <div className="table-setup">
              <div className="table"></div>
              <div className="chair chair-left"></div>
              <div className="chair chair-right"></div>
              <div className="candle"></div>
            </div>
          </div>
          <p>Setting up your romantic dinner experience...</p>
          <button onClick={() => navigate('/dating')} className="back-btn">
            Cancel Date
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="virtual-dinner-container">
      <div className="dinner-header">
        <h2>🍽️ Virtual Dinner Date</h2>
        <div className="dinner-controls">
          <button 
            onClick={() => setShowInstructions(true)}
            className="instructions-btn"
          >
            📋 Guide
          </button>
          <button onClick={endDinner} className="end-date-btn">
            End Date
          </button>
        </div>
      </div>

      <div className="dinner-main">
        <div className="video-section">
          <div className="video-container">
            <div className="local-video">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="video-feed"
              />
              <div className="video-label">You</div>
            </div>
            
            <div className="remote-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="video-feed"
              />
              <div className="video-label">{datePartner.userName}</div>
            </div>
          </div>

          <div className="video-controls">
            <button 
              onClick={toggleVideo}
              className={`control-btn ${videoEnabled ? 'active' : 'inactive'}`}
            >
              {videoEnabled ? '📹' : '📹❌'}
            </button>
            <button 
              onClick={toggleAudio}
              className={`control-btn ${audioEnabled ? 'active' : 'inactive'}`}
            >
              {audioEnabled ? '🎤' : '🎤❌'}
            </button>
            <button onClick={suggestTopic} className="control-btn">
              💬 Topic
            </button>
          </div>
        </div>

        <div className="restaurant-section">
          {!selectedRestaurant ? (
            <div className="restaurant-selection">
              <h3>🏪 Choose Your Restaurant</h3>
              <div className="restaurants-grid">
                {virtualRestaurants.map(restaurant => (
                  <div 
                    key={restaurant.id}
                    className="restaurant-card"
                    onClick={() => selectRestaurant(restaurant)}
                  >
                    <div className="restaurant-image">
                      <img src={restaurant.image} alt={restaurant.name} />
                    </div>
                    <div className="restaurant-info">
                      <h4>{restaurant.name}</h4>
                      <p className="ambiance">{restaurant.ambiance}</p>
                      <p className="specialty">{restaurant.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="dining-experience">
              <div className="restaurant-header">
                <h3>🏪 {selectedRestaurant.name}</h3>
                <p>{selectedRestaurant.ambiance}</p>
              </div>

              {orderStatus === 'browsing' && (
                <div className="menu-section">
                  <h4>📋 Menu</h4>
                  <div className="menu-items">
                    {selectedRestaurant.menu.map(item => (
                      <div 
                        key={item.id}
                        className="menu-item"
                        onClick={() => orderMeal(item)}
                      >
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-description">{item.description}</div>
                        </div>
                        <div className="item-price">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {orderStatus === 'ordered' && selectedMeal && (
                <div className="order-status">
                  <h4>👨‍🍳 Your Order</h4>
                  <div className="ordered-item">
                    <div className="item-name">{selectedMeal.name}</div>
                    <div className="item-price">{selectedMeal.price}</div>
                    <p>Your meal is being prepared... Enjoy the conversation!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {conversationTopics.length > 0 && (
        <div className="conversation-topics">
          <h4>💬 Conversation Starters</h4>
          <div className="topics-list">
            {conversationTopics.slice(-3).map((topic, index) => (
              <div key={index} className="topic-item">
                "{topic}"
              </div>
            ))}
          </div>
        </div>
      )}

      {showInstructions && (
        <Instructions 
          instructions={dinnerInstructions}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
};

export default VirtualDinner;