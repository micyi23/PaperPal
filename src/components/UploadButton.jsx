import { useRef } from 'react'
import { useApp } from '../context/AppContext'

function UploadButton() {
  const { addFile } = useApp()
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type by MIME type or extension
    const isValidPDF = file.type === 'application/pdf' || 
                       file.name.toLowerCase().endsWith('.pdf')
    const isValidEPUB = file.type === 'application/epub+zip' || 
                       file.type === 'application/epub' ||
                       file.name.toLowerCase().endsWith('.epub')

    if (isValidPDF || isValidEPUB) {
      addFile(file)
    } else {
      alert('Please upload a PDF or EPUB file')
    }
    e.target.value = '' // Reset input
  }

  return (
    <>
      <button className="upload-btn" onClick={handleClick}>
        <span>📤</span>
        <span>Upload PDF/EPUB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.epub,application/pdf,application/epub+zip"
        onChange={handleFileChange}
        className="hidden-input"
      />
    </>
  )
}

export default UploadButton