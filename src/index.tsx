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

// Type for the custom hooks part, consistent with previous logic
type CombinedCustomHooks<TValue extends Record<string, Fn>> = TValue extends Record<string, Fn> ? TValue : {};

// Updated HelperArgs to include ref - now a type alias using intersection
type FullHelperArgs<TValue extends Record<string, Fn>, RefType = unknown> =
  CoreHelpers &
  CombinedCustomHooks<TValue> &
  {
    ref?: React.ForwardedRef<RefType>;
  };

// Props for the RenderHooks component.
// 'ref' and 'key' are handled by React.forwardRef and React itself.
interface RenderHooksComponentProps<
  TValue extends Record<string, Fn> = {},
  RefType = unknown,
> {
  hooks?: TValue;
  children: (helpers: FullHelperArgs<TValue, RefType>) => React.ReactNode;
}

// The RenderHooks component, now wrapped in React.forwardRef
const RenderHooks = React.forwardRef(
  // Generic parameters for the render function of forwardRef
  <TValue extends Record<string, Fn> = {}, RefType = unknown>(
    props: RenderHooksComponentProps<TValue, RefType>,
    ref: React.ForwardedRef<RefType> // The ref passed from the parent
  ) => {
    const { hooks: customHooksInput, children } = props;

    // Memoize the merging of core and custom hooks.
    // Custom hooks will override core hooks if names clash.
    const mergedBaseHooks = React.useMemo(() => {
      return { ...coreHelpers, ...(customHooksInput ?? {}) };
    }, [customHooksInput]) as CoreHelpers & CombinedCustomHooks<TValue>;

    // Combine merged hooks with the ref
    const allHelpers: FullHelperArgs<TValue, RefType> = {
      ...mergedBaseHooks,
      ref,
    };

    // Render the children with all helpers
    return <>{children(allHelpers)}</>;
  }
);

RenderHooks.displayName = 'RenderHooks'; // Set display name for better debugging

export default RenderHooks; // Export the forwardRef-wrapped component
