/* eslint-disable no-restricted-imports */
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
/* eslint-enable no-restricted-imports */

if (typeof window !== 'undefined') {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_GCIP_API_KEY,
    authDomain: 'violet-vpc-host-nonprod.firebaseapp.com',
  }
  firebase.initializeApp(config)
  // firebase.auth().tenantId = 'test-tenant-mzm4v'
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
}

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  Object.assign(window, { firebase })
}

export { firebase }
