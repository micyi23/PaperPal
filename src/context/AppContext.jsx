'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const addFile = async (file) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: 'uploading',
      statusMessage: 'Uploading file...',
      file: file,
      audioUrl: null
    }
    setFiles([newFile, ...files])
    
    try {
      // Update status: Extracting text
      setFiles(prev => 
        prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: 'processing', statusMessage: 'Extracting text from file...' } 
            : f
        )
      )

      const formData = new FormData()
      formData.append('file', file)

      // Update status: Generating audio
      setFiles(prev => 
        prev.map(f => 
          f.id === newFile.id 
            ? { ...f, statusMessage: 'Generating audio...' } 
            : f
        )
      )

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await res.json()
      } else {
        const text = await res.text()
        console.error('Non-JSON response:', text)
        throw new Error('Server returned invalid response')
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process file')
      }

      if (data.audioUrl) {
        setFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'ready', statusMessage: 'Ready to play', audioUrl: data.audioUrl } 
              : f
          )
        )
      } else {
        throw new Error(data.error || 'Failed to process file')
      }
    } catch (error) {
      console.error('File processing error:', error)
      setFiles(prev => 
        prev.map(f => 
          f.id === newFile.id 
            ? { ...f, status: 'error', statusMessage: error.message || 'Processing failed', error: error.message } 
            : f
        )
      )
    }
  }

  const deleteFile = (id) => {
    setFiles(files.filter(f => f.id !== id))
    if (currentFile?.id === id) {
      setCurrentFile(null)
      setIsPlaying(false)
    }
  }

  const playFile = (file) => {
    setCurrentFile(file)
    setIsPlaying(true)
    setProgress(0)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  const value = {
    darkMode,
    toggleDarkMode,
    files,
    addFile,
    deleteFile,
    currentFile,
    playFile,
    isPlaying,
    togglePlayPause,
    progress,
    setProgress,
    currentTime,
    setCurrentTime,
    duration,
    setDuration
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}

