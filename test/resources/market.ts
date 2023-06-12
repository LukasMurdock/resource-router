import { defineResource } from '../../src/server'

export const market = defineResource({
  key: 'market',
  collection: {
    methods: {
      GET: {
        operationId: 'getMarkets',
        validateSearch: (search) => {
          return {
            limit: 10,
          }
        },
        validateHeaders: (headers) => {
          return {
            'x-api-key': '1234',
          }
        },
        // Check validateBody throws type error in GET
        // validateBody: (body) => {
        // 	return {
        // 		name: "John Doe",
        // 	};
        // },
        handler: async (req) => {
          return {
            status: 200,
            body: {
              markets: [],
            },
          }
        },
      },
    },
  },
  item: {
    methods: {
      GET: {
        operationId: 'getMarket',
        validateSearch: (search) => search,
        validateHeaders: (headers) => headers,
        validateBody: (body) => body,
        handler: async (req) => {
          return {
            status: 200,
            body: {
              market: {},
            },
          }
        },
      },
    },
  },
})
