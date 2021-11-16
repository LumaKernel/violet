import server from '@violet/api/$server'
import user from '@violet/api/src/fastify-plugins/fastify-user'
import violetInject from '@violet/api/src/fastify-plugins/fastify-violet-inject'
import { getCredentials } from '@violet/api/src/service/aws-credential'
import { parseVioletEnv } from '@violet/def/env/violet'
import { createLogger } from '@violet/lib/logger'
import { convertToFastifyLogger } from '@violet/lib/logger/fastify'
import Fastify from 'fastify'
import cookie from 'fastify-cookie'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'

const startServer = async () => {
  const env = parseVioletEnv(process.env)
  const { API_BASE_PATH, API_PORT } = env
  const credentials = getCredentials()

  const logger = createLogger({ env, service: '@violet/api', credentials })
  const fastify = Fastify({ logger: convertToFastifyLogger(logger) })

  server(fastify, { basePath: API_BASE_PATH })

  fastify.register(helmet)
  fastify.register(cors, {
    origin: true,
    credentials: true,
  })
  fastify.register(violetInject, { env, logger })
  fastify.register(cookie)
  fastify.register(user)
  // fastify.register(csrf)

  fastify.listen(API_PORT, '::')
  console.log(`API started on :: port ${API_PORT}`)
}

startServer()
