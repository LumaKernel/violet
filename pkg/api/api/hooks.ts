import type { FastifyReply, FastifyRequest } from 'fastify'
import { defineHooks } from './$relay'

const injectionKeysFromReply = ['setCookie'] as const

type InjectionFromReply = Pick<FastifyReply, typeof injectionKeysFromReply[number]>

export type AdditionalRequest = Pick<
  FastifyRequest,
  'cookies' | 'logger' | 'getUserClaims' | 'refreshUserClaims' | 'ensureUserClaims'
> &
  InjectionFromReply

export default defineHooks(() => ({
  onRequest: (req, reply, done) => {
    for (const key of injectionKeysFromReply) {
      const value = reply[key]
      Object.assign(req, {
        [key]: typeof value === 'function' ? value.bind(reply) : value,
      })
    }
    done()
  },
}))
