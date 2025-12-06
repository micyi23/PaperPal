import { useApp } from '../context/AppContext'

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useApp()

  return (
    <button className="theme-toggle" onClick={toggleDarkMode}>
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle