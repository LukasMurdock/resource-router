# Resource Router

## Conventions

- Web Fetch API Request and Response
- API config defines `baseURL` and all `resources`
- Routes are defined by resource keys (key: user -> `/user`)
- A resource has two route types; collection and item (collection: `/user/`, item: `/user/1`)
- Route types have optional methods: GET, POST, PUT, DELETE
- Route objects define functions for type inference
  - `validateSearch: (search: URLSearchParams) => ValidatedSearch`
  - `validateHeaders: (headers: Headers) => ValidatedHeaders`
  - `validateBody: (body: any) => ValidatedBody`
  - `handler: (req: {id: string | never, search: ValidatedSearch, headers: ValidatedHeaders, body: ValidatedBody}) => ApiHandlerResponse`
- GET requests do not have a body. Therefore the GET method route object should not accept `validateBody`.
- Item routes provide the resource `id` parameter to the handler. Collection routes never provide the id parameter.
- Handlers return a `ApiHandlerResponse` type for response type inference.

### Convention implications

- able to wrap `fetch()` with type annotations from api route object types to create a `resourceClient`
- No nested resources
- Bad optional search parameter type handling

## Example

```typescript
// file: /resources/user.ts
const user = defineResource({
  key: 'users',
  collection: {
    methods: {
      GET: {
        operationId: 'getUsers',
        validateSearch: (search) => {
          return {
            limit: 10,
          }
        },
        validateHeaders: (headers) => headers,
        handler: async ({ search, headers }) => {
          // search.limit === 'number'
          // headers === any
          return json({
            users: [],
          })
        },
      },
      POST: {
        operationId: 'createUser',
        validateSearch: (search) => {
          return {
            limit: 10,
          }
        },
        validateHeaders: (headers) => headers,
        // Check validateBody throws type error in GET
        validateBody: (body) => {
          return {
            name: 'John Doe',
          }
        },
        handler: async ({ search, headers, body }) => {
          // body.name === string
          return json({
            user: {
              id: '123',
              name: 'John Doe',
            },
          })
        },
      },
    },
  },
  item: {
    methods: {
      GET: {
        operationId: 'getUser',
        validateSearch: (search) => search,
        validateHeaders: (headers) => headers,
        validateBody: (body) => body,
        handler: async ({ search }) => {
          return json({
            user: {},
          })
        },
      },
    },
  },
})

// file: /api.ts
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
  convertRuntimeToRequest: (req) => any,
  convertHandlerToRuntime: (res) => any,
  resources: [user, market],
})

export type Api = typeof api

// file: /client.ts
export const resourceClient = createClient<ApiConfig>({
  baseURI: 'https://api.example.com',
})

// file: /anywhere.ts
const users = await resourceClient
  .get('users')
  .collection.method('GET')
  .input({
    search: {
      limit: 10,
    },
  })
  .fetch()

const user = await resourceClient
  .get('users')
  .item.id('1')
  .method('GET')
  .input({
    search: {
      limit: 10,
    },
  })
  .fetch()

const createdUser = await resourceClient
  .get('users')
  .collection.method('POST')
  .input({
    body: {
      name: 'John Doe',
    },
  })
  .fetch()
```
