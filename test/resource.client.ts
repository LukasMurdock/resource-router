import type { ApiConfig } from './api.server'
import { createClient } from '../src/client'

export const resourceClient = createClient<ApiConfig>({
  baseURI: 'https://api.example.com',
})

const methodTest1 = resourceClient.fetch({
  resource: 'users',
  type: 'collection',
  // should error
  method: 'DELETE',
})

type Test1 = typeof methodTest1
//   ^?

const methodTest2 = resourceClient.fetch({
  resource: 'users',
  type: 'collection',
  // should not error
  method: 'POST',
})

type Test2 = typeof methodTest2
//   ^?

const methodTest3 = resourceClient.fetch({
  resource: 'users',
  type: 'collection',
  // should not error
  method: 'GET',
})

type Test3 = typeof methodTest3
//   ^?
