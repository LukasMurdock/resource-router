import type { AnyApi, RouteType } from './server'

type Distribute<T> = T extends any ? T : never
type DistributedKeyOf<T> = T extends any ? keyof T : never

export function createClient<Api extends AnyApi>(baseFetchConfig: {
  baseURI: Api['baseURI']
}) {
  /**
   * Resource key is a union of all resource keys.
   * Method key is a union of all method keys.
   *
   * We want to avoid distributivity for the:
   * - `resource` type
   * - `methods` type
   */
  function fetch<
    TSearch extends TResource[TSelector['type']]['methods'][SMethods] extends {
      validateSearch: (any: any) => infer TSearch
    }
      ? TSearch
      : never,
    TSelector extends {
      resource: SResourceKeys
      type: SRouteTypes
      method: SMethods
      search?: TSearch
    },
    SResourceKeys extends Api['resources'][number]['key'],
    TResource extends Extract<
      Api['resources'][number],
      {
        key: SResourceKeys
      }
    >,
    SMethods extends DistributedKeyOf<TResource[TSelector['type']]['methods']>,
    SRouteTypes extends RouteType,

    // SSearch extends Extract<
    //   Api['resources'][number],
    //   {
    //     key: SResourceKeys
    //   }
    // >[TSelector['type']]['methods'][TSelector['method']],
    // SMethods extends {
    //   [K in keyof TResource['methods']]: K extends SRouteTypes ? K : never
    // }[keyof TResource['methods']],
    // SMethod extends keyof Extract<
    //   Api['resources'][number],
    //   {
    //     key: TSelector['resource']
    //   }
    // >[TSelector['type']]['methods'],

    //   SSearch extends Extract<
    //     Api['resources'][number],
    //     {
    //       key: TSelector['resource']
    //     }
    //   >[TSelector['type']]['methods'][TSelector['method']] extends {
    //     validateSearch: (any: any) => infer TSearch
    //   }
    //     ? TSearch
    //     : never,
    // SMethod extends keyof TRouteObject["methods"],
    // TMethod extends DistributedKeyOf<TRouteObject["methods"]>,
    // TRouteMethodObject extends TRouteObject["methods"],
  >(
    selector: TSelector,
  ): {
    options: {
      resources: SResourceKeys
      methods: SMethods
      search: TSearch
    }
    selector: TSelector
  } {
    return {} as any
  }

  return {
    fetch,
  }
}
