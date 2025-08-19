import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Eye, EyeOff, Headphones, Mic, MicOff, Video, VideoOff, Users, MessageCircle,
  Zap, Ghost, Skull, Moon, Star, Crown, Diamond, Heart, Send, Settings,
  Volume2, VolumeX, Camera, Phone, Shield, Lock, Unlock, Target, Timer,
  Bell, BellOff, Award, Gift, Sparkles, TrendingUp, RefreshCw, Play, Pause,
  MoreVertical, X, Plus, Search, Filter, Info, Headset, Wifi, WifiOff,
  Crosshair, Flashlight, Radio, Thermometer, Activity, AlertTriangle
} from 'lucide-react';

const VRParanormalGame = () => {
  // User and VR setup
  const [user] = useState({
    id: 1,
    name: 'Alexandra',
    avatar: '👻',
    membershipTier: 'platinum',
    vrLevel: 2,
    credits: 5000,
    paranormalScore: 8450,
    equipment: ['EMF_DETECTOR', 'SPIRIT_BOX', 'THERMAL_CAMERA', 'UV_LIGHT']
  });

  // VR and device state
  const [vrSupported, setVrSupported] = useState(false);
  const [vrConnected, setVrConnected] = useState(false);
  const [vrHeadset, setVrHeadset] = useState(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [handTracking, setHandTracking] = useState(false);

  // Game state
  const [gameState, setGameState] = useState('lobby');
  const [currentMission, setCurrentMission] = useState({
    id: 'HAUNTED_MANSION_001',
    name: 'The Blackwood Manor',
    difficulty: 'Expert',
    maxPlayers: 6,
    currentPlayers: 4,
    timeLimit: 1800,
    timeRemaining: 1800,
    prizePool: 15000,
    entryFee: 250,
    phenomena: ['APPARITIONS', 'COLD_SPOTS', 'EMF_SPIKES', 'VOICE_PHENOMENA']
  });

  // Investigation state
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0, room: 'ENTRANCE' });
  const [currentRoom, setCurrentRoom] = useState('ENTRANCE');
  const [evidence, setEvidence] = useState([]);
  const [activeEquipment, setActiveEquipment] = useState(null);
  const [detectedPhenomena, setDetectedPhenomena] = useState([]);
  const [fearLevel, setFearLevel] = useState(0);
  const [ghostActivity, setGhostActivity] = useState(0);

  // Team and social features
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alexandra', avatar: '👻', tier: 'platinum', position: 'ENTRANCE', alive: true, fearLevel: 25 },
    { id: 2, name: 'Marcus', avatar: '🔍', tier: 'diamond', position: 'LIBRARY', alive: true, fearLevel: 15 },
    { id: 3, name: 'Sophia', avatar: '📸', tier: 'platinum', position: 'BASEMENT', alive: true, fearLevel: 60 },
    { id: 4, name: 'David', avatar: '🎧', tier: 'diamond', position: 'ATTIC', alive: true, fearLevel: 80 }
  ]);

  // Chat and voice
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'System', message: 'Welcome to Blackwood Manor. Stay together and watch your fear levels.', timestamp: new Date(), type: 'system' },
    { id: 2, user: 'Marcus', message: 'I\'m getting EMF readings in the library', timestamp: new Date(), type: 'evidence' },
    { id: 3, user: 'Sophia', message: 'Did anyone else feel that cold spot?', timestamp: new Date(), type: 'message' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [voiceChat, setVoiceChat] = useState(true);
  const [proximityChat, setProximityChat] = useState(true);

  // Equipment and tools
  const [equipment, setEquipment] = useState({
    emf_detector: { active: false, reading: 0, battery: 100 },
    spirit_box: { active: false, frequency: 0, battery: 85 },
    thermal_camera: { active: false, temperature: 68, battery: 90 },
    uv_light: { active: false, battery: 75 },
    motion_sensor: { active: false, triggered: false, battery: 95 },
    voice_recorder: { active: false, recording: false, battery: 100 }
  });

  // Environmental effects
  const [environment, setEnvironment] = useState({
    lighting: 20,
    temperature: 68,
    humidity: 45,
    emfLevel: 0,
    soundLevel: 10,
    presenceDetected: false
  });

  // Paranormal events
  const [recentEvents, setRecentEvents] = useState([]);
  const [ghostType, setGhostType] = useState('UNKNOWN');
  const [ghostStrength, setGhostStrength] = useState(0);

  // Access control
  const [hasVRAccess, setHasVRAccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Refs
  const vrDisplayRef = useRef(null);
  const gameTimerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Check VR support and membership
  useEffect(() => {
    checkVRSupport();
    checkMembershipAccess();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Game timer
  useEffect(() => {
    if (gameState === 'investigating') {
      gameTimerRef.current = setInterval(() => {
        setCurrentMission(prev => {
          if (prev.timeRemaining <= 1) {
            setGameState('completed');
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    } else {
      clearInterval(gameTimerRef.current);
    }
    return () => clearInterval(gameTimerRef.current);
  }, [gameState]);

  // Simulate paranormal activity
  useEffect(() => {
    if (gameState === 'investigating') {
      const activityInterval = setInterval(() => {
        simulateParanormalActivity();
      }, 5000);
      return () => clearInterval(activityInterval);
    }
  }, [gameState]);

  // Check VR support
  const checkVRSupport = async () => {
    if ('xr' in navigator) {
      try {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        setVrSupported(isSupported);
        
        if (isSupported) {
          setVrHeadset('Generic VR Headset');
        }
      } catch (error) {
        console.log('VR not supported:', error);
        setVrSupported(false);
      }
    } else {
      setVrSupported(false);
    }
  };

  // Check membership access
  const checkMembershipAccess = () => {
    if (user.membershipTier === 'platinum' || user.membershipTier === 'diamond') {
      setHasVRAccess(true);
    } else {
      setHasVRAccess(false);
      setShowUpgradeModal(true);
    }
  };

  // Simulate paranormal activity
  const simulateParanormalActivity = () => {
    const activities = [
      'EMF spike detected',
      'Temperature drop of 10 degrees',
      'Unexplained footsteps heard',
      'Door slammed shut',
      'Electronic interference',
      'Apparition sighted',
      'Voice phenomena captured',
      'Object moved by unseen force'
    ];

    if (Math.random() < 0.3) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      setRecentEvents(prev => [{
        id: Date.now(),
        type: 'paranormal',
        description: activity,
        timestamp: new Date(),
        room: currentRoom,
        severity: Math.floor(Math.random() * 5) + 1
      }, ...prev.slice(0, 9)]);

      setEnvironment(prev => ({
        ...prev,
        emfLevel: Math.random() * 100,
        temperature: prev.temperature - Math.random() * 15,
        presenceDetected: Math.random() > 0.7
      }));

      setFearLevel(prev => Math.min(100, prev + Math.random() * 20));
      setGhostActivity(prev => Math.min(100, prev + Math.random() * 30));
    }
  };

  // Start VR session
  const startVRSession = async () => {
    if (!vrSupported) return;
    
    try {
      const session = await navigator.xr.requestSession('immersive-vr');
      setVrConnected(true);
      setGameState('briefing');
      
      const message = {
        id: Date.now(),
        user: 'System',
        message: `${user.name} entered VR mode`,
        timestamp: new Date(),
        type: 'system'
      };
      setChatMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Failed to start VR session:', error);
    }
  };

  // Equipment controls
  const toggleEquipment = (equipmentType) => {
    setEquipment(prev => ({
      ...prev,
      [equipmentType]: {
        ...prev[equipmentType],
        active: !prev[equipmentType].active
      }
    }));
    setActiveEquipment(equipmentType);
  };

  // Chat functions
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: user.name,
        message: newMessage,
        timestamp: new Date(),
        type: 'message',
        room: currentRoom
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  // Room navigation
  const moveToRoom = (roomName) => {
    setCurrentRoom(roomName);
    setPlayerPosition(prev => ({ ...prev, room: roomName }));
    
    const message = {
      id: Date.now(),
      user: 'System',
      message: `${user.name} moved to ${roomName}`,
      timestamp: new Date(),
      type: 'movement'
    };
    setChatMessages(prev => [...prev, message]);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Access gate for non-premium members
  if (!hasVRAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center p-8 max-w-4xl">
          <div className="text-8xl mb-6">👻</div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
            VR Paranormal Investigation
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Premium VR experience requires Platinum or Diamond membership
          </p>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-purple-400">VR Gaming Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-center space-x-3">
                <Headset className="w-6 h-6 text-purple-400" />
                <span>Immersive VR paranormal investigations</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-400" />
                <span>Multiplayer ghost hunting with voice chat</span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-green-400" />
                <span>Professional ghost hunting equipment</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-yellow-400" />
                <span>Exclusive VR tournaments and prizes</span>
              </div>
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-orange-400" />
                <span>Premium haunted locations</span>
              </div>
              <div className="flex items-center space-x-3">
                <Gift className="w-6 h-6 text-pink-400" />
                <span>VR dating experiences and social events</span>
              </div>
            </div>
          </div>
          
          <div className="space-x-4">
            <button className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              Upgrade to Platinum - $19.99/month
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              Upgrade to Diamond - $29.99/month
            </button>
          </div>
          
          <button 
            onClick={() => window.history.back()}
            className="block mx-auto mt-4 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* VR Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-red-500 p-3 rounded-xl">
              <Ghost className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                VR Paranormal Investigation
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span className="flex items-center space-x-1">
                  <Headset className="w-4 h-4 text-purple-400" />
                  <span>VR Level {user.vrLevel}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Ghost className="w-4 h-4 text-red-400" />
                  <span>{user.paranormalScore.toLocaleString()} Paranormal Score</span>
                </span>
                <span className={`flex items-center space-x-1 ${vrConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {vrConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  <span>{vrConnected ? 'VR Connected' : 'VR Disconnected'}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!vrConnected && vrSupported && (
              <button
                onClick={startVRSession}
                className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
              >
                <Headset className="w-5 h-5" />
                <span>Enter VR</span>
              </button>
            )}
            
            <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 px-4 py-2 rounded-lg border border-red-500/30">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-red-400" />
                <span className="font-bold">{formatTime(currentMission.timeRemaining)}</span>
              </div>
            </div>
            
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Phone className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main VR Display */}
        <div className="lg:col-span-3 space-y-6">
          {/* VR Viewport */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-black rounded-xl relative overflow-hidden border border-red-500/30">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">
                    {gameState === 'investigating' ? '👻' : '🏚️'}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{currentMission.name}</h3>
                  <p className="text-gray-300 mb-4">Current Room: {currentRoom.replace('_', ' ')}</p>
                  
                  {gameState === 'lobby' && (
                    <button
                      onClick={() => setGameState('briefing')}
                      className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                      Start Investigation
                    </button>
                  )}
                </div>
              </div>
              
              {gameState === 'investigating' && (
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs text-gray-300 mb-1">Fear Level</div>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-red-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${fearLevel}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs text-gray-300 mb-1">Ghost Activity</div>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-red-400 h-2 rounded-full transition-all duration-500 animate-pulse"
                        style={{ width: `${ghostActivity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Equipment Panel */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Crosshair className="w-6 h-6 mr-2 text-purple-400" />
              Ghost Hunting Equipment
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(equipment).map(([key, item]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg cursor-pointer transition-all border ${
                    item.active 
                      ? 'bg-gradient-to-r from-purple-500/20 to-red-500/20 border-purple-500' 
                      : 'bg-black/20 border-gray-600 hover:border-purple-400'
                  }`}
                  onClick={() => toggleEquipment(key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl">
                      {key === 'emf_detector' && '📡'}
                      {key === 'spirit_box' && '📻'}
                      {key === 'thermal_camera' && '📷'}
                      {key === 'uv_light' && '🔦'}
                      {key === 'motion_sensor' && '🎯'}
                      {key === 'voice_recorder' && '🎙️'}
                    </div>
                    <div className={`text-sm ${item.active ? 'text-green-400' : 'text-gray-500'}`}>
                      {item.active ? 'ON' : 'OFF'}
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium capitalize mb-1">
                    {key.replace('_', ' ')}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Battery: {item.battery}%</span>
                    {item.active && (
                      <span className="text-green-400 animate-pulse">Active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Paranormal Events */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
              Paranormal Activity Log
            </h3>
            
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">👻</div>
                    <div>
                      <div className="font-medium text-red-300">{event.description}</div>
                      <div className="text-xs text-gray-400">{event.room.replace('_', ' ')} • {event.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    event.severity >= 4 ? 'bg-red-500 text-white' :
                    event.severity >= 2 ? 'bg-yellow-500 text-black' :
                    'bg-green-500 text-white'
                  }`}>
                    Level {event.severity}
                  </div>
                </div>
              ))}
              
              {recentEvents.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Ghost className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No paranormal activity detected yet...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Investigation Team ({teamMembers.length})
            </h3>
            
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{member.avatar}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{member.name}</span>
                        {member.tier === 'diamond' && <Diamond className="w-3 h-3 text-blue-400" />}
                        {member.tier === 'platinum' && <Crown className="w-3 h-3 text-purple-400" />}
                      </div>
                      <div className="text-xs text-gray-400">{member.position.replace('_', ' ')}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded ${
                      member.fearLevel >= 80 ? 'bg-red-500/20 text-red-300' :
                      member.fearLevel >= 50 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      Fear: {member.fearLevel}%
                    </div>
                    <div className={`text-xs mt-1 ${member.alive ? 'text-green-400' : 'text-red-400'}`}>
                      {member.alive ? 'Active' : 'Eliminated'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Chat */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
              Team Communication
            </h3>
            
            <div className="h-64 overflow-y-auto space-y-3 mb-4 pr-2">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`p-3 rounded-lg transition-all ${
                  msg.type === 'system' ? 'bg-blue-500/20 border border-blue-500/30' :
                  msg.type === 'evidence' ? 'bg-green-500/20 border border-green-500/30' :
                  msg.type === 'movement' ? 'bg-purple-500/20 border border-purple-500/30' :
                  'bg-white/5 hover:bg-white/10'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium text-sm ${
                      msg.type === 'system' ? 'text-blue-300' : 
                      msg.user === user.name ? 'text-purple-300' : 'text-gray-300'
                    }`}>
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Communicate with team..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-purple-