import type { Credential } from 'firebase-admin/app'
import { applicationDefault, cert } from 'firebase-admin/app'
import * as fs from 'fs'

export const createFirebaseCredential = (): Credential => {
  const { GOOGLE_APPLICATION_CREDENTIALS } = process.env
  if (GOOGLE_APPLICATION_CREDENTIALS) {
    return cert(JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS).toString('utf-8')))
  }
  return applicationDefault()
}
