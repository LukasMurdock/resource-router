import type { AnyApi, RouteType } from './server'

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
    SResourceKeys extends Api['resources'][number]['key'],
    SRouteTypes extends RouteType,
    SMethods extends keyof Extract<
      Api['resources'][number],
      {
        key: TSelector['resource']
      }
    >[TSelector['type']]['methods'],
    // SMethod extends keyof Extract<
    //   Api['resources'][number],
    //   {
    //     key: TSelector['resource']
    //   }
    // >[TSelector['type']]['methods'],
    TSelector extends {
      resource: SResourceKeys
      type: SRouteTypes
      method: SMethods
      //   search: SSearch
    },
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
  >(selector: TSelector): TSelector {
    return {} as any
  }

  return {
    fetch,
  }
}
