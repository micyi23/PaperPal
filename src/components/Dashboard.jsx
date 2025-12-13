"use client";

import Sidebar from './Sidebar'
import TopBar from './TopBar'
import FileList from './FileList'
import AudioPlayer from './AudioPlayer'
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

