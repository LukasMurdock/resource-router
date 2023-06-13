import type {
  AnyApi,
  ApiHandlerResponse,
  ConvertHandlerToResponse,
  DistributedKeyOf,
  SupportedHTTPMethod,
} from './server'
import { ResourceError, isResourceError } from './shared'

export function createClient<Api extends AnyApi>(baseFetchConfig: {
  baseURI: Api['baseURI']
}) {
  return {
    get: <TResourceKey extends Api['resources'][number]['key']>(
      resourceKey: TResourceKey,
    ) => {
      return {
        item: {
          id: (id: string) => {
            return {
              method: <
                SMethod extends DistributedKeyOf<
                  Extract<
                    Api['resources'][number],
                    {
                      key: TResourceKey
                    }
                  >['item']['methods']
                >,
              >(
                method: SMethod,
              ) => {
                return {
                  input: (
                    input: Extract<
                      Api['resources'][number],
                      {
                        key: TResourceKey
                      }
                    >['item']['methods'][typeof method] extends {
                      validateSearch?: (any: any) => infer TSearch
                      validateHeaders?: (any: any) => infer THeaders
                      validateBody?: (any: any) => infer TBody
                    }
                      ? {
                          search?: Partial<TSearch>
                          headers?: THeaders
                          body?: TBody
                        }
                      : never,
                  ) => {
                    return resourceFetcher<
                      Extract<
                        Api['resources'][number],
                        {
                          key: TResourceKey
                        }
                      >['item']['methods'][typeof method] extends {
                        handler: (any: any) => infer TResponse
                      }
                        ? TResponse extends Promise<ApiHandlerResponse>
                          ? ConvertHandlerToResponse<Awaited<TResponse>>
                          : never
                        : never
                    >({
                      baseURL: baseFetchConfig.baseURI,
                      routeType: 'item',
                      resourceId: id,
                      resourceKey,
                      method,
                      input,
                    })
                  },
                }
              },
            }
          },
        },
        collection: {
          method: (
            method: keyof Extract<
              Api['resources'][number],
              {
                key: TResourceKey
              }
            >['collection']['methods'],
          ) => {
            return {
              input: (
                input: Extract<
                  Api['resources'][number],
                  {
                    key: TResourceKey
                  }
                >['collection']['methods'][typeof method] extends {
                  validateSearch?: (any: any) => infer TSearch
                  validateHeaders?: (any: any) => infer THeaders
                  validateBody?: (any: any) => infer TBody
                }
                  ? {
                      search?: Partial<TSearch>
                      headers?: THeaders
                      body?: TBody
                    }
                  : never,
              ) => {
                return resourceFetcher<
                  Extract<
                    Api['resources'][number],
                    {
                      key: TResourceKey
                    }
                  >['collection']['methods'][typeof method] extends {
                    handler: (any: any) => infer TResponse
                  }
                    ? TResponse extends Promise<ApiHandlerResponse>
                      ? ConvertHandlerToResponse<Awaited<TResponse>>
                      : never
                    : never
                >({
                  baseURL: baseFetchConfig.baseURI,
                  resourceKey,
                  routeType: 'collection',
                  method: method as SupportedHTTPMethod,
                  resourceId: undefined as never,
                  input,
                })
              },
            }
          },
        },
      }
    },
  }
}

function resourceFetcher<
  TRes,
  TRouteType extends 'item' | 'collection' = 'item' | 'collection',
>(config: {
  baseURL: string
  resourceKey: string
  routeType: TRouteType
  resourceId: TRouteType extends 'item' ? string : never
  method: SupportedHTTPMethod
  input: {
    search?: any
    headers?: any
    body?: any
  }
}) {
  const resourcePath = `${config.baseURL}/${config.resourceKey}`
  // TODO: validate this works at all…
  const search = config.input.search
    ? new URLSearchParams(JSON.stringify(config.input.search)).toString()
    : ''
  const path =
    config.routeType === 'item'
      ? `${resourcePath}/${config.resourceId}`
      : `${resourcePath}`
  const endpoint = `${path}${search ? `?${search}` : ''}`
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  if (config.input.headers) {
    for (const [key, value] of Object.entries(config.input.headers)) {
      headers.set(key, String(value))
    }
  }

  return {
    /**
     * @throws {ResourceError} if the response is not successful (status in the range 200-299)
     */
    fetch: async () => {
      const response = await fetch(endpoint, {
        method: config.method,
        headers: headers,
        body: JSON.stringify(config.input.body),
      })
      if (response.ok) {
        const data = (await response.json()) as TRes
        return data
      } else {
        const data = await response.json()
        if (isResourceError(data.body)) {
          console.log('Thrown resource error')
          throw new ResourceError(
            data.body.code,
            data.body.message,
            data.body.innererror,
          )
        } else {
          console.log('Thrown unknown error')
          throw new ResourceError(500, 'Unknown error')
        }
      }
    },
    config: config,
  }
}
