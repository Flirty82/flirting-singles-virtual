/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Music, Users, MessageCircle, Heart, Send, Star, Crown, Volume2, VolumeX, Settings, Camera, CameraOff, Phone } from 'lucide-react';

const KaraokeRoom = () => {
  // Room state
  const [roomId] = useState('ROOM001');
  const [user] = useState({ id: 1, name: 'Alex', avatar: '👨‍🎤' });
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Alex', avatar: '👨‍🎤', isHost: true, isSinging: false, score: 0 },
    { id: 2, name: 'Sarah', avatar: '👩‍🎤', isHost: false, isSinging: false, score: 85 },
    { id: 3, name: 'Mike', avatar: '🎭', isHost: false, isSinging: true, score: 92 },
    { id: 4, name: 'Emma', avatar: '🎵', isHost: false, isSinging: false, score: 78 }
  ]);

  // Audio/Video state
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [volume, setVolume] = useState(75);

  // Song state
  const [currentSong, setCurrentSong] = useState({
    title: "Perfect",
    artist: "Ed Sheeran",
    duration: 263,
    currentTime: 0,
    isPlaying: false
  });
  const [showSongSelector, setShowSongSelector] = useState(false);
  const [songQueue, setSongQueue] = useState([
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", duration: 355, requestedBy: "Sarah" },
    { id: 2, title: "Shape of You", artist: "Ed Sheeran", duration: 233, requestedBy: "Mike" }
  ]);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Sarah', message: 'Great song choice! 🎵', timestamp: '10:30 PM', type: 'message' },
    { id: 2, user: 'Mike', message: 'Your voice is amazing! ❤️', timestamp: '10:31 PM', type: 'compliment' },
    { id: 3, user: 'Emma', message: 'Can we do a duet next?', timestamp: '10:32 PM', type: 'message' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Scoring system
  const [currentScore, setCurrentScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // Popular songs for selection
  const popularSongs = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", difficulty: "Medium" },
    { id: 2, title: "Watermelon Sugar", artist: "Harry Styles", difficulty: "Easy" },
    { id: 3, title: "Levitating", artist: "Dua Lipa", difficulty: "Medium" },
    { id: 4, title: "Drivers License", artist: "Olivia Rodrigo", difficulty: "Hard" },
    { id: 5, title: "Good 4 U", artist: "Olivia Rodrigo", difficulty: "Medium" },
    { id: 6, title: "Heat Waves", artist: "Glass Animals", difficulty: "Easy" }
  ];

  // Simulate song progress
  useEffect(() => {
    if (currentSong.isPlaying) {
      const interval = setInterval(() => {
        setCurrentSong(prev => ({
          ...prev,
          currentTime: Math.min(prev.currentTime + 1, prev.duration)
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentSong.isPlaying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        user: user.name,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'message'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const sendCompliment = (targetUser) => {
    const compliments = [
      "Amazing voice! 🌟",
      "You're killing it! 🔥",
      "Beautiful performance! ❤️",
      "So talented! 👏",
      "Love your style! ✨"
    ];
    const compliment = compliments[Math.floor(Math.random() * compliments.length)];
    const message = {
      id: chatMessages.length + 1,
      user: user.name,
      message: `@${targetUser} ${compliment}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'compliment'
    };
    setChatMessages([...chatMessages, message]);
  };

  const startSinging = () => {
    setIsRecording(true);
    setCurrentSong(prev => ({ ...prev, isPlaying: true }));
    setParticipants(prev => 
      prev.map(p => p.id === user.id ? { ...p, isSinging: true } : { ...p, isSinging: false })
    );
  };

  const stopSinging = () => {
    setIsRecording(false);
    setCurrentSong(prev => ({ ...prev, isPlaying: false }));
    setShowScore(true);
    setCurrentScore(Math.floor(Math.random() * 40) + 60); // Random score 60-100
    setTimeout(() => setShowScore(false), 3000);
    setParticipants(prev => 
      prev.map(p => p.id === user.id ? { ...p, isSinging: false } : p)
    );
  };

  const selectSong = (song) => {
    setCurrentSong({
      title: song.title,
      artist: song.artist,
      duration: 240,
      currentTime: 0,
      isPlaying: false
    });
    setShowSongSelector(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Karaoke Room #{roomId}</h1>
              <p className="text-sm text-gray-300">{participants.length} participants</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Phone className="w-4 h-4" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Stage Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video/Stage Area */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Stage lighting effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 via-transparent to-purple-600/20"></div>
              
              {/* Current singer */}
              <div className="text-center z-10">
                <div className="text-8xl mb-4">🎤</div>
                <h3 className="text-2xl font-bold mb-2">
                  {participants.find(p => p.isSinging)?.name || 'Ready to Sing?'}
                </h3>
                {currentSong.title && (
                  <p className="text-gray-300">
                    Now Playing: {currentSong.title} - {currentSong.artist}
                  </p>
                )}
              </div>

              {/* Animated background */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={isMuted ? () => setIsMuted(false) : () => setIsMuted(true)}
                className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} hover:bg-opacity-80 transition-colors`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              <button
                onClick={isVideoOn ? () => setIsVideoOn(false) : () => setIsVideoOn(true)}
                className={`p-3 rounded-full ${!isVideoOn ? 'bg-red-500' : 'bg-gray-600'} hover:bg-opacity-80 transition-colors`}
              >
                {isVideoOn ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
              </button>
              
              <button
                onClick={isRecording ? stopSinging : startSinging}
                className={`px-6 py-3 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                } font-semibold transition-all transform hover:scale-105`}
              >
                {isRecording ? 'Stop Singing' : 'Start Singing'}
              </button>
            </div>
          </div>

          {/* Song Controls */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🎵</div>
                <div>
                  <h3 className="font-bold">{currentSong.title}</h3>
                  <p className="text-gray-300 text-sm">{currentSong.artist}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowSongSelector(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-lg transition-all"
              >
                Choose Song
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>{formatTime(currentSong.currentTime)}</span>
                <span>{formatTime(currentSong.duration)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(currentSong.currentTime / currentSong.duration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-4">
              <Volume2 className="w-5 h-5" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-300 w-12">{volume}%</span>
            </div>
          </div>

          {/* Song Queue */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Music className="w-5 h-5 mr-2" />
              Song Queue
            </h3>
            <div className="space-y-3">
              {songQueue.map((song, index) => (
                <div key={song.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-gray-300">{song.artist} • Requested by {song.requestedBy}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{formatTime(song.duration)}</span>
                </div>
              ))}
              {songQueue.length === 0 && (
                <p className="text-gray-400 text-center py-4">No songs in queue. Add some songs to get started!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participants */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Participants ({participants.length})
            </h3>
            <div className="space-y-3">
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{participant.avatar}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{participant.name}</span>
                        {participant.isHost && <Crown className="w-4 h-4 text-yellow-400" />}
                        {participant.isSinging && (
                          <span className="bg-red-500 text-xs px-2 py-1 rounded-full animate-pulse">
                            SINGING
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-300">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span>{participant.score}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => sendCompliment(participant.name)}
                    className="text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat
            </h3>
            
            <div className="h-64 overflow-y-auto space-y-3 mb-4">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`p-3 rounded-lg ${
                  msg.type === 'compliment' ? 'bg-pink-500/20 border border-pink-500/30' : 'bg-white/5'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{msg.user}</span>
                    <span className="text-xs text-gray-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 p-2 rounded-lg transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Song Selector Modal */}
      {showSongSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Choose a Song</h2>
              <button
                onClick={() => setShowSongSelector(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid gap-4">
              {popularSongs.map(song => (
                <div
                  key={song.id}
                  onClick={() => selectSong(song)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all border border-white/10 hover:border-purple-400"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{song.title}</h3>
                      <p className="text-gray-300 text-sm">{song.artist}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        song.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                        song.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {song.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Score Display */}
      {showScore && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl text-center animate-bounce">
            <div className="text-4xl font-bold">🌟 {currentScore} 🌟</div>
            <p className="text-lg font-semibold">
              {currentScore >= 90 ? 'Amazing!' : currentScore >= 75 ? 'Great Job!' : 'Good Effort!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KaraokeRoom;