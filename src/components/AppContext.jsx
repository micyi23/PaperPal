import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  // Theme state
  const [darkMode, setDarkMode] = useState(false)
  
  // Files state
  const [files, setFiles] = useState([])
  
  // Current playing file
  const [currentFile, setCurrentFile] = useState(null)
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Add file
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
    
    // Simulate processing (replace with real API call later)
    setTimeout(() => {
      setFiles(prev => 
        prev.map(f => 
          f.id === newFile.id ? { ...f, status: 'ready' } : f
        )
      )
    }, 3000)
  }

  // Delete file
  const deleteFile = (id) => {
    setFiles(files.filter(f => f.id !== id))
    if (currentFile?.id === id) {
      setCurrentFile(null)
      setIsPlaying(false)
    }
  }

  // Play file
  const playFile = (file) => {
    setCurrentFile(file)
    setIsPlaying(true)
    setProgress(0)
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Apply dark mode class to body
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