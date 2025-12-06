import { useApp } from '../context/AppContext'

function Sidebar() {
  const menuItems = [
    { icon: '📖', label: 'Library', active: true },
    { icon: '🕐', label: 'Recently Played' },
    { icon: '❤️', label: 'Favorites' },
    { icon: '⚙️', label: 'Settings' },
    { icon: '❓', label: 'Help' }
  ]

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">📚</div>
        <span className="logo-text">PaperPal</span>
      </div>
      
      <nav>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar