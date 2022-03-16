import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Form } from 'react-bootstrap'
import React, { useState } from 'react'
import { database, storage } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

function File({ file }) {
  const [open, setOpen] = useState(false)
  const { currentUser } = useAuth()
  function openModal(e) {
    e.preventDefault()
    setOpen(true)
  }
  function closeModal() {
    setOpen(false)
  }
  function handleDelete(e) {
    e.preventDefault()
    closeModal()
    database.files.doc(file.id).delete()
    if (file.folderId == null) {
      storage.ref(`/files/${currentUser.uid}/${file.name}`).delete()
    } else {
      database.folders
        .doc(file.folderId)
        .get()
        .then((folder) => {
          storage
            .ref(`/files/${currentUser.uid}/${folder.data().name}/${file.name}`)
            .delete()
        })
    }
  }
  return (
    <>
      <a
        href={file.url}
        target='_blank'
        className='btn btn-outline-dark text-truncate w-100'
        rel='noreferrer'
        onContextMenu={(e) => openModal(e)}
      >
        <FontAwesomeIcon icon={faFile} className='mr-2' /> {file.name}
      </a>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleDelete}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Delete?</Form.Label>
              <br />
              <Form.Text>
                Are you sure you want to delete {file.name} file?
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={closeModal}>
              Cancel
            </Button>
            <Button variant='danger' type='submit'>
              Delete
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default File
