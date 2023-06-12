import { defineResourceRouter } from '../src/server'
import { user } from './resources/user'
import { market } from './resources/market'

export const api = defineResourceRouter({
  baseURI: 'https://api.example.com',
  errorHandler: (error) => {
    return {
      status: 500,
      body: {
        error: error.message,
      },
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
