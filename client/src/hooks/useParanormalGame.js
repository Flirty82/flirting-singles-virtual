// src/hooks/useParanormalGame.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useParanormalGame = (user) => {
  // Game state
  const [gameState, setGameState] = useState('lobby'); // lobby, briefing, investigating, completed
  const [currentMission, setCurrentMission] = useState({
    id: 'HAUNTED_MANSION_001',
    name: 'The Blackwood Manor',
    difficulty: 'Expert',
    maxPlayers: 6,
    currentPlayers: 1,
    timeLimit: 1800,
    timeRemaining: 1800,
    prizePool: 15000,
    entryFee: 250,
    phenomena: ['APPARITIONS', 'COLD_SPOTS', 'EMF_SPIKES', 'VOICE_PHENOMENA']
  });

  // Player state
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0, room: 'ENTRANCE' });
  const [currentRoom, setCurrentRoom] = useState('ENTRANCE');
  const [health, setHealth] = useState(100);
  const [sanity, setSanity] = useState(100);
  const [fearLevel, setFearLevel] = useState(0);
  const [inventory, setInventory] = useState(['EMF_DETECTOR', 'FLASHLIGHT', 'CAMERA']);

  // Evidence and investigation
  const [evidence, setEvidence] = useState([]);
  const [ghostType, setGhostType] = useState('UNKNOWN');
  const [ghostStrength, setGhostStrength] = useState(0);
  const [ghostLocation, setGhostLocation] = useState('UNKNOWN');
  const [detectedPhenomena, setDetectedPhenomena] = useState([]);
  
  // Equipment state
  const [equipment, setEquipment] = useState({
    emf_detector: { active: false, reading: 0, battery: 100, range: 5 },
    spirit_box: { active: false, frequency: 87.5, battery: 85, sessions: [] },
    thermal_camera: { active: false, temperature: 68, battery: 90, anomalies: [] },
    uv_light: { active: false, battery: 75, reveals: [] },
    motion_sensor: { active: false, triggered: false, battery: 95, detections: [] },
    voice_recorder: { active: false, recording: false, battery: 100, recordings: [] },
    camera: { active: false, flash: true, battery: 80, photos: [] },
    crucifix: { active: false, charges: 2, blessed: true }
  });

  // Environmental conditions
  const [environment, setEnvironment] = useState({
    lighting: 20,
    temperature: 68,
    humidity: 45,
    emfLevel: 0,
    soundLevel: 10,
    presenceDetected: false,
    ghostActivity: 0,
    hauntingIntensity: 0
  });

  // Events and encounters
  const [recentEvents, setRecentEvents] = useState([]);
  const [activeHauntings, setActiveHauntings] = useState([]);
  const [ghostEncounters, setGhostEncounters] = useState([]);

  // Team management
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: user?.name || 'Player', avatar: '👻', position: 'ENTRANCE', alive: true, sanity: 100, fearLevel: 0 }
  ]);

  // Game timers and intervals
  const gameTimerRef = useRef(null);
  const environmentTimerRef = useRef(null);
  const ghostActivityTimerRef = useRef(null);

  // Initialize game
  useEffect(() => {
    initializeGame();
    return () => {
      clearAllTimers();
    };
  }, []);

  // Game loop timers
  useEffect(() => {
    if (gameState === 'investigating') {
      startGameTimers();
    } else {
      clearAllTimers();
    }
    return () => clearAllTimers();
  }, [gameState]);

  // Ghost activity simulation
  useEffect(() => {
    if (gameState === 'investigating') {
      const activityInterval = setInterval(() => {
        simulateGhostActivity();
      }, Math.random() * 10000 + 5000); // Random intervals 5-15 seconds
      
      return () => clearInterval(activityInterval);
    }
  }, [gameState, currentRoom, ghostStrength]);

  const initializeGame = () => {
    generateGhostProfile();
    setInitialEnvironment();
    resetPlayerStats();
  };

  const generateGhostProfile = () => {
    const ghostTypes = [
      { type: 'SPIRIT', strength: 30, aggression: 20, evidence: ['EMF', 'SPIRIT_BOX', 'GHOST_WRITING'] },
      { type: 'WRAITH', strength: 50, aggression: 40, evidence: ['EMF', 'SPIRIT_BOX', 'DOTS'] },
      { type: 'PHANTOM', strength: 45, aggression: 35, evidence: ['SPIRIT_BOX', 'FINGERPRINTS', 'DOTS'] },
      { type: 'POLTERGEIST', strength: 60, aggression: 70, evidence: ['SPIRIT_BOX', 'FINGERPRINTS', 'GHOST_WRITING'] },
      { type: 'BANSHEE', strength: 40, aggression: 80, evidence: ['FINGERPRINTS', 'GHOST_ORB', 'DOTS'] },
      { type: 'JINN', strength: 55, aggression: 30, evidence: ['EMF', 'FINGERPRINTS', 'FREEZING'] },
      { type: 'MARE', strength: 50, aggression: 60, evidence: ['SPIRIT_BOX', 'GHOST_ORB', 'GHOST_WRITING'] },
      { type: 'REVENANT', strength: 70, aggression: 90, evidence: ['GHOST_ORB', 'GHOST_WRITING', 'FREEZING'] },
      { type: 'SHADE', strength: 25, aggression: 10, evidence: ['EMF', 'GHOST_WRITING', 'FREEZING'] },
      { type: 'DEMON', strength: 80, aggression: 100, evidence: ['FINGERPRINTS', 'GHOST_WRITING', 'FREEZING'] }
    ];

    const randomGhost = ghostTypes[Math.floor(Math.random() * ghostTypes.length)];
    setGhostType(randomGhost.type);
    setGhostStrength(randomGhost.strength);
    
    // Set random ghost location
    const rooms = ['LIBRARY', 'BASEMENT', 'ATTIC', 'BEDROOM', 'KITCHEN'];
    setGhostLocation(rooms[Math.floor(Math.random() * rooms.length)]);
  };

  const setInitialEnvironment = () => {
    setEnvironment({
      lighting: Math.random() * 30 + 10, // 10-40% lighting
      temperature: Math.random() * 20 + 55, // 55-75°F
      humidity: Math.random() * 30 + 40, // 40-70%
      emfLevel: Math.random() * 10,
      soundLevel: Math.random() * 20 + 5,
      presenceDetected: false,
      ghostActivity: 0,
      hauntingIntensity: 0
    });
  };

  const resetPlayerStats = () => {
    setHealth(100);
    setSanity(100);
    setFearLevel(0);
    setEvidence([]);
    setRecentEvents([]);
  };

  const startGameTimers = () => {
    // Main game timer
    gameTimerRef.current = setInterval(() => {
      setCurrentMission(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        if (newTimeRemaining <= 0) {
          endGame('TIME_UP');
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    // Environment updates
    environmentTimerRef.current = setInterval(() => {
      updateEnvironment();
    }, 3000);

    // Ghost activity updates
    ghostActivityTimerRef.current = setInterval(() => {
      updateGhostActivity();
    }, 2000);
  };

  const clearAllTimers = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (environmentTimerRef.current) clearInterval(environmentTimerRef.current);
    if (ghostActivityTimerRef.current) clearInterval(ghostActivityTimerRef.current);
  };

  const simulateGhostActivity = () => {
    const activities = [
      { type: 'EMF_SPIKE', description: 'EMF spike detected', severity: 2 },
      { type: 'TEMPERATURE_DROP', description: 'Sudden temperature drop', severity: 3 },
      { type: 'FOOTSTEPS', description: 'Unexplained footsteps heard', severity: 1 },
      { type: 'DOOR_SLAM', description: 'Door slammed shut', severity: 3 },
      { type: 'ELECTRONIC_INTERFERENCE', description: 'Electronic interference', severity: 2 },
      { type: 'APPARITION', description: 'Apparition sighted', severity: 5 },
      { type: 'VOICE_PHENOMENA', description: 'Voice phenomena captured', severity: 4 },
      { type: 'OBJECT_MOVEMENT', description: 'Object moved by unseen force', severity: 3 },
      { type: 'LIGHTS_FLICKER', description: 'Lights flickering', severity: 2 },
      { type: 'COLD_BREATH', description: 'Breath visible from cold', severity: 3 }
    ];

    // Higher chance of activity if in ghost's room or nearby
    const baseChance = currentRoom === ghostLocation ? 0.4 : 0.2;
    const activityChance = baseChance * (ghostStrength / 100);

    if (Math.random() < activityChance) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      
      const event = {
        id: Date.now(),
        type: activity.type,
        description: activity.description,
        timestamp: new Date(),
        room: currentRoom,
        severity: activity.severity,
        witnessed: true
      };

      setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
      processParanormalEvent(activity);
      
      // Increase fear based on severity
      setFearLevel(prev => Math.min(100, prev + activity.severity * 5));
      
      // Decrease sanity for severe events
      if (activity.severity >= 4) {
        setSanity(prev => Math.max(0, prev - activity.severity * 2));
      }
    }
  };

  const processParanormalEvent = (activity) => {
    switch (activity.type) {
      case 'EMF_SPIKE':
        setEnvironment(prev => ({ ...prev, emfLevel: Math.random() * 50 + 50 }));
        if (equipment.emf_detector.active) {
          addEvidence('EMF_READING', 'High EMF levels detected');
        }
        break;
      
      case 'TEMPERATURE_DROP':
        setEnvironment(prev => ({ ...prev, temperature: prev.temperature - Math.random() * 20 }));
        if (equipment.thermal_camera.active) {
          addEvidence('FREEZING_TEMPS', 'Below freezing temperature recorded');
        }
        break;
      
      case 'VOICE_PHENOMENA':
        if (equipment.spirit_box.active) {
          addEvidence('SPIRIT_RESPONSE', 'Ghost response captured on spirit box');
        }
        if (equipment.voice_recorder.active && equipment.voice_recorder.recording) {
          addEvidence('EVP', 'Electronic Voice Phenomenon recorded');
        }
        break;
      
      case 'APPARITION':
        if (equipment.camera.active) {
          addEvidence('GHOST_PHOTO', 'Apparition captured on camera');
        }
        break;
      
      default:
        break;
    }

    // Update ghost activity level
    setEnvironment(prev => ({ 
      ...prev, 
      ghostActivity: Math.min(100, prev.ghostActivity + activity.severity * 3)
    }));
  };

  const addEvidence = (type, description) => {
    const newEvidence = {
      id: Date.now(),
      type,
      description,
      timestamp: new Date(),
      room: currentRoom,
      equipment: Object.keys(equipment).filter(key => equipment[key].active)
    };

    setEvidence(prev => {
      // Prevent duplicate evidence types
      if (prev.some(e => e.type === type)) return prev;
      return [...prev, newEvidence];
    });
  };

  const updateEnvironment = () => {
    setEnvironment(prev => {
      const newEnv = { ...prev };
      
      // Natural fluctuations
      newEnv.temperature += (Math.random() - 0.5) * 2;
      newEnv.humidity += (Math.random() - 0.5) * 5;
      newEnv.soundLevel = Math.random() * 30 + 5;
      
      // Ghost influence
      if (currentRoom === ghostLocation) {
        newEnv.temperature -= ghostStrength * 0.1;
        newEnv.emfLevel = Math.max(newEnv.emfLevel, ghostStrength * 0.3);
        newEnv.presenceDetected = Math.random() < (ghostStrength / 200);
      } else {
        // Gradual return to normal when away from ghost
        newEnv.emfLevel *= 0.9;
        newEnv.presenceDetected = false;
      }
      
      return newEnv;
    });
  };

  const updateGhostActivity = () => {
    setEnvironment(prev => ({
      ...prev,
      ghostActivity: Math.max(0, prev.ghostActivity - 2), // Decay over time
      hauntingIntensity: fearLevel * 0.3 + ghostStrength * 0.7
    }));
  };

  // Equipment control functions
  const toggleEquipment = useCallback((equipmentType) => {
    setEquipment(prev => {
      const newEquipment = { ...prev };
      const item = newEquipment[equipmentType];
      
      if (item) {
        item.active = !item.active;
        
        // Drain battery when active
        if (item.active && item.battery > 0) {
          const drainRate = equipmentType === 'flashlight' ? 0.1 : 0.2;
          item.battery = Math.max(0, item.battery - drainRate);
        }
      }
      
      return newEquipment;
    });
  }, []);

  // Room navigation
  const moveToRoom = useCallback((roomName) => {
    setCurrentRoom(roomName);
    setPlayerPosition(prev => ({ ...prev, room: roomName }));
    
    // Add movement event
    const event = {
      id: Date.now(),
      type: 'MOVEMENT',
      description: `Moved to ${roomName.replace('_', ' ')}`,
      timestamp: new Date(),
      room: roomName,
      severity: 0
    };
    
    setRecentEvents(prev => [event, ...prev.slice(0, 9)]);
    
    // Update team member position
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === 1 ? { ...member, position: roomName } : member
      )
    );
  }, []);

  // Game control functions
  const startInvestigation = () => {
    setGameState('investigating');
    setCurrentMission(prev => ({ ...prev, currentPlayers: prev.currentPlayers + 1 }));
  };

  const endGame = (reason = 'COMPLETED') => {
    setGameState('completed');
    clearAllTimers();
    
    // Calculate final score and rewards
    const score = calculateFinalScore();
    const rewards = calculateRewards(score, reason);
    
    return { score, rewards, reason };
  };

  const calculateFinalScore = () => {
    let score = 0;
    
    // Evidence collection bonus
    score += evidence.length * 100;
    
    // Survival bonus
    score += health * 2;
    score += sanity * 1.5;
    
    // Time bonus
    const timeUsed = currentMission.timeLimit - currentMission.timeRemaining;
    score += Math.max(0, (currentMission.timeLimit - timeUsed) * 0.1);
    
    // Ghost identification bonus
    if (ghostType !== 'UNKNOWN' && evidence.length >= 3) {
      score += 1000;
    }
    
    return Math.round(score);
  };

  const calculateRewards = (score, reason) => {
    let credits = 0;
    let xp = score;
    
    if (reason === 'COMPLETED') {
      credits = Math.round(currentMission.prizePool * 0.3);
    } else if (reason === 'SURVIVED') {
      credits = Math.round(currentMission.prizePool * 0.1);
    }
    
    return { credits, xp };
  };

  // Utility functions
  const getEquipmentInRange = (range = 5) => {
    return Object.entries(equipment)
      .filter(([key, item]) => item.active && item.range && item.range >= range)
      .map(([key]) => key);
  };

  const isGhostNearby = () => {
    return currentRoom === ghostLocation || environment.presenceDetected;
  };

  const getGhostHints = () => {
    const hints = [];
    
    if (evidence.length >= 1) hints.push(`Evidence suggests supernatural presence`);
    if (evidence.length >= 2) hints.push(`Ghost type narrowing down...`);
    if (evidence.length >= 3) hints.push(`Sufficient evidence for identification`);
    if (isGhostNearby()) hints.push(`Strong paranormal presence in this area`);
    
    return hints;
  };

  return {
    // Game State
    gameState,
    setGameState,
    currentMission,
    setCurrentMission,
    
    // Player State
    playerPosition,
    currentRoom,
    health,
    sanity,
    fearLevel,
    inventory,
    
    // Investigation
    evidence,
    ghostType,
    ghostStrength,
    ghostLocation,
    detectedPhenomena,
    
    // Equipment
    equipment,
    setEquipment,
    
    // Environment
    environment,
    recentEvents,
    activeHauntings,
    ghostEncounters,
    
    // Team
    teamMembers,
    setTeamMembers,
    
    // Functions
    initializeGame,
    startInvestigation,
    endGame,
    toggleEquipment,
    moveToRoom,
    addEvidence,
    simulateGhostActivity,
    getEquipmentInRange,
    isGhostNearby,
    getGhostHints,
    calculateFinalScore
  };
};