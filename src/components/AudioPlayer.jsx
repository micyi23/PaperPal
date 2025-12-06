import { useApp } from '../context/AppContext'

function AudioPlayer() {
  const { 
    currentFile, 
    isPlaying, 
    togglePlayPause,
    progress,
    currentTime,
    duration
  } = useApp()

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <footer className="audio-player">
      {/* Now Playing Info */}
      <div className="now-playing">
        <div className="now-playing-icon">PDF</div>
        <div className="now-playing-info">
          <div className="now-playing-title">{currentFile?.name}</div>
          <div className="now-playing-status">
            {isPlaying ? 'Playing...' : 'Paused'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button className="control-btn" title="Rewind 10s">⏪</button>
        <button className="play-btn" onClick={togglePlayPause}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="control-btn" title="Forward 10s">⏩</button>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <span className="time">{formatTime(currentTime)}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="time">{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="volume-section">
        <span className="volume-icon">🔊</span>
        <div className="volume-bar">
          <div className="volume-fill"></div>
        </div>
      </div>
    </footer>
  )
}

export default AudioPlayer