/// <reference types="node" />

import { app } from '@violet/api/src/service/firebase-admin'
import type { UserClaims } from '@violet/def/user/session-claims'
import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    getUserClaims: () => Promise<UserClaims | null>
    ensureUserClaims: () => Promise<UserClaims>
    refreshUserClaims: () => Promise<UserClaims | null>
  }
}

type FastifyUserOptions = Record<string, never>

const fastifyUser: FastifyPluginCallback<FastifyUserOptions> = fp(
  (fastify: FastifyInstance, _options: FastifyUserOptions, next: () => void) => {
    fastify.decorateRequest('getUserClaims', null)
    fastify.decorateRequest('ensureUserClaims', null)
    fastify.decorateRequest('refreshGetUserClaims', null)

    fastify.addHook(
      'onRequest',
      (fastifyReq: FastifyRequest, fastifyReply: FastifyReply, done: () => void) => {
        let savedUserClaims: UserClaims | null | undefined = undefined
        const refreshUserClaims = async (): Promise<UserClaims | null> => {
          const session = fastifyReq.cookies['session'] || ''
          const decodedClaims = await app
            .auth()
            .verifySessionCookie(session, true)
            .catch(() => null)
          savedUserClaims = decodedClaims
          return savedUserClaims
        }
        const getUserClaims = async (): Promise<UserClaims | null> => {
          if (savedUserClaims === undefined) return refreshUserClaims()
          return savedUserClaims
        }
        const ensureUserClaims = async (): Promise<UserClaims> => {
          const userClaims = await getUserClaims()
          if (userClaims === null) {
            fastifyReply.status(401).send()
            throw new Error('User not authenticated.')
          }
          return userClaims
        }
        fastifyReq.getUserClaims = getUserClaims
        fastifyReq.refreshUserClaims = refreshUserClaims
        fastifyReq.ensureUserClaims = ensureUserClaims
        done()
      }
    )

    next()
  },
  {
    fastify: '>=3',
    name: 'fastify-user',
  }
)

export default fastifyUser
