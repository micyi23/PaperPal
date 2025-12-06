import UploadButton from './UploadButton'

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="icon">📚</div>
      <h2>Your library is empty</h2>
      <p>Upload your first PDF to get started</p>
      <UploadButton />
    </div>
  )
}

export default EmptyState