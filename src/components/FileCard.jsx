import { useApp } from '../context/AppContext'

function FileCard({ file }) {
  const { playFile, deleteFile } = useApp()
  const isReady = file.status === 'ready'
  const isProcessing = file.status === 'processing' || file.status === 'uploading'
  const isError = file.status === 'error'

  return (
    <div className="file-card">
      <div className="file-info">
        <div className="file-icon">📄</div>
        <div className="file-details">
          <div className="file-name">{file.name}</div>
          <div className="file-date">Uploaded: {file.date}</div>
        </div>
      </div>
      
      <div className="file-actions">
        {isReady ? (
          <>
            <span className="status ready">✅ Ready</span>
            <button 
              className="action-btn play" 
              onClick={() => playFile(file)}
              title="Play"
            >
              ▶
            </button>
            <button className="action-btn secondary" title="View Text">
              👁
            </button>
            <button className="action-btn secondary" title="Regenerate">
              🔄
            </button>
          </>
        ) : isError ? (
          <span className="status error" title={file.error}>
            ❌ Error: {file.statusMessage || 'Failed'}
          </span>
        ) : (
          <span className="status processing" title={file.statusMessage}>
            <span className="spinner"></span>
            {file.statusMessage || 'Processing...'}
          </span>
        )}
        <button 
          className="action-btn danger" 
          onClick={() => deleteFile(file.id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default FileCard