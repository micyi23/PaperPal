import { useApp } from '../context/AppContext'
import { useEffect, useRef, useState } from 'react'

function AudioPlayer() {
  const { 
    currentFile, 
    isPlaying, 
    togglePlayPause,
    progress,
    currentTime,
    duration,
    setProgress,
    setCurrentTime,
    setDuration
  } = useApp()
  
  const audioRef = useRef(null)

  useEffect(() => {
    if (!currentFile?.audioUrl) return

    const audio = new Audio(currentFile.audioUrl)
    audioRef.current = audio

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.pause()
      audio.src = ''
    }
  }, [isPlaying, currentFile, setProgress, setCurrentTime, setDuration])

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = pos * audioRef.current.duration
    }
  }

  return (
    <footer className="audio-player">
      <div className="now-playing">
        <div className="now-playing-icon">PDF</div>
        <div className="now-playing-info">
          <div className="now-playing-title">{currentFile?.name}</div>
          <div className="now-playing-status">
            {isPlaying ? 'Playing...' : 'Paused'}
          </div>
        </div>
      </div>

      <div className="player-controls">
        <button className="control-btn" title="Rewind 10s">⏪</button>
        <button className="play-btn" onClick={togglePlayPause}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="control-btn" title="Forward 10s">⏩</button>
      </div>

      <div className="progress-section">
        <span className="time">{formatTime(currentTime)}</span>
        <div className="progress-bar" onClick={handleSeek}>
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="time">{formatTime(duration)}</span>
      </div>

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