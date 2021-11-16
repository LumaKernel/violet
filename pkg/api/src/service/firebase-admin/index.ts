import admin from 'firebase-admin'
import { createFirebaseCredential } from './credentials'

const credential = createFirebaseCredential()
// Firebase App instance should be singleton.
export const app = admin.initializeApp({
  credential,
})
