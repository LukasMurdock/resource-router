import type { ApiConfig } from './api.server'
import { createClient } from '../src/client'

export const resourceClient = createClient<ApiConfig>({
  baseURI: 'https://api.example.com',
})

const collection = await resourceClient
  .get('users')
  .collection.method('GET')
  .input({
    search: {
      limit: 10,
    },
  })
  .fetch()

type collection = typeof collection
//   ^?

const item = await resourceClient
  .get('users')
  .item.id('2')
  .method('GET')
  .input({
    search: {
      limit: 10,
    },
  })
  .fetch()
type item = typeof item
//   ^?

const newUser = await resourceClient
  .get('users')
  .collection.method('POST')
  .input({
    body: {
      name: 'John Doe',
    },
  })
  .fetch()

// resourceClient.get('users').collection.method('POST')
