import React, { useState } from 'react';

const KaraokePage = () => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('Main Room');
  
  const songs = [
    { id: 1, title: 'Can\'t Help Myself', artist: 'Four Tops', genre: 'Soul', difficulty: 'Easy' },
    { id: 2, title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Rock', difficulty: 'Hard' },
    { id: 3, title: 'I Will Survive', artist: 'Gloria Gaynor', genre: 'Disco', difficulty: 'Medium' },
    { id: 4, title: 'Perfect', artist: 'Ed Sheeran', genre: 'Pop', difficulty: 'Easy' },
    { id: 5, title: 'Don\'t Stop Me Now', artist: 'Queen', genre: 'Rock', difficulty: 'Medium' },
    { id: 6, title: 'Shallow', artist: 'Lady Gaga & Bradley Cooper', genre: 'Pop', difficulty: 'Medium' }
  ];

  const rooms = [
    { name: 'Main Room', participants: 12, current: 'Sarah M. - Can\'t Help Myself' },
    { name: 'Rock Classics', participants: 8, current: 'Mike R. - Bohemian Rhapsody' },
    { name: 'Love Songs', participants: 15, current: 'Emma L. - Perfect' }
  ];

  const queue = [
    { user: 'You', song: 'I Will Survive', position: 1 },
    { user: 'Alex K.', song: 'Don\'t Stop Me Now', position: 2 },
    { user: 'Lisa P.', song: 'Shallow', position: 3 }
  ];

  const playSong = (song) => {
    setSelectedSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="container">
      <div className="karaoke-header">
        <h1>🎤 Virtual Karaoke</h1>
        <p>Sing your heart out and connect with music lovers!</p>
      </div>
      
      <div className="karaoke-content">
        <div className="karaoke-sidebar">
          <div className="karaoke-rooms">
            <h3>Karaoke Rooms</h3>
            {rooms.map((room, index) => (
              <div 
                key={index} 
                className={`room-item ${currentRoom === room.name ? 'active' : ''}`}
                onClick={() => setCurrentRoom(room.name)}
              >
                <div className="room-name">{room.name}</div>
                <div className="room-info">
                  <span>{room.participants} participants</span>
                  <div className="room-current">Now: {room.current}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="song-queue">
            <h3>Queue</h3>
            {queue.map((item, index) => (
              <div key={index} className="queue-item">
                <span className="queue-position">{item.position}</span>
                <div className="queue-info">
                  <div className="queue-user">{item.user}</div>
                  <div className="queue-song">{item.song}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="karaoke-main">
          <div className="song-search">
            <input type="text" placeholder="Search for songs..." />
            <select>
              <option value="">All Genres</option>
              <option value="pop">Pop</option>
              <option value="rock">Rock</option>
              <option value="soul">Soul</option>
              <option value="disco">Disco</option>
            </select>
          </div>
          
          <div className="songs-grid">
            {songs.map(song => (
              <div key={song.id} className="song-card">
                <div className="song-info">
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                  <div className="song-meta">
                    <span className="song-genre">{song.genre}</span>
                    <span className={`song-difficulty ${song.difficulty.toLowerCase()}`}>
                      {song.difficulty}
                    </span>
                  </div>
                </div>
                <div className="song-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => playSong(song)}
                  >
                    🎤 Sing
                  </button>
                  <button className="btn btn-secondary">
                    ➕ Queue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedSong && (
        <div className="karaoke-player">
          <div className="player-info">
            <h3>Now Playing: {selectedSong.title}</h3>
            <p>by {selectedSong.artist}</p>
          </div>
          <div className="player-controls">
            <button 
              className="btn btn-primary"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedSong(null)}
            >
              ⏹️ Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};