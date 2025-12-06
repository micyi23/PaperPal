import { useApp } from '../context/AppContext'
import FileCard from './FileCard'
import EmptyState from './EmptyState'

function FileList() {
  const { files } = useApp()

  if (files.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="file-list">
      {files.map(file => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  )
}

export default FileList