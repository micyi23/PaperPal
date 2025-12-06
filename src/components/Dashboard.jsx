import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import FileList from '../components/FileList'
import AudioPlayer from '../components/AudioPlayer'
import { useApp } from '../context/AppContext'

function Dashboard() {
  const { currentFile } = useApp()

  return (
    <div className="dashboard">
      <Sidebar />
      
      <main className="main">
        <TopBar />
        
        <section className="content">
          <h1>Your Library</h1>
          <p>Uploaded PDFs ready to read aloud</p>
          <FileList />
        </section>
        
        {currentFile && <AudioPlayer />}
      </main>
    </div>
  )
}

export default Dashboard

