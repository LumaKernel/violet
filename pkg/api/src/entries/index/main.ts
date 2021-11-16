import server from '@violet/api/$server'
import user from '@violet/api/src/fastify-plugins/fastify-user'
import winstonLogger from '@violet/api/src/fastify-plugins/fastify-winston-logger'
import { getCredentials } from '@violet/api/src/service/aws-credential'
import envValues from '@violet/api/src/utils/envValues'
import { createLogger } from '@violet/lib/logger'
import { convertToFastifyLogger } from '@violet/lib/logger/fastify'
import Fastify from 'fastify'
import cookie from 'fastify-cookie'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'

const startServer = async () => {
  const { API_BASE_PATH, API_PORT } = envValues
  const credentials = getCredentials()

  const logger = createLogger({ env: envValues, service: '@violet/api', credentials })
  const fastify = Fastify({ logger: convertToFastifyLogger(logger) })

  server(fastify, { basePath: API_BASE_PATH })

  fastify.register(helmet)
  fastify.register(cors, {
    origin: true,
    credentials: true,
  })
  fastify.register(winstonLogger, { logger })
  fastify.register(cookie)
  fastify.register(user)
  // fastify.register(csrf)

  fastify.listen(API_PORT, '::')
  console.log(`API started on :: port ${API_PORT}`)
}

startServer()
