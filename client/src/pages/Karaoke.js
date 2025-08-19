import React, { useState, useEffect, useCallback, useRef } from 'react';
import KaraokePlayer from './KaraokePlayer';
import Instructions from '../common/Instructions';
import MembershipGate from '../common/MembershipGate';
import '../../styles/components/Karaoke.css';

const Karaoke = ({ user, socket }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songQueue, setSongQueue] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [currentPerformer, setCurrentPerformer] = useState(null);
  const [roomParticipants, setRoomParticipants] = useState([]);
  const [scores, setScores] = useState({});
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
 
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Sample song library
  const sampleSongs = [
    { id: 1, title: "Don't Stop Believin'", artist: "Journey", duration: "4:11", difficulty: "Easy" },
    { id: 2, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55", difficulty: "Hard" },
    { id: 3, title: "Sweet Caroline", artist: "Neil Diamond", duration: "3:21", difficulty: "Easy" },
    { id: 4, title: "I Will Survive", artist: "Gloria Gaynor", duration: "3:17", difficulty: "Medium" },
    { id: 5, title: "Living on a Prayer", artist: "Bon Jovi", duration: "4:09", difficulty: "Medium" },
    { id: 6, title: "Yesterday", artist: "The Beatles", duration: "2:05", difficulty: "Easy" },
    { id: 7, title: "Hotel California", artist: "Eagles", duration: "6:30", difficulty: "Hard" },
    { id: 8, title: "My Way", artist: "Frank Sinatra", duration: "4:35", difficulty: "Medium" },
    { id: 9, title: "Wonderwall", artist: "Oasis", duration: "4:18", difficulty: "Easy" },
    { id: 10, title: "Total Eclipse of the Heart", artist: "Bonnie Tyler", duration: "7:01", difficulty: "Hard" }
  ];

  useEffect(() => {
    setAvailableSongs(sampleSongs);
  }, []);

  // Join karaoke room
  const joinKaraokeRoom = useCallback((roomType = 'public') => {
    if (socket && user) {
      // Check membership for private rooms
      if (roomType === 'private' && user.membershipType !== 'diamond') {
        return false;
      }
     
      socket.emit('join_karaoke', {
        userId: user.uid,
        userName: user.displayName,
        roomType: roomType
      });
     
      setIsPrivateRoom(roomType === 'private');
      return true;
    }
    return false;
  }, [socket, user]);

  // Add song to queue
  const addToQueue = useCallback((song) => {
    if (socket && user) {
      socket.emit('add_to_karaoke_queue', {
        userId: user.uid,
        userName: user.displayName,
        song: song
      });
    }
  }, [socket, user]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Here you would typically upload to Firebase Storage
        console.log('Recording saved:', audioBlob);
       
        // Calculate simple score (placeholder)
        const score = Math.floor(Math.random() * 40) + 60; // 60-100
        setScores(prev => ({ ...prev, [user.uid]: score }));
       
        if (socket) {
          socket.emit('karaoke_performance_complete', {
            userId: user.uid,
            score: score,
            recordingUrl: 'placeholder-url'
          });
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [socket, user]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [isRecording]);

  // Skip current song
  const skipSong = useCallback(() => {
    if (socket) {
      socket.emit('skip_karaoke_song', { userId: user.uid });
    }
  }, [socket, user]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = (data) => {
      setSongQueue(data.queue);
      setCurrentSong(data.currentSong);
      setCurrentPerformer(data.currentPerformer);
    };

    const handleParticipantsUpdate = (data) => {
      setRoomParticipants(data.participants);
    };

    const handleSongStart = (data) => {
      setCurrentSong(data.song);
      setCurrentPerformer(data.performer);
    };

    const handleScoreUpdate = (data) => {
      setScores(prev => ({ ...prev, [data.userId]: data.score }));
    };

    socket.on('karaoke_queue_update', handleQueueUpdate);
    socket.on('karaoke_participants_update', handleParticipantsUpdate);
    socket.on('karaoke_song_start', handleSongStart);
    socket.on('karaoke_score_update', handleScoreUpdate);

    return () => {
      socket.off('karaoke_queue_update', handleQueueUpdate);
      socket.off('karaoke_participants_update', handleParticipantsUpdate);
      socket.off('karaoke_song_start', handleSongStart);
      socket.off('karaoke_score_update', handleScoreUpdate);
    };
  }, [socket]);

  const karaokeInstructions = {
    title: "How to Use Virtual Karaoke",
    steps: [
      "Browse the song library and select a song you'd like to perform",
      "Click 'Add to Queue' to join the performance lineup",
      "Wait for your turn - you'll see the queue on the right",
      "When it's your turn, the lyrics will appear on screen",
      "Click 'Start Recording' to begin your performance",
      "Sing along with the music and lyrics",
      "Click 'Stop Recording' when the song ends",
      "Get your performance score and see how you did!"
    ],
    tips: [
      "Use headphones to avoid audio feedback",
      "Practice songs before adding them to queue",
      "Diamond members get access to private rooms",
      "Higher scores unlock achievement badges"
    ]
  };

  const isCurrentPerformer = currentPerformer?.userId === user.uid;

  return (
    <div className="karaoke-container">
      <div className="karaoke-header">
        <h2>🎤 Virtual Karaoke</h2>
        <div className="karaoke-controls">
          <button
            onClick={() => setShowInstructions(true)}
            className="instructions-btn"
          >
            📋 Instructions
          </button>
         
          <div className="room-selector">
            <button
              onClick={() => joinKaraokeRoom('public')}
              className={`room-btn ${!isPrivateRoom ? 'active' : ''}`}
            >
              🌍 Public Room
            </button>
           
            {user.membershipType === 'diamond' ? (
              <button
                onClick={() => joinKaraokeRoom('private')}
                className={`room-btn ${isPrivateRoom ? 'active' : ''}`}
              >
                💎 Private Room
              </button>
            ) : (
              <MembershipGate feature="Private Karaoke Rooms">
                <button className="room-btn disabled">
                  🔒 Private Room
                </button>
              </MembershipGate>
            )}
          </div>
        </div>
      </div>

      <div className="karaoke-main">
        <div className="karaoke-stage">
          {currentSong ? (
            <KaraokePlayer
              song={currentSong}
              isCurrentPerformer={isCurrentPerformer}
              isRecording={isRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              currentPerformer={currentPerformer}
            />
          ) : (
            <div className="no-song">
              <h3>🎵 No Song Playing</h3>
              <p>Add a song to the queue to get started!</p>
            </div>
          )}

          {isCurrentPerformer && (
            <div className="performer-controls">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`record-btn ${isRecording ? 'recording' : ''}`}
              >
                {isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
              </button>
             
              <button onClick={skipSong} className="skip-btn">
                ⏭️ Skip Song
              </button>
            </div>
          )}
        </div>

        <div className="karaoke-sidebar">
          <div className="song-library">
            <h3>🎵 Song Library</h3>
            <div className="songs-list">
              {availableSongs.map(song => (
                <div key={song.id} className="song-item">
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                    <div className="song-meta">
                      <span className="duration">{song.duration}</span>
                      <span className={`difficulty ${song.difficulty.toLowerCase()}`}>
                        {song.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToQueue(song)}
                    className="add-queue-btn"
                  >
                    ➕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="queue-section">
            <h3>🎤 Performance Queue</h3>
            {songQueue.length > 0 ? (
              <div className="queue-list">
                {songQueue.map((item, index) => (
                  <div key={index} className="queue-item">
                    <div className="queue-position">{index + 1}</div>
                    <div className="queue-info">
                      <div className="performer">{item.performer.userName}</div>
                      <div className="song">{item.song.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-queue">Queue is empty</p>
            )}
          </div>

          <div className="participants-section">
            <h3>👥 Room Participants ({roomParticipants.length})</h3>
            <div className="participants-list">
              {roomParticipants.map(participant => (
                <div key={participant.userId} className="participant">
                  <img
                    src={participant.photoURL || '/default-avatar.png'}
                    alt={participant.userName}
                    className="participant-avatar"
                  />
                  <div className="participant-info">
                    <div className="participant-name">{participant.userName}</div>
                    {scores[participant.userId] && (
                      <div className="participant-score">
                        🏆 {scores[participant.userId]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showInstructions && (
        <Instructions
          instructions={karaokeInstructions}
          onClose={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
};

export default Karaoke; 