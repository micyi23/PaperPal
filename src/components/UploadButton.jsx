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
    if (file && file.type === 'application/pdf') {
      addFile(file)
    } else {
      alert('Please upload a PDF file')
    }
    e.target.value = '' // Reset input
  }

  return (
    <>
      <button className="upload-btn" onClick={handleClick}>
        <span>📤</span>
        <span>Upload PDF</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden-input"
      />
    </>
  )
}

export default UploadButton