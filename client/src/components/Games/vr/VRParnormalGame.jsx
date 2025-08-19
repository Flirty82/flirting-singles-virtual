import React,  { useState, useEffect, useRef, useCallback } from 'react';
import {
    Eye, EyeOff, Headphones, Mic, MicOff, Video, VideoOff, Users, MessageCircle, Zap, Ghost, Skull, Moon,
    Star, Crown, Diamond, Heart, Send, Settings, Volume2, VolumeX, Camera, Phone, Shield, Lock, Unlock, Target, Timer,
    Bell, BellOff, Award, Gift, Sparkles, TrendingUp, RefreshCw, Play, Pause, SkipBack, MoreVertical,
    X, Plus, Search, Filter, Info, Headset, Wifi, WifiOff, Crosshair, Flashlight, Radio, Thermometer, Activity, AlertTriangle
} from 'lucide-react';

const VRParanormalGame = () => {
    // User and VR setup
    const [user] = useState({
        id: 1,
        name: 'Alex',
        avatar: ' ',
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
    const [handTracking, setHandTracking] = useState({ left: null, right: null });

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
    const [currentRoom, setCurrentRoom] = useState([]);
    const [evidence,setEvidence] = useState([]);
    const [activeEquipment, setActiveEquipment] = useState(null);
    const [detectedPhenomena, setDetectedPhenomena] = useState([]);
    const [fearLevel, setFearLevel] = useState(0);
    const [sanityLevel, setSanityLevel] = useState(100);
    const [ghostActivity, setGhostActivity] = useState(0);
    const [audioCues, setAudioCues] = useState([]);

    // Team and social features
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Alex', avatar: ' ', tier: 'platinum', position: 'ENTRANCE', status: 'active', fearLevel: 25 },
        { id: 2, name: 'Mark', avatar: ' ', tier: 'diamond', position: 'LIBRARY', status: 'active', fearLevel: 60  },
        { id: 3, name: 'Winter', avatar: ' ', tier: 'platinum', position: 'BASEMENT', status: 'active', fearLevel: 15 },
        { id: 4, name: 'Autumn', avatar: ' ', tier: 'diamond', position: 'ATTIC', status: 'active', fearLevel: 80 }
    ]);

    // Chat and voice
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'System', message: 'Welcome to Blackwood Manor. Stay together and watch your fear levels.', timestamp: new Date(), type: 'system' },
        { id: 2, user: 'Mark', message: 'im getting EMF readings in the library', timestamp: new Date(), type: 'player' },
        { id: 3, user: 'Winter', message: 'I hear whispers in the basement...', timestamp: new Date(), type: 'player' }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [voiceChatEnabled, setVoiceChatEnabled] = useState(true);
    const [proximityChat, setProximityChat] = useState(true);

    // Equipment and tools
    const [equipmentStatus, setEquipmentStatus] = useState({
        emf_detector: { active: false, reading: 0, battery: 100 },
        spirit_box: { active: false, channel: 1, frequency: 0, battery: 85 },
        thermal_camera: { active: false, tempature: 68, battery: 90 },
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
    const [hasRVAccess, setHasRVAccess] = useState(false);
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

// Game timer
useEffect(() => {
    if (gameState === 'investigating') {
        gameTimerRef.current = setInterval(() => {
            setCurrentMission(prev => {
                if (prev.timeRemaining < 1) {
                    setGameState('completed');
                    return { ...prev, timeRemaining: 0};
                }
                return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            });
        }, [1000]);
    } else {
        clearInterval(gameTimerRef.current);
    }
    return () => clearInterval(gameTimerRef.current);
}, [gameState]);

// Simulate paranormal activity
useEffect(() => {
    if (gameState === 'investigating') {
        const activityInterval = setInterval(() => {
            const activityChance = Math.random();
            if (activityChance < 0.3) {
                const newEvent = generateParanormalEvent();
                setRecentEvents(prev => [newEvent, ...prev].slice(0, 5));
                setGhostActivity(prev => Math.min(prev + 10, 100));
                setFearLevel(prev => Math.min(prev + 5, 100));
                setSanityLevel(prev => Math.max(prev - 5, 0));
            }
        }, 15000);
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
    };

    // Check Membership access
    const checkMembershipAccess = () => {
        if (user.membershipTier === 'platinum' || user.membershipTier === 'diamond') {
            setHasAccess(true);
        } else {
            setHasVRAccess(false);
            setShowUpgradeModal(true);
        }
    };

    // Simulate paranormal activity
    const simulateParanormalActivity = () => {
        const activities = [
            'EMF spike detected', 
            'Tempature drop of 10 degrees',
            'Unexplained footsteps heard', 
            'Door slammed shut',
            'Electronic interference',
            'Apparition sighted',
            'Voice phenomena captured',
            'Object moved by unseen force'
        ];

        if (Math.random() < 0.3) {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            setRecentEvents(prev => [activity, ...prev].slice(0, 5));
            setGhostActivity(prev => Math.min(prev + 10, 100));
            setFearLevel(prev => Math.min(prev + 5, 100));
            setSanityLevel(prev => Math.max(prev - 5, 0));
            setRecentEvents(prev => [{
                id: Date.now(),
                type: 'paranormal',
                description: activity,
                timestamp: new Date(),
                room: currentRoom,
                severity: Math.floor(Math.random() * 5) + 1
            }, ...prev.slice(0, 9)]);

            setEnviornment(prev => ({
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
            setVrDisplayRef(session);

            const message = {
                id: Date.now(),
                user: 'System',
                message: '${user.name} entered the VR session.',
                timestamp: new Date(),
                type: 'system'
            };
            setChatMessages(prev => [...prev, message]);
        } catch (error) {
            console.error('Failed to start VR session:', error);
            setVrConnected(false);
        }
    };

    // Equipment controls
    const toggleEquipment = (equipment) => {
        setEquipmentStatus(prev => ({
            ...prev,
            [equipment]: {
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
        }
    };

    // Room navigation
    const moveToRoom = (room) => {
        setCurrentRoom(roomName);
        setPlayerPosition(prev => ({ ...prev, room: roomName }));

        const message = {
            id: Date.now(),
            user: 'System',
            message: '${user.name} moved to ${roomName}',
            timestamp: new Date(),
            type: 'movement'
        };
        setChatMessages(prev => [...prev, message]);
    };

    // Format time
    const formatTime = (second) => {
        const mins = Math.floort(seconds / 60);
        const secs = seconds % 60;
        return '${mins}:#{secs.toString().padStart(2, 0)}';
    };

    // Access gate for non-premium members
    if (!hasVRAccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
                <div className="text-center p-8 max-w-4xl">
                    <div className="text-8xl mb-6"></div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                        VR Paranormal Investigation
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        VR requires Plainum or Diamond membership.
                    </p>

                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-8">
                       <h3 className="text-2xl font-bold mb-6 text-purple-400">VR Gaming Benefits</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="flex items-center space-x-3">
                            <Headset className="w-6 h-6 text-purple-400"/>
                            <span>Immersive VR paranormal investigations</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Users className="w-6 h-6 text-blue-400"/>
                            <span>Multiplayer ghost hunting with voice chat</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Target className="w-6 h-6 text-green-400"/>
                            <span>Professional ghost hunting equipment</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Award className="w-6 h-6 text-yellow-400"/>
                            <span>Exclusive VR tournaments and prizes</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Crown className="w-6 h-6 text-orange-400"/>
                            <span>Premium haunted locations</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Gift className="w-6 h-6 text-pink-400"/>
                            <span>VR dating experiences and social events</span>
                        </div>
                       </div>
                    </div>

                    <div className="space-x-4">
                        <button className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                            Upgrade to Platinum - $35.00/month
                        </button>
                        <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                            Upgrade to Diamond - $55.00/month
                        </button>
                    </div>

                    <button
                       onClick={() => window.history.back()}
                       className="block mx-auto mt-4 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors"
                    >
                        Go back
                    </button>
                </div>
            </div>
        )
    };
}

