/// <reference types="node" />

import type { winston } from '@violet/lib/logger'
import { createChildLogger } from '@violet/lib/logger'
import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    logger: winston.Logger
  }
}

export interface FastifyWinstonLoggerOptions {
  logger: winston.Logger
}

const fastifyWinstonLogger: FastifyPluginCallback<FastifyWinstonLoggerOptions> = fp(
  (fastify: FastifyInstance, options: FastifyWinstonLoggerOptions, next: () => void) => {
    fastify.decorateRequest('logger', null)

    fastify.addHook(
      'onRequest',
      (fastifyReq: FastifyRequest, _fastifyRes: FastifyReply, done: () => void) => {
        fastifyReq.logger = createChildLogger(
          createChildLogger(options.logger, fastifyReq.url),
          fastifyReq.method
        )
        done()
      }
    )

    next()
  },
  {
    fastify: '>=3',
    name: 'fastify-winston-logger',
  }
)

export default fastifyWinstonLogger
