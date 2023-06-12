export type SupportedHTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type ApiHandlerResponse = {
  /**
   * HTTP status code.
   */
  status: number
  headers?: Record<string, string>
  /**
   * JSON serializable body.
   */
  body?: any
}

class ResourceError extends Error {
  /** the HTTP status code applicable to this problem. */
  code: number
  /** optional structured instance */
  innererror: any

  constructor(code: number, message: string, innererror?: any) {
    super(message)
    this.name = 'ValidationError'
    this.code = code
    this.message = message
    this.innererror = innererror
  }
}

//////////
type UndefinedRecord = Record<string, any> | undefined

/**
 * Parse route key and id from URI.
 */
function parseURI(baseURI: string, req: Request) {
  const { pathname, searchParams } = new URL(req.url)
  const { pathname: baseURIPathname } = new URL(baseURI)

  if (baseURIPathname === pathname) {
    return {
      pathname,
      base: true,
      key: undefined,
      id: undefined,
    }
  }

  const pathWithoutBase = pathname
    .substring(baseURIPathname.length)
    // slash trim regex
    .replace(/^\/|\/$/g, '')
  const [keyOrUndefined, idOrUndefined] = pathWithoutBase.split('/')

  return {
    pathname,
    base: false,
    key: keyOrUndefined,
    id: idOrUndefined,
    searchParams,
  }
}

//////////

export type Route<
  TKey extends string,
  // Collection get
  TCollectionGetOperationId,
  TCollectionGetSearch,
  TCollectionGetHeaders,
  TCollectionGetBody,
  TCollectionGetResponse extends ApiHandlerResponse,
  // Collection post
  TCollectionPostOperationId,
  TCollectionPostSearch,
  TCollectionPostHeaders,
  TCollectionPostBody,
  TCollectionPostResponse extends ApiHandlerResponse,
  // Collection put
  TCollectionPutOperationId,
  TCollectionPutSearch,
  TCollectionPutHeaders,
  TCollectionPutBody,
  TCollectionPutResponse,
  // Collection delete
  TCollectionDeleteOperationId,
  TCollectionDeleteSearch,
  TCollectionDeleteHeaders,
  TCollectionDeleteBody,
  TCollectionDeleteResponse,
  // Item get
  TItemGetOperationId,
  TItemGetSearch,
  TItemGetHeaders,
  TItemGetBody,
  TItemGetResponse,
  // Item post
  TItemPostOperationId,
  TItemPostSearch,
  TItemPostHeaders,
  TItemPostBody,
  TItemPostResponse,
  // Item put
  TItemPutOperationId,
  TItemPutSearch,
  TItemPutHeaders,
  TItemPutBody,
  TItemPutResponse,
  // Item delete
  TItemDeleteOperationId,
  TItemDeleteSearch,
  TItemDeleteHeaders,
  TItemDeleteBody,
  TItemDeleteResponse extends ApiHandlerResponse,
> = {
  key: TKey
  description?: string
  collection: {
    methods: {
      GET: {
        operationId: TCollectionGetOperationId
        validateSearch: (search: UndefinedRecord) => TCollectionGetSearch
        validateHeaders: (headers: Headers) => TCollectionGetHeaders
        // validateBody: (body: any) => TCollectionGetBody;
        handler: (req: {
          search: TCollectionGetSearch
          headers: TCollectionGetHeaders
          body: TCollectionGetBody
        }) => Promise<TCollectionGetResponse>
      }
      POST?: {
        operationId: TCollectionPostOperationId
        validateSearch: (search: UndefinedRecord) => TCollectionPostSearch
        validateHeaders: (headers: Headers) => TCollectionPostHeaders
        validateBody: (body: any) => TCollectionPostBody
        handler: (req: {
          search: TCollectionPostSearch
          headers: TCollectionPostHeaders
          body: TCollectionPostBody
        }) => Promise<TCollectionPostResponse>
      }
      PUT?: {
        operationId: TCollectionPutOperationId
        validateSearch: (search: UndefinedRecord) => TCollectionPutSearch
        validateHeaders: (headers: Headers) => TCollectionPutHeaders
        validateBody: (body: any) => TCollectionPutBody
        handler: (req: {
          search: TCollectionPutSearch
          headers: TCollectionPutHeaders
          body: TCollectionPutBody
        }) => Promise<TCollectionPutResponse>
      }
      DELETE?: {
        operationId: TCollectionDeleteOperationId
        validateSearch: (search: UndefinedRecord) => TCollectionDeleteSearch
        validateHeaders: (headers: Headers) => TCollectionDeleteHeaders
        validateBody: (body: any) => TCollectionDeleteBody
        handler: (req: {
          search: TCollectionDeleteSearch
          headers: TCollectionDeleteHeaders
          body: TCollectionDeleteBody
        }) => Promise<TCollectionDeleteResponse>
      }
    }
  }
  item: {
    methods: {
      GET: {
        operationId: TItemGetOperationId
        validateSearch: (search: UndefinedRecord) => TItemGetSearch
        validateHeaders: (headers: Headers) => TItemGetHeaders
        validateBody: (body: any) => TItemGetBody
        handler: (req: {
          search: TItemGetSearch
          headers: TItemGetHeaders
          body: TItemGetBody
        }) => Promise<TItemGetResponse>
      }
      POST?: {
        operationId: TItemPostOperationId
        validateSearch: (search: UndefinedRecord) => TItemPostSearch
        validateHeaders: (headers: Headers) => TItemPostHeaders
        validateBody: (body: any) => TItemPostBody
        handler: (req: {
          search: TItemPostSearch
          headers: TItemPostHeaders
          body: TItemPostBody
        }) => Promise<TItemPostResponse>
      }
      PUT?: {
        operationId: TItemPutOperationId
        validateSearch: (search: UndefinedRecord) => TItemPutSearch
        validateHeaders: (headers: Headers) => TItemPutHeaders
        validateBody: (body: any) => TItemPutBody
        handler: (req: {
          search: TItemPutSearch
          headers: TItemPutHeaders
          body: TItemPutBody
        }) => Promise<TItemPutResponse>
      }
      DELETE?: {
        operationId: TItemDeleteOperationId
        validateSearch: (search: UndefinedRecord) => TItemDeleteSearch
        validateHeaders: (headers: Headers) => TItemDeleteHeaders
        validateBody: (body: any) => TItemDeleteBody
        handler: (req: {
          search: TItemDeleteSearch
          headers: TItemDeleteHeaders
          body: TItemDeleteBody
        }) => Promise<TItemDeleteResponse>
      }
    }
  }
}

export type RouteType = 'collection' | 'item'

export type AnyApi = ReturnType<typeof defineResourceRouter>['apiConfig']

export type AnyRoute = Route<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

type AnyMethod = AnyRoute[RouteType]['methods'][SupportedHTTPMethod]

export function defineResource<
  TKey extends string,
  // Collection get
  TCollectionGetOperationId,
  TCollectionGetSearch,
  TCollectionGetHeaders,
  TCollectionGetBody,
  TCollectionGetResponse extends ApiHandlerResponse,
  // Collection post
  TCollectionPostOperationId,
  TCollectionPostSearch,
  TCollectionPostHeaders,
  TCollectionPostBody,
  TCollectionPostResponse extends ApiHandlerResponse,
  // Collection put
  TCollectionPutOperationId,
  TCollectionPutSearch,
  TCollectionPutHeaders,
  TCollectionPutBody,
  TCollectionPutResponse extends ApiHandlerResponse,
  // Collection delete
  TCollectionDeleteOperationId,
  TCollectionDeleteSearch,
  TCollectionDeleteHeaders,
  TCollectionDeleteBody,
  TCollectionDeleteResponse extends ApiHandlerResponse,
  // Item get
  TItemGetOperationId,
  TItemGetSearch,
  TItemGetHeaders,
  TItemGetBody,
  TItemGetResponse extends ApiHandlerResponse,
  // Item post
  TItemPostOperationId,
  TItemPostSearch,
  TItemPostHeaders,
  TItemPostBody,
  TItemPostResponse extends ApiHandlerResponse,
  // Item put
  TItemPutOperationId,
  TItemPutSearch,
  TItemPutHeaders,
  TItemPutBody,
  TItemPutResponse extends ApiHandlerResponse,
  // Item delete
  TItemDeleteOperationId,
  TItemDeleteSearch,
  TItemDeleteHeaders,
  TItemDeleteBody,
  TItemDeleteResponse extends ApiHandlerResponse,
  TRouteConfig extends Route<
    TKey,
    // Collection get
    TCollectionGetOperationId,
    TCollectionGetSearch,
    TCollectionGetHeaders,
    TCollectionGetBody,
    TCollectionGetResponse,
    // Collection post
    TCollectionPostOperationId,
    TCollectionPostSearch,
    TCollectionPostHeaders,
    TCollectionPostBody,
    TCollectionPostResponse,
    // Collection put
    TCollectionPutOperationId,
    TCollectionPutSearch,
    TCollectionPutHeaders,
    TCollectionPutBody,
    TCollectionPutResponse,
    // Collection delete
    TCollectionDeleteOperationId,
    TCollectionDeleteSearch,
    TCollectionDeleteHeaders,
    TCollectionDeleteBody,
    TCollectionDeleteResponse,
    // Item get
    TItemGetOperationId,
    TItemGetSearch,
    TItemGetHeaders,
    TItemGetBody,
    TItemGetResponse,
    // Item post
    TItemPostOperationId,
    TItemPostSearch,
    TItemPostHeaders,
    TItemPostBody,
    TItemPostResponse,
    // Item put
    TItemPutOperationId,
    TItemPutSearch,
    TItemPutHeaders,
    TItemPutBody,
    TItemPutResponse,
    // Item delete
    TItemDeleteOperationId,
    TItemDeleteSearch,
    TItemDeleteHeaders,
    TItemDeleteBody,
    TItemDeleteResponse
  >,
>(route: TRouteConfig): TRouteConfig {
  return route
}

export function defineResourceRouter<
  TRuntimeReq,
  TRuntimeRes,
  Resources extends AnyRoute[],
>(apiConfig: {
  baseURI: string
  errorHandler: (error: any) => ApiHandlerResponse
  /**
   * Convert runtime request to Web Fetch Request (e.g., Express Request -> Web Fetch Request)
   */
  convertRuntimeToRequest: (req: TRuntimeReq) => Request
  convertHandlerToRuntime: (res: ApiHandlerResponse) => TRuntimeRes
  resources: Resources
}): {
  apiConfig: {
    baseURI: string
    errorHandler: (error: any) => ApiHandlerResponse
    convertRuntimeToRequest: (req: TRuntimeReq) => Request
    convertHandlerToRuntime: (res: ApiHandlerResponse) => TRuntimeRes
    resources: Resources
  }
  handler: (req: TRuntimeReq, res: TRuntimeRes) => Promise<TRuntimeRes>
} {
  async function handler(
    req: TRuntimeReq,
    res: TRuntimeRes,
  ): Promise<TRuntimeRes> {
    try {
      const apiReq = apiConfig.convertRuntimeToRequest(req)
      const parsedURI = parseURI(apiConfig.baseURI, apiReq)
      if (parsedURI.base) {
        // Return docs?
        throw new ResourceError(404, 'Not found')
      }

      const resourceObject = apiConfig.resources.find(
        (route) => route.key === parsedURI.key,
      )
      if (!resourceObject) {
        throw new ResourceError(404, 'Not found')
      }

      const routeType = parsedURI.id ? 'item' : 'collection'

      const routeMethodObject =
        // @ts-ignore because we expect it to sometimes be undefined
        resourceObject[routeType]['methods'][apiReq.method] as AnyMethod

      if (!routeMethodObject) {
        throw new ResourceError(405, 'Method not allowed')
      }

      const validatedSearch =
        'validateSearch' in routeMethodObject
          ? routeMethodObject.validateSearch(parsedURI.searchParams)
          : undefined
      const validatedHeaders =
        'validateHeaders' in routeMethodObject
          ? routeMethodObject.validateHeaders(apiReq.headers)
          : undefined
      const validatedBody =
        'validateBody' in routeMethodObject &&
        typeof routeMethodObject.validateBody === 'function'
          ? routeMethodObject.validateBody(apiReq.body)
          : undefined

      const handlerRes = (await routeMethodObject.handler({
        search: validatedSearch,
        headers: validatedHeaders,
        body: validatedBody,
      })) as ApiHandlerResponse

      const runtimeRes = apiConfig.convertHandlerToRuntime(handlerRes)
      return runtimeRes
    } catch (error) {
      const errorRes = apiConfig.errorHandler(error)
      return apiConfig.convertHandlerToRuntime(errorRes)
    }
  }
  return { apiConfig, handler }
}

type GetApiResources<
  Api extends {
    apiConfig: {
      resources: AnyRoute[]
    }
  },
  TKey extends Api['apiConfig']['resources'][number]['key'],
> = Extract<Api['apiConfig']['resources'][number], { key: TKey }>
