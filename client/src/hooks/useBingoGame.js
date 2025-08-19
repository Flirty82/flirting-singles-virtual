// src/hooks/useBingoGame.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useBingoGame = (user) => {
  // Game state
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, finished
  const [currentGame, setCurrentGame] = useState({
    id: 'GAME_001',
    type: 'premium',
    prizePool: 50000,
    entryFee: 100,
    maxPlayers: 50,
    currentPlayers: 23,
    timeRemaining: 300,
    jackpot: 125000
  });

  // Bingo card and game mechanics
  const [bingoCard, setBingoCard] = useState([]);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [markedNumbers, setMarkedNumbers] = useState(new Set());
  const [hasWon, setHasWon] = useState(false);
  const [winType, setWinType] = useState('');
  const [autoMark, setAutoMark] = useState(true);

  // Players and social features
  const [players, setPlayers] = useState([
    { id: 1, name: 'Alexandra', avatar: '💎', tier: 'diamond', level: 3, cards: 4, isWinner: false },
    { id: 2, name: 'Victoria', avatar: '👑', tier: 'diamond', level: 5, cards: 6, isWinner: false },
    { id: 3, name: 'Sebastian', avatar: '⭐', tier: 'diamond', level: 2, cards: 3, isWinner: false },
    { id: 4, name: 'Isabella', avatar: '✨', tier: 'diamond', level: 4, cards: 5, isWinner: false }
  ]);

  // Chat system
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Victoria', message: 'Good luck everyone! 💎', timestamp: new Date(), type: 'message', tier: 'diamond' },
    { id: 2, user: 'Sebastian', message: 'May the best diamond win! ✨', timestamp: new Date(), type: 'message', tier: 'diamond' },
    { id: 3, user: 'System', message: 'Welcome to Diamond Bingo! Prize pool: $50,000', timestamp: new Date(), type: 'system' }
  ]);

  // Premium features
  const [powerUps, setPowerUps] = useState({
    extraCards: 2,
    autoMark: true,
    numberPreview: true,
    luckyBoost: false,
    doubleChance: false
  });

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Victoria', wins: 127, earnings: 850000, tier: 'diamond' },
    { rank: 2, name: 'Alexandra', wins: 89, earnings: 625000, tier: 'diamond' },
    { rank: 3, name: 'Sebastian', wins: 76, earnings: 540000, tier: 'diamond' }
  ]);

  // Game settings
  const [gameSettings, setGameSettings] = useState({
    soundEffects: true,
    notifications: true,
    animatedNumbers: true,
    premiumTheme: 'diamond',
    chatFilter: 'diamond-only'
  });

  // Refs
  const gameTimerRef = useRef(null);

  // Initialize bingo card
  useEffect(() => {
    generateBingoCard();
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing') {
      gameTimerRef.current = setInterval(() => {
        setCurrentGame(prev => {
          if (prev.timeRemaining <= 1) {
            setGameState('finished');
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

  // Generate premium bingo card
  const generateBingoCard = () => {
    const card = [];
    const ranges = [
      [1, 15],   // B
      [16, 30],  // I
      [31, 45],  // N
      [46, 60],  // G
      [61, 75]   // O
    ];

    for (let col = 0; col < 5; col++) {
      const column = [];
      const [min, max] = ranges[col];
      const numbers = [];
      
      while (numbers.length < 5) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      
      numbers.forEach(num => column.push(num));
      card.push(column);
    }
    
    // Free space in center
    card[2][2] = 'FREE';
    setBingoCard(card);
  };

  // Number calling simulation
  const callNumber = useCallback(() => {
    if (calledNumbers.length >= 75) return;
    
    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * 75) + 1;
    } while (calledNumbers.includes(newNumber));
    
    setCurrentNumber(newNumber);
    setCalledNumbers(prev => [...prev, newNumber]);
    
    // Auto-mark if enabled
    if (autoMark) {
      setTimeout(() => {
        markNumber(newNumber);
      }, 1000);
    }
    
    // Add to chat
    const letter = ['B', 'I', 'N', 'G', 'O'][Math.floor((newNumber - 1) / 15)];
    const message = {
      id: Date.now(),
      user: 'Caller',
      message: `${letter}-${newNumber}`,
      timestamp: new Date(),
      type: 'number-call'
    };
    setChatMessages(prev => [...prev, message]);
  }, [calledNumbers, autoMark]);

  // Mark number on card
  const markNumber = (number) => {
    if (calledNumbers.includes(number) || number === 'FREE') {
      setMarkedNumbers(prev => new Set([...prev, number]));
      checkForWin();
    }
  };

  // Check winning conditions
  const checkForWin = () => {
    // Simplified win condition - in production, implement full bingo logic
    if (markedNumbers.size >= 12) {
      setHasWon(true);
      setWinType('line');
      
      const winMessage = {
        id: Date.now(),
        user: 'System',
        message: `🎉 ${user?.name || 'Player'} has BINGO! Congratulations! 💎`,
        timestamp: new Date(),
        type: 'win'
      };
      setChatMessages(prev => [...prev, winMessage]);
    }
  };

  // Chat functions
  const sendMessage = (message) => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        user: user?.name || 'Player',
        message,
        timestamp: new Date(),
        type: 'message',
        tier: user?.membershipTier || 'free'
      };
      setChatMessages(prev => [...prev, newMessage]);
    }
  };

  // Game controls
  const joinGame = () => {
    if (user?.credits >= currentGame.entryFee) {
      setGameState('playing');
      setCurrentGame(prev => ({ 
        ...prev, 
        currentPlayers: prev.currentPlayers + 1 
      }));
    }
  };

  const startNewGame = () => {
    setGameState('lobby');
    setCalledNumbers([]);
    setCurrentNumber(null);
    setMarkedNumbers(new Set());
    setHasWon(false);
    generateBingoCard();
    setCurrentGame(prev => ({
      ...prev,
      timeRemaining: 300,
      currentPlayers: Math.floor(Math.random() * 30) + 20
    }));
  };

  return {
    gameState,
    setGameState,
    currentGame,
    setCurrentGame,
    bingoCard,
    setBingoCard,
    calledNumbers,
    setCalledNumbers,
    currentNumber,
    setCurrentNumber,
    markedNumbers,
    setMarkedNumbers,
    hasWon,
    setHasWon,
    winType,
    setWinType,
    players,
    setPlayers,
    chatMessages,
    setChatMessages,
    powerUps,
    setPowerUps,
    leaderboard,
    setLeaderboard,
    gameSettings,
    setGameSettings,
    // Functions
    generateBingoCard,
    callNumber,
    markNumber,
    checkForWin,
    sendMessage,
    joinGame,
    startNewGame
  };
};