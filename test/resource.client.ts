import type { ApiConfig } from './api.server'
import { createClient } from '../src/client'
import { Equal, Expect } from './utils'

export const resourceClient = createClient<ApiConfig>({
  baseURI: 'https://api.example.com',
})

const methodTest0 = resourceClient.fetch({
  resource: 'users',
  type: 'collection',
  // should error and blow up the type
  method: 'GET',
  search: {
    limit: 10,
  },
})

type Test0 = typeof methodTest0
type O0 = Expect<
  Equal<
    Test1['options'],
    {
      resources: 'users' | 'market'
      methods: 'GET' | 'POST'
      search: {
        limit: number
      }
    }
  >
>
type S0 = Expect<
  Equal<
    Test1['selector'],
    {
      resource: 'users'
      type: 'collection'
      method: 'GET'
      search: {
        limit: number
      }
    }
  >
>

const methodTest1 = resourceClient.fetch({
  resource: 'users',
  type: 'collection',
  // should error and blow up the type
  method: 'DELETE',
})

type Test1 = typeof methodTest1
type O1 = Expect<
  Equal<
    Test1['options'],
    {
      resources: 'users' | 'market'
      methods: 'GET' | 'POST'
      search: unknown
    }
  >
>
type S1 = Expect<
  Equal<
    Test1['selector'],
    {
      resource: 'users' | 'market'
      type: 'collection' | 'item'
      method: 'GET' | 'POST'
      search?: unknown
    }
  >
>

const methodTest2 = resourceClient.fetch({
  resource: 'users',
  type: 'collection',
  // should not error
  method: 'POST',
  search: {
    limit: 10,
    foo: 'bar',
  },
})

type Test2 = typeof methodTest2
type O2 = Expect<
  Equal<
    Test2['options'],
    {
      resources: 'users' | 'market'
      methods: 'GET' | 'POST'
      search: {
        limit: number
      }
    }
  >
>
type S2 = Expect<
  Equal<
    Test2['selector'],
    {
      resource: 'users'
      type: 'collection'
      method: 'POST'
    }
  >
>

const methodTest3 = resourceClient.fetch({
  resource: 'users',
  type: 'collection',
  // should not error
  method: 'GET',
})

type Test3 = typeof methodTest3
type S3 = Expect<
  Equal<
    Test3['selector'],
    {
      resource: 'users'
      type: 'collection'
      method: 'GET'
    }
  >
>

const methodTest4 = resourceClient.fetch({
  resource: 'market',
  type: 'collection',
  // should not error
  method: 'POST',
})

type Test4 = typeof methodTest4
//   ^?
// should only be GET
