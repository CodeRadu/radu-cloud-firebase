import { Button, Card, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import CenteredContainer from './CenteredContainer'

function Profile() {
  const { logout, currentUser, userData } = useAuth()
  const [error, setError] = useState('')
  const history = useHistory()

  async function handleLogout() {
    setError('')
    try {
      await logout()
      history.push('/login')
    } catch (err) {
      setError(err)
    }
  }

  return (
    <>
      {userData ? (
        <CenteredContainer>
          <Card>
            <Card.Body>
              <h2 className='text-center mb-4'>Profile</h2>
              {error && <Alert variant='danger'>{error}</Alert>}
              <strong>Email:</strong> {currentUser.email}
              <br />
              <strong>Used Storage: </strong>
              {(userData.used / 1024 / 1024).toFixed(2)} MB /{' '}
              {userData.quota >= 0 ? userData.quota / 1024 / 1024 : '∞'} MB{' '}
              <br />
              <div className='w-100 text-center mt2'>
                <Button href='/download/radu-cloud-desktop.exe'>
                  Download the desktop version
                </Button>
                <br />
                <Link to='/'>Dashboard</Link>
              </div>
            </Card.Body>
          </Card>
          <div className='w-100 text-center mt-2'>
            <Button variant='link' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CenteredContainer>
      ) : (
        'Loading'
      )}
    </>
  )
}

export default Profile
