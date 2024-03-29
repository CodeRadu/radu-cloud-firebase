import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { storage, database } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import { v4 as uuidv4 } from 'uuid'
import ReactDOM from 'react-dom'
import { ProgressBar, Toast, Modal, Button, Form } from 'react-bootstrap'

function AddFileButton({ currentFolder }) {
  const { currentUser, userData } = useAuth()
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [open, setOpen] = useState(false)
  function closeModal() {
    setOpen(false)
  }
  function handleUpload(file) {
    if (currentFolder == null || file == null) return
    const id = uuidv4()
    setUploadingFiles((prev) => [...prev, { id: id, progress: 0, error: false, transMega: 0, totalMega: 0 }])

    const parentPath =
      currentFolder.path.length > 0 ? `${currentFolder.path.join('/')}` : ''
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${parentPath}/${file.name}`
        : `${parentPath}/${currentFolder.name}/${file.name}`
    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes
        const transMega = snapshot.bytesTransferred / 1024 / 1024
        const totalMega = snapshot.totalBytes / 1024 / 1024
        setUploadingFiles((prev) => {
          return prev.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress, transMega, totalMega }
            }

            return uploadFile
          })
        })
      },
      () => {
        setUploadingFiles((prev) => {
          return prev.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true }
            }
            return uploadFile
          })
        })
      },
      () => {
        setUploadingFiles((prev) => {
          return prev.filter((uploadFile) => {
            return uploadFile.id !== id
          })
        })
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          database.files.add({
            url: url,
            name: file.name,
            createdAt: database.getCurrentTimestamp(),
            folderId: currentFolder.id,
            userId: currentUser.uid,
          })
        })
      }
    )
  }
  function getFiles(e, idx = 0) {
    const file = e.target.files[idx]
    handleUpload(file)
    setTimeout(() => {
      if (e.target.files[idx + 1] === undefined) return
      getFiles(e, idx + 1)
    }, 500)
  }
  function getTotalSize(e, idx = 0, total = 0) {
    const file = e.target.files[idx]
    const newSize = total + file.size
    if (e.target.files[idx + 1] === undefined) return newSize
    return getTotalSize(e, idx + 1, newSize)
  }
  function checkUpload(e) {
    if (e.target.files.length === 0) return
    const quota = userData.quota
    const used = userData.used
    const free = quota - used
    const total = getTotalSize(e)
    if (total > free && quota !== -1) {
      setOpen(true)
    } else getFiles(e)
  }
  return (
    <>
      <label className='btn btn-outline-success btn-sm m-0 mr-2'>
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type='file'
          onChange={checkUpload}
          style={{ opacity: '0', position: 'absolute', left: '-9999px' }}
          multiple={true}
        />
      </label>
      <Modal show={open} onHide={closeModal}>
        <Form>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Error</Form.Label>
              <br />
              <Form.Text>
                Uploading this file will exceed your quota. Please delete some
                files before uploading.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              maxWidth: '250px',
            }}
          >
            {uploadingFiles.map((file) => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploadingFiles((prev) => {
                    return prev.filter((uploadFile) => {
                      return uploadFile.id !== file.id
                    })
                  })
                }}
              >
                <Toast.Header
                  className='text-truncate w-100 d-block'
                  closeButton={file.error}
                >
                  Uploading {Math.round(file.transMega)}MB / {Math.round(file.totalMega)}MB
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    variant={file.error ? 'danger' : 'primary'}
                    animated={!file.error}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? 'Error'
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  )
}

export default AddFileButton
