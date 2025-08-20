// client/src/components/games/GameRoom.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Instructions from '../common/Instructions';
import '../../styles/components/GameRoom.css';

const GameRoom = ({ user, socket }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, starting, active, finished
  const [selectedGame, setSelectedGame] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [currentMiniGame, setCurrentMiniGame] = useState(null);

  // Available games
  const availableGames = [
    { id: 'bingo', name: 'Bingo', minPlayers: 2, maxPlayers: 50 },
    { id: 'karaoke', name: 'Karaoke', minPlayers: 1, maxPlayers: 20 },
    { id: 'trivia', name: 'Trivia', minPlayers: 2, maxPlayers: 30 },
    { id: 'pictionary', name: 'Pictionary', minPlayers: 3, maxPlayers: 16 },
    { id: 'charades', name: 'Charades', minPlayers: 4, maxPlayers: 12 }
  ];

  // Mini-games for waiting room
  const miniGames = [
    { id: 'clickSpeed', name: 'Click Speed Test', icon: '⚡' },
    { id: 'memoryCards', name: 'Memory Cards', icon: '🧠' },
    { id: 'wordGuess', name: 'Word Guess', icon: '📝' },
    { id: 'colorMatch', name: 'Color Match', icon: '🎨' }
  ];

  // Join room on component mount
  useEffect(() => {
    if (socket && user && roomId) {
      socket.emit('join_game_room', {
        roomId,
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL
      });
    }
  }, [socket, user, roomId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdate = (data) => {
      setRoomData(data.room);
      setParticipants(data.participants);
      setIsHost(data.room.hostId === user.uid);
      setGameStatus(data.room.status);
    };

    const handleGameStart = (data) => {
      setCountdown(data.countdown);
      setGameStatus('starting');
    };

    const handleGameLaunch = (data) => {
      // Navigate to specific game
      navigate(`/games/${data.gameType}`);
    };

    const handleCountdownUpdate = (data) => {
      setCountdown(data.countdown);
    };

    socket.on('game_room_update', handleRoomUpdate);
    socket.on('game_start_countdown', handleGameStart);
    socket.on('game_launch', handleGameLaunch);
    socket.on('countdown_update', handleCountdownUpdate);

    return () => {
      socket.off('game_room_update', handleRoomUpdate);
      socket.off('game_start_countdown', handleGameStart);
      socket.off('game_launch', handleGameLaunch);
      socket.off('countdown_update', handleCountdownUpdate);
    };
  }, [socket, user, navigate]);

  // Start game (host only)
  const startGame = useCallback(() => {
    if (socket && isHost && selectedGame) {
      socket.emit('start_game', {
        roomId,
        gameType: selectedGame,
        hostId: user.uid
      });
    }
  }, [socket, isHost, selectedGame, roomId, user.uid]);

  // Leave room
  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.emit('leave_game_room', {
        roomId,
        userId: user.uid
      });
    }
    navigate('/games');
  }, [socket, roomId, user.uid, navigate]);

  // Kick player (host only)
  const kickPlayer = useCallback((playerId) => {
    if (socket && isHost) {
      socket.emit('kick_player', {
        roomId,
        playerId,
        hostId: user.uid
      });
    }
  }, [socket, isHost, roomId, user.uid]);

  // Mini-game functions
  const startMiniGame = useCallback((gameType) => {
    setCurrentMiniGame(gameType);
    setMiniGameScore(0);
  }, []);

  const playClickSpeedGame = useCallback(() => {
    let clicks = 0;
    const startTime = Date.now();
    const duration = 10000; // 10 seconds
    
    const clickHandler = () => {
      clicks++;
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        setMiniGameScore(clicks);
        setCurrentMiniGame(null);
        document.removeEventListener('click', clickHandler);
      }
    };
    
    document.addEventListener('click', clickHandler);
    setTimeout(() => {
      document.removeEventListener('click', clickHandler);
      setMiniGameScore(clicks);
      setCurrentMiniGame(null);
    }, duration);
  }, []);

  const gameRoomInstructions = {
    title: "How to Use the Game Room",
    steps: [
      "Wait for other players to join the room",
      "Host selects a game from the available options",
      "All players can see the participant list and chat",
      "Play mini-games while waiting for the main game to start",
      "When ready, host starts the countdown to begin",
      "Everyone is automatically moved to the selected game"
    ],
    tips: [
      "Room host has special privileges to manage the room",
      "Try mini-games to pass time and compete with others",
      "Some games require minimum number of players",
      "You can leave and rejoin rooms anytime"
    ]
  };

  if (!roomData) {
    return (
      <div className="game-room-loading">
        <div className="loading-spinner"></div>
        <p>Joining game room...</p>
      </div>
    );
  }

  const selectedGameInfo = availableGames.find(g => g.id === selectedGame);
  const canStartGame = selectedGame && 
    participants.length >= (selectedGameInfo?.minPlayers || 1) &&
    participants.length <= (selectedGameInfo?.maxPlayers || 50);

  return (
    <div className="game-room-container">
      <div className="game-room-header">
        <div className="room-info">
          <h2>🎮 Game Room {roomId}</h2>
          <div className="room-meta">
            <span className="participant-count">
              👥 {participants.length} participants
            </span>
            <span className="room-status">
              Status: {gameStatus === 'waiting' ? '⏳ Waiting' : 
                      gameStatus === 'starting' ? '🚀 Starting' : 
                      gameStatus === 'active' ? '🔴 Active' : '✅ Finished'}
            </span>
          </div>
        </div>
        
        <div className="room-controls">
          <button 
            onClick={() => setShowInstructions(true)}
            className="instructions-btn"
          >
            📋 Instructions
          </button>
          <button onClick={leaveRoom} className="leave-btn">
            🚪 Leave Room
          </button>
        </div>
      </div>

      {countdown && (
        <div className="countdown-overlay">
          <div className="countdown-display">
            <h3>Game Starting In</h3>
            <div className="countdown-number">{countdown}</div>
            <p>Get ready to play {selectedGameInfo?.name}!</p>
          </div>
        </div>
      )}

      <div className="game-room-content">
        <div className="participants-section">
          <h3>👥 Participants ({participants.length})</h3>
          <div className="participants-grid">
            {participants.map(participant => (
              <div 
                key={participant.userId} 
                className={`participant-card ${participant.userId === user.uid ? 'current-user' : ''}`}
              >
                <img 
                  src={participant.userAvatar || '/default-avatar.png'} 
                  alt={participant.userName}
                  className="participant-avatar"
                />
                <div className="participant-info">
                  <div className="participant-name">
                    {participant.userName}
                    {participant.userId === roomData.hostId && ' 👑'}
                  </div>
                  <div className="participant-status">
                    {participant.status || 'Ready'}
                  </div>
                </div>
                
                {isHost && participant.userId !== user.uid && (
                  <button 
                    onClick={() => kickPlayer(participant.userId)}
                    className="kick-btn"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="game-selection-section">
          {isHost ? (
            <div className="host-controls">
              <h3>🎯 Select Game (Host Controls)</h3>
              <div className="game-options">
                {availableGames.map(game => (
                  <div 
                    key={game.id}
                    className={`game-option ${selectedGame === game.id ? 'selected' : ''}`}
                    onClick={() => setSelectedGame(game.id)}
                  >
                    <div className="game-name">{game.name}</div>
                    <div className="game-players">
                      {game.minPlayers}-{game.maxPlayers} players
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={startGame}
                className={`start-game-btn ${canStartGame ? 'enabled' : 'disabled'}`}
                disabled={!canStartGame}
              >
                🚀 Start Game
              </button>
              
              {selectedGameInfo && (
                <div className="game-requirements">
                  {participants.length < selectedGameInfo.minPlayers && (
                    <p className="requirement-warning">
                      Need {selectedGameInfo.minPlayers - participants.length} more players
                    </p>
                  )}
                  {participants.length > selectedGameInfo.maxPlayers && (
                    <p className="requirement-warning">
                      Too many players! Max: {selectedGameInfo.maxPlayers}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="waiting-for-host">
              <h3>⏳ Waiting for Host</h3>
              <p>The host will select a game and start when ready</p>
              {selectedGame && (
                <p>Selected game: <strong>{selectedGameInfo?.name}</strong></p>
              )}
            </div>
          )}
        </div>

        <div className="mini-games-section">
          <h3>🎮 Mini-Games (While Waiting)</h3>
          <div className="mini-games-grid">
            {miniGames.map(game => (
              <div key={game.id} className="mini-game-card">
                <div className="mini-game-icon">{game.icon}</div>
                <div className="mini-game-name">{game.name}</div>
                <button 
                  onClick={() => startMiniGame(game.id)}
                  className="play-mini-btn"
                  disabled={currentMiniGame === game.id}
                >
                  {currentMiniGame === game.id ? 'Playing...' : 'Play'}
                </button>
              </div>
            ))}
          </div>
          
          {currentMiniGame === 'clickSpeed' && (
            <div className="mini-game-active">
              <h4>⚡ Click Speed Test</h4>
              <p>Click as fast as you can for 10 seconds!</p>
              <button onClick={playClickSpeedGame} className="start-mini-btn">
                Start Test
              </button>
            </div>
          )}
          
          {miniGameScore > 0 && (
            <div className="mini-game-score">
              <h4>🏆 Your Score: {miniGameScore}</h4>
            </div>
          )}
        </div>
      </div>

      {showInstructions && (
        <Instructions 
          instructions={gameRoomInstructions}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
};

export default GameRoom;