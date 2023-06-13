/**
 * Designed to be thrown:
 * - by the server for errors.
 * - by the client when the server returns a non 2xx response.
 */
export class ResourceError extends Error {
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

export function isResourceError(value: any): value is ResourceError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    'innererror' in value
  )
}
