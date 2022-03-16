import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Modal, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { database, storage } from '../../firebase'
import { useAuth } from '../../contexts/AuthContext'

function Folder({ folder }) {
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
    database.folders.doc(folder.id).delete()
    database.files
      .where('folderId', '==', folder.id)
      .where('userId', '==', currentUser.uid)
      .get()
      .then((files) => {
        files.docs.forEach((file) => {
          file.ref.delete()
          if (file.data().folderId == null) {
            storage
              .ref(`/files/${currentUser.uid}/${file.data().name}`)
              .delete()
          } else {
            storage
              .ref(
                `/files/${currentUser.uid}/${folder.name}/${file.data().name}`
              )
              .delete()
          }
        })
      })
  }
  return (
    <>
      <Button
        to={`/folder/${folder.id}`}
        as={Link}
        variant='outline-dark'
        className='text-truncate w-100'
        onContextMenu={(e) => openModal(e)}
      >
        <FontAwesomeIcon icon={faFolder} className='mr-2' /> {folder.name}
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleDelete}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Delete?</Form.Label>
              <br />
              <Form.Text>
                Are you sure you want to delete {folder.name} folder?
                <br />
                This will also delete all the files inside this folder.
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

export default Folder
