import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
})

const firestore = app.firestore()
export const auth = app.auth()
export const storage = app.storage()

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
  firestore.useEmulator('localhost', 8080)
  auth.useEmulator('http://localhost:9099')
  storage.useEmulator('localhost', 9199)
}

export const database = {
  folders: firestore.collection('folders'),
  files: firestore.collection('files'),
  users: firestore.collection('users'),
  formatDoc: (doc) => {
    return { id: doc.id, ...doc.data() }
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
}
export default app
