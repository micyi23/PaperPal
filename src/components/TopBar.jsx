import UploadButton from './UploadButton'
import ThemeToggle from './ThemeToggle'

function TopBar() {
  return (
    <header className="top-bar">
      <input 
        type="text" 
        className="search" 
        placeholder="🔍 Search your library..." 
      />
      
      <div className="top-bar-actions">
        <UploadButton />
        <ThemeToggle />
        <div className="avatar">👤</div>
      </div>
    </header>
  )
}

export default TopBar