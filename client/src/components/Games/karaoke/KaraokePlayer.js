import React, { useState, useEffect, useRef } from 'react';

const KaraokePlayer = ({
  song,
  isCurrentPerformer,
  isRecording,
  onStartRecording,
  onStopRecording,
  currentPerformer
}) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [songProgress, setSongProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Sample lyrics data (placeholder - in real app would come from database)
  const getLyrics = (songId) => {
    const lyricsDatabase = {
      1: [
        { time: 0, text: "Just a small town girl" },
        { time: 3, text: "Livin' in a lonely world" },
        { time: 6, text: "She took the midnight train" },
        { time: 9, text: "Goin' anywhere" },
        { time: 12, text: "Just a city boy" },
        { time: 15, text: "Born and raised in South Detroit" },
        { time: 18, text: "He took the midnight train" },
        { time: 21, text: "Goin' anywhere" }
      ],
      3: [
        { time: 0, text: "Where it began, I can't begin to knowin'" },
        { time: 4, text: "But then I know it's growin' strong" },
        { time: 8, text: "Was in the spring" },
        { time: 10, text: "And spring became the summer" },
        { time: 12, text: "Who'd have believed you'd come along" }
      ]
    };
   
    return lyricsDatabase[songId] || [
      { time: 0, text: "♪ Instrumental ♪" },
      { time: 5, text: "♪ Music Playing ♪" },
      { time: 10, text: "♪ Sing Along! ♪" }
    ];
  };

  const lyrics = getLyrics(song.id);

  useEffect(() => {
    if (isCurrentPerformer && song) {
      setIsPlaying(true);
      startProgressTimer();
    } else {
      setIsPlaying(false);
      stopProgressTimer();
    }

    return () => stopProgressTimer();
  }, [isCurrentPerformer, song, startProgressTimer]);

  const startProgressTimer = () => {
    intervalRef.current = setInterval(() => {
      setSongProgress(prev => {
        const newProgress = prev + 1;
        updateCurrentLyric(newProgress);
        return newProgress;
      });
    }, 1000);
  };

  const stopProgressTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateCurrentLyric = (currentTime) => {
    const currentIndex = lyrics.findIndex((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
    });
   
    if (currentIndex !== -1 && currentIndex !== currentLyricIndex) {
      setCurrentLyricIndex(currentIndex);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSongDurationInSeconds = (duration) => {
    const [mins, secs] = duration.split(':').map(Number);
    return mins * 60 + secs;
  };

  const totalDuration = getSongDurationInSeconds(song.duration);
  const progressPercent = (songProgress / totalDuration) * 100;

  return (
    <div className="karaoke-player">
      <div className="song-header">
        <h2>{song.title}</h2>
        <p className="artist">by {song.artist}</p>
        {currentPerformer && (
          <p className="current-performer">
            🎤 {currentPerformer.userName} is performing
          </p>
        )}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        <div className="time-info">
          <span>{formatTime(songProgress)}</span>
          <span>{song.duration}</span>
        </div>
      </div>

      <div className="lyrics-display">
        <div className="lyrics-container">
          {lyrics.map((lyric, index) => (
            <div
              key={index}
              className={`lyric-line ${
                index === currentLyricIndex ? 'current' :
                index < currentLyricIndex ? 'past' : 'future'
              }`}
            >
              {lyric.text}
            </div>
          ))}
        </div>
      </div>

      <div className="player-status">
        {isPlaying && (
          <div className="playing-indicator">
            <div className="sound-wave">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
            <span>Playing</span>
          </div>
        )}
       
        {isRecording && (
          <div className="recording-indicator">
            <div className="recording-dot"></div>
            <span>Recording</span>
          </div>
        )}
      </div>

      {!isCurrentPerformer && currentPerformer && (
        <div className="spectator-mode">
          <p>🎵 Enjoying {currentPerformer.userName}'s performance</p>
          <div className="applause-btn">
            <button className="applause">👏 Applause</button>
          </div>
        </div>
      )}

      {/* Hidden audio element for future integration */}
      <audio
        ref={audioRef}
        src={`/karaoke-tracks/track${song.id}.mp3`}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default KaraokePlayer; 