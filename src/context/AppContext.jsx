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

  const addFile = (file) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: 'processing',
      file: file
    }
    setFiles([newFile, ...files])
    
    setTimeout(() => {
      setFiles(prev => 
        prev.map(f => 
          f.id === newFile.id ? { ...f, status: 'ready' } : f
        )
      )
    }, 3000)
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

