import type { VioletEnv } from '@violet/def/env/violet'
import type { winston } from '@violet/lib/logger'
import type { Credential } from 'firebase-admin/app'
import { applicationDefault, cert } from 'firebase-admin/app'
import * as fs from 'fs'

interface CreateFirebaseCredentialParams {
  env: VioletEnv
  logger: winston.Logger
}
export const createFirebaseCredential = ({
  env,
  logger,
}: CreateFirebaseCredentialParams): Credential | null => {
  const { FIREBASE_AUTH_EMULATOR_HOST, GOOGLE_APPLICATION_CREDENTIALS, GCIP_CONFIG_JSON } = env
  if (GCIP_CONFIG_JSON) {
    logger.info('GCIP_CONFIG_JSON found.')
    return cert(JSON.parse(GCIP_CONFIG_JSON))
  }
  if (FIREBASE_AUTH_EMULATOR_HOST) {
    // https://firebase.google.com/docs/emulator-suite/connect_auth#node.js-admin-sdk
    logger.warn('FIREBASE_AUTH_EMULATOR_HOST found and starting in emulator mode.')
    return null
  }
  if (GOOGLE_APPLICATION_CREDENTIALS) {
    logger.info('GOOGLE_APPLICATION_CREDENTIALS found.')
    return cert(JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS).toString('utf-8')))
  }
  logger.info('No firebase credential information found.')
  return applicationDefault()
}
