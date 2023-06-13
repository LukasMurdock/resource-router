// https://github.com/millsp/ts-toolbelt/blob/319e551/sources/Any/Try.ts#L17
export type Try<A1 extends any, A2 extends any, Catch = never> = A1 extends A2
  ? A1
  : Catch

export type Narrowable = string | number | bigint | boolean

// https://github.com/millsp/ts-toolbelt/blob/319e551/sources/Function/Narrow.ts#L32
type NarrowRaw<A> =
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | {
      [K in keyof A]: A[K] extends Function ? A[K] : NarrowRaw<A[K]>
    }

/**
 * Prevent type widening on generic function parameters
 */
export type Narrow<A extends any> = Try<A, [], NarrowRaw<A>>
