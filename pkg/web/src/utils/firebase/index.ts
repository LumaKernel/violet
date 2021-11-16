/* eslint-disable no-restricted-imports */
import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
export { EmailAuthProvider, GithubAuthProvider } from 'firebase/auth'
/* eslint-enable no-restricted-imports */

const createAuth = () => {
  if (process.env.NEXT_PUBLIC_AUTH_EMULATOR) {
    // emulator settings
    // https://firebase.google.com/docs/emulator-suite/connect_auth
    const app = initializeApp({
      apiKey: 'fake-api-key',
    })
    const auth = getAuth(app)
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_AUTH_EMULATOR, {
      disableWarnings: process.env.NEXT_PUBLIC_AUTH_DISABLE_UI_WARNING === '1',
    })
    return auth
  } else {
    // production settings
    const config = {
      apiKey: process.env.NEXT_PUBLIC_GCIP_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_GCIP_AUTH_DOMAIN,
    }
    const app = initializeApp(config)
    const auth = getAuth(app)
    auth.setPersistence({ type: 'NONE' })
    return auth
  }
}

export const auth = typeof window !== 'undefined' ? createAuth() : null

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  Object.assign(window, { auth })
}
