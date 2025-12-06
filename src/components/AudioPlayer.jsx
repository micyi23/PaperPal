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
  
  const utteranceRef = useRef(null)
  const chunksRef = useRef([])
  const currentChunkIndexRef = useRef(0)
  const startTimeRef = useRef(0)
  const currentFileIdRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  // Split text into chunks (sentences or paragraphs)
  const chunkText = (text) => {
    if (!text) return []
    
    // Split by sentences first, then by paragraphs if needed
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0)
    const chunks = []
    let currentChunk = ''
    const maxChunkSize = 200 // Characters per chunk for better performance
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkSize && currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }
    
    return chunks.length > 0 ? chunks : [text.substring(0, maxChunkSize)]
  }

  useEffect(() => {
    if (!currentFile?.text) {
      chunksRef.current = []
      currentChunkIndexRef.current = 0
      return
    }

    // Initialize chunks when file changes
    const fileId = currentFile.id
    if (currentFileIdRef.current !== fileId) {
      chunksRef.current = chunkText(currentFile.text)
      currentFileIdRef.current = fileId
      currentChunkIndexRef.current = 0
      const estimatedDuration = chunksRef.current.length * 3 // Rough estimate: 3 seconds per chunk
      setDuration(estimatedDuration)
      setProgress(0)
      setCurrentTime(0)
    }

    if (isPlaying && chunksRef.current.length > 0) {
      setIsLoading(true)
      
      const speakChunk = (index) => {
        if (index >= chunksRef.current.length) {
          // Finished all chunks
          togglePlayPause()
          setProgress(100)
          setIsLoading(false)
          return
        }

        if (!isPlaying) {
          setIsLoading(false)
          return
        }

        const chunk = chunksRef.current[index]
        const utterance = new SpeechSynthesisUtterance(chunk)
        
        utterance.onstart = () => {
          if (index === 0) {
            startTimeRef.current = Date.now()
          }
          setIsLoading(false)
        }
        
        utterance.onend = () => {
          currentChunkIndexRef.current = index + 1
          const elapsed = (Date.now() - startTimeRef.current) / 1000
          setCurrentTime(elapsed)
          const newProgress = ((index + 1) / chunksRef.current.length) * 100
          setProgress(newProgress)
          
          // Continue with next chunk
          if (isPlaying && index + 1 < chunksRef.current.length) {
            speakChunk(index + 1)
          } else {
            togglePlayPause()
            setIsLoading(false)
          }
        }
        
        utterance.onerror = (e) => {
          console.error('Speech synthesis error:', e)
          setIsLoading(false)
          if (e.error === 'interrupted') {
            // User paused, don't toggle
            return
          }
          // Continue with next chunk on error
          if (index + 1 < chunksRef.current.length) {
            speakChunk(index + 1)
          } else {
            togglePlayPause()
          }
        }
        
        utteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
      }

      // Start from current chunk index (for resume) or beginning
      const startIndex = isPlaying ? currentChunkIndexRef.current : 0
      speakChunk(startIndex)
    } else if (!isPlaying) {
      window.speechSynthesis.cancel()
      setIsLoading(false)
    }
    
    return () => {
      if (!isPlaying) {
        window.speechSynthesis.cancel()
        setIsLoading(false)
      }
    }
  }, [isPlaying, currentFile, togglePlayPause, setProgress, setCurrentTime, setDuration])

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
            {isLoading ? 'Loading...' : isPlaying ? 'Playing...' : 'Paused'}
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