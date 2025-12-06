import UploadButton from './UploadButton'
import ThemeToggle from './ThemeToggle'

function TopBar() {
  return (
    <header className="topbar">
      <input 
        type="text" 
        className="search" 
        placeholder="🔍 Search your library..." 
      />
      
      <div className="topbar-actions">
        <UploadButton />
        <ThemeToggle />
        <div className="avatar">👤</div>
      </div>
    </header>
  )
}

export default TopBar