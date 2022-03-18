import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const log = functions.logger.log
admin.initializeApp()

export const onFileUpload = functions.storage
  .object()
  .onFinalize(async (object) => {
    const userId = object.name?.split('/')[1]
    const size = parseInt(object.size)
    const user = await (
      await admin.firestore().doc(`users/${userId}`).get()
    ).data()
    const empty = user?.quota - user?.used
    if (empty < size && object.name) {
      admin.storage().bucket().file(object.name).delete()
      return
    }
    admin
      .firestore()
      .doc(`users/${userId}`)
      .update({
        used: admin.firestore.FieldValue.increment(size),
      })
  })

export const onFileDeleted = functions.storage
  .object()
  .onDelete(async (object) => {
    const userId = object.name?.split('/')[1]
    const size = parseInt(object.size)
    admin
      .firestore()
      .doc(`users/${userId}`)
      .update({
        used: admin.firestore.FieldValue.increment(-size),
      })
  })

export const onUserAdded = functions.auth.user().onCreate(async (user) => {
  const userId = user.uid
  const docRef = admin.firestore().doc(`users/${userId}`)
  return await docRef.set({
    quota: 104857600,
    used: 0,
    userId: userId,
  })
})
