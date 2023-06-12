# Resource Router

## Conventions

- Web Fetch API Request and Response
- API config defines `baseURL` and all `resources`
- Routes are defined by resource keys (key: user -> `/user`)
- A resource has two route types; collection and item (collection: `/user/`, item: `/user/1`)
- Route types have optional methods: GET, POST, PUT, DELETE
- Route objects define functions for
  - `validateSearch: (search: URLSearchParams) => ValidatedSearch`
  - `validateHeaders: (headers: Headers) => ValidatedHeaders`
  - `validateBody: (body: any) => ValidatedBody`
  - `handler: (req: {id: string | never, search: ValidatedSearch, headers: ValidatedHeaders, body: ValidatedBody}) => ApiHandlerResponse`
- GET requests do not have a body. Therefore the GET method route object should not accept `validateBody`.
- Item routes provide the resource `id` parameter to the handler. Collection routes never provide the id parameter.

### Convention implications

- No nested resources
- Bad optional search parameter type handling
- able to wrap `fetch()` with type annotations from api route object types

## Example

```typescript
type ApiHandlerResponse = {
  /**
   * HTTP status code.
   */
  status: number;
  headers?: Record<string, string>;
  /**
   * JSON serializable body.
   */
  body?: any;
};

// file: /resources/user.ts
const user = defineResource({
  key: "users",
  collection: {
    methods: {
      GET: {
        operationId: "getUsers",
        validateSearch: (search) => {
          return {
            limit: 10,
          };
        },
        validateHeaders: (headers) => headers,
        // GET requests do not have body
        // validateBody: (body) => {
        // 	return {
        // 		name: "John Doe",
        // 	};
        // },
        handler: async ({ search, headers }) => {
          // search.limit === 'number'
          // headers === any
          return {
            status: 200,
            body: {
              users: [
                {
                  name: "John",
                },
              ],
            },
          };
        },
      },
      POST: {
        operationId: "createUser",
        validateSearch: (search) => {
          return {
            limit: 10,
          };
        },
        validateHeaders: (headers) => headers,
        // Check validateBody throws type error in GET
        validateBody: (body) => {
          return {
            name: "John Doe",
          };
        },
        handler: async ({ search, headers, body }) => {
          // body.name === string
          return {
            status: 200,
            body: {
              users: [
                {
                  name: "John Doe",
                },
              ],
            },
          };
        },
      },
    },
  },
  item: {
    methods: {
      GET: {
        operationId: "getUser",
        validateSearch: (search) => search,
        validateHeaders: (headers) => headers,
        validateBody: (body) => body,
        handler: async ({ search }) => {
          return {
            status: 200,
            body: {
              user: {},
            },
          };
        },
      },
    },
  },
});

// file: /api.ts
export const api = defineResourceRouter({
  baseURI: "https://api.example.com",
  errorHandler: (error) => {
    return {
      status: 500,
      body: {
        error: error.message,
      },
    };
  },
  convertRuntimeToRequest: (req) => any,
  convertHandlerToRuntime: (res) => any,
  resources: [user, market],
});

export type Api = typeof api;

// file: /anywhere.ts
const users = resourceClient({
  resource: "users",
  type: "collection",
  method: "GET",
  search: {
    limit: 10,
  },
});

const user = resourceClient({
  resource: "users",
  type: "item",
  resourceId: "1",
  method: "GET",
});

const createdUser = resourceClient({
  resource: "users",
  type: "collection",
  method: "POST",
  body: {
    name: "John",
  },
});
```
