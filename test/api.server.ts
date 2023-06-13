import { defineResourceRouter } from '../src/server'
import { user } from './resources/user'
import { market } from './resources/market'
import { ResourceError } from '../src/shared'

export const api = defineResourceRouter({
  baseURI: 'https://api.example.com',
  errorHandler: (error) => {
    // TODO: move this into the server handler?
    if (error instanceof ResourceError) {
      return {
        status: error.code,
        body: {
          code: error.code,
          message: error.message,
          innererror: error.innererror,
        },
      }
    } else {
      return {
        status: 500,
        body: {
          code: 500,
          message: 'Internal Server Error',
          innererror: error,
        },
      }
    }
  },
  convertRuntimeToRequest: (req) => {
    return new Request('url', {
      method: 'GET',
    })
  },
  convertHandlerToRuntime: (res) => res,
  resources: [user, market],
})

export type ApiConfig = (typeof api)['apiConfig']
