import React from 'react';
import ReactDOM from 'react-dom';

/* ----------------------------------------------------------- *
 * 1 ▸ helper types                                             *
 * ----------------------------------------------------------- */

// local utility for "is a function"
type Fn = (...args: any[]) => any;

/** Map an object T ➜ only its `use*` keys that are functions. */
type ExtractHooks<T> = {
  [K in keyof T as K extends `use${string}`
    ? T[K] extends Fn
      ? K
      : never
    : never]: T[K] extends Fn ? T[K] : never;
};

/* ----------------------------------------------------------- *
 * 2 ▸ runtime collector that preserves static types            *
 * ----------------------------------------------------------- */
function wrap<F extends Fn>(fn: F): F {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore  – keeps F's exact signature
  return ((...args: Parameters<F>): ReturnType<F> => fn(...args)) as F;
}

function collectHooks<T>(src: T): ExtractHooks<T> {
  const out = {} as ExtractHooks<T>;

  for (const key in src) {
    if (key.startsWith('use')) {
      const fn = (src as Record<string, unknown>)[key];
      if (typeof fn === 'function') {
        (out as Record<string, Fn>)[key] = wrap(fn as Fn);
      }
    }
  }
  return out;
}

/* ----------------------------------------------------------- *
 * 3 ▸ core helpers = hooks found in the *installed* libs       *
 * ----------------------------------------------------------- */
const coreHelpers = {
  ...collectHooks(React),
  ...collectHooks(ReactDOM),
};

type CoreHelpers = typeof coreHelpers;

/* ----------------------------------------------------------- *
 * 4 ▸ default component                                       *
 * ----------------------------------------------------------- */
export default function RenderHooks<
  TValue extends Record<string, Fn> = {},
>(props: {
  hooks?: TValue;
  children: (helpers: CoreHelpers & (TValue extends Record<string, Fn> ? TValue : {})) => React.ReactNode;
}): React.ReactElement {
  const { hooks, children } = props;
  const helpers = React.useMemo(
    () => ({ ...coreHelpers, ...(hooks ?? {}) }),
    [hooks],
  ) as CoreHelpers & (TValue extends Record<string, Fn> ? TValue : {});
  return <>{children(helpers)}</>;
}
