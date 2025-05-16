import type { Meta, StoryObj } from '@storybook/react';
import React from 'react'; // For createContext, useRef, etc.
import $ from '../index'; // Adjust path as necessary
import { useFormStatus as reactDom_useFormStatus } from 'react-dom'; // For useFormStatus example

// --- useState --- 
export function Example_useState() {
  return (
    <$>
      {({ useState }) => {
        const [value, set] = useState('');
        return (
          <>
            <input aria-label="useState-input" value={value} onChange={(e) => set(e.target.value)} placeholder="useState: type here..." />
            <p>Value: "{value}"</p>
          </>
        );
      }}
    </$>
  );
}
Example_useState.storyName = 'useState';

// --- useReducer --- 
export function Example_useReducer() {
  return (
    <$>
      {({ useReducer }) => {
        const [count, dispatch] = useReducer(
          (s: number, a: 'inc' | 'dec') => (a === 'inc' ? s + 1 : s - 1),
          0,
        );
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button onClick={() => dispatch('dec')}>-</button>
            <span data-testid="count-span">{count} (useReducer)</span>
            <button onClick={() => dispatch('inc')}>＋</button>
          </div>
        );
      }}
    </$>
  );
}
Example_useReducer.storyName = 'useReducer';

// --- useCallback --- 
export function Example_useCallback() {
  return (
    <$>
      {({ useState, useCallback }) => {
        const [txt, setTxt] = useState('');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTxt(e.target.value), []);
        return (
          <>
            <input aria-label="useCallback-input" value={txt} onChange={handleChange} placeholder="useCallback: type here..." />
            <p>Value: "{txt}"</p>
          </>
        );
      }}
    </$>
  );
}
Example_useCallback.storyName = 'useCallback';

// --- useContext --- 
const ThemeCtx = React.createContext<'light' | 'dark'>('light');
export function Example_useContext() {
  return (
    <ThemeCtx.Provider value="dark">
      <$>
        {({ useContext }) => <p>Theme (useContext): {useContext(ThemeCtx)}</p>}
      </$>
    </ThemeCtx.Provider>
  );
}
Example_useContext.storyName = 'useContext';

// --- useMemo --- 
export function Example_useMemo() {
  return (
    <$>
      {({ useState, useMemo }) => {
        const [n, setN] = useState(5); // Smaller default for story
        const fib = useMemo(() => {
          const f = (x: number): number => (x <= 1 ? x : f(x - 1) + f(x - 2));
          return f(n);
        }, [n]);
        return (
          <div>
            <input
              type="number"
              aria-label="useMemo-input"
              value={n}
              onChange={(e) => setN(+e.target.value)}
              style={{width: '50px'}}
            />
            <p>Fib({n}) (useMemo) = {fib}</p>
          </div>
        );
      }}
    </$>
  );
}
Example_useMemo.storyName = 'useMemo';

// --- useEffect --- 
export function Example_useEffect() {
  return (
    <$>
      {({ useState, useEffect }) => {
        const [time, setTime] = useState('loading...');
        useEffect(() => {
          const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
          return () => clearInterval(id);
        }, []);
        return <p>Time (useEffect): {time}</p>;
      }}
    </$>
  );
}
Example_useEffect.storyName = 'useEffect';

// --- useLayoutEffect --- 
export function Example_useLayoutEffect() {
  return (
    <$>
      {({ useRef, useLayoutEffect }) => {
        const box = useRef<HTMLDivElement>(null);
        useLayoutEffect(() => {
          if (box.current) box.current.style.background = '#ffd54f';
        }, []);
        return <div ref={box} style={{ padding: '5px', border: '1px solid grey'}}> Div (useLayoutEffect) highlighted after layout </div>;
      }}
    </$>
  );
}
Example_useLayoutEffect.storyName = 'useLayoutEffect';

// --- useImperativeHandle --- 
const FancyInput = React.forwardRef<HTMLInputElement>((_, ref) => (
  <$>
    {({ useRef, useImperativeHandle }) => {
      const local = useRef<HTMLInputElement>(null);
      useImperativeHandle(ref, () => ({ focus: () => local.current?.focus() } as HTMLInputElement));
      return <input ref={local} placeholder="Fancy input (useImperativeHandle)" />;
    }}
  </$>
));
FancyInput.displayName = 'FancyInput';
export function Example_useImperativeHandle() {
  const fancyRef = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <FancyInput ref={fancyRef} />
      <button onClick={() => fancyRef.current?.focus()}>Focus Fancy Input</button>
    </div>
  );
}
Example_useImperativeHandle.storyName = 'useImperativeHandle';

// --- useRef --- 
export function Example_useRef() {
  return (
    <$>
      {({ useRef }) => {
        const inputEl = useRef<HTMLInputElement>(null);
        return (
          <div>
            <input ref={inputEl} aria-label="useRef-input" placeholder="useRef: input" />
            <button onClick={() => inputEl.current?.focus()}>Focus Input</button>
          </div>
        );
      }}
    </$>
  );
}
Example_useRef.storyName = 'useRef';

// --- useInsertionEffect --- 
export function Example_useInsertionEffect() {
  const [show, setShow] = React.useState(true);
  const id = 'insertion-effect-style';
  return (
    <div>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} (unmounts component)</button>
      {show && <$>
        {({ useInsertionEffect }) => {
          useInsertionEffect(() => {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = `.flash-insertion{animation:flash-insertion 1s steps(2) infinite;} @keyframes flash-insertion{to{opacity:.2}}`;
            document.head.append(style);
            console.log('Insertion effect: style injected');
            return () => {
              console.log('Insertion effect: style removed');
              document.getElementById(id)?.remove();
            };
          }, []);
          return <p className="flash-insertion">Flashing text (useInsertionEffect)</p>;
        }}
      </$>}
    </div>
  );
}
Example_useInsertionEffect.storyName = 'useInsertionEffect';

// --- useId --- 
export function Example_useId() {
  return (
    <$>
      {({ useId, useState }) => {
        const id = useId();
        const [val, setVal] = useState('');
        return (
          <div>
            <label htmlFor={id}>Name (useId):</label>
            <input id={id} value={val} onChange={(e) => setVal(e.target.value)} style={{marginLeft: '5px'}}/>
          </div>
        );
      }}
    </$>
  );
}
Example_useId.storyName = 'useId';

// --- useSyncExternalStore --- 
export function Example_useSyncExternalStore() {
  return (
    <$>
      {({ useSyncExternalStore }) => {
        const width = useSyncExternalStore(
          (cb) => {
            window.addEventListener('resize', cb);
            return () => window.removeEventListener('resize', cb);
          },
          () => window.innerWidth,
          () => -1 // server snapshot
        );
        return <p>Window width (useSyncExternalStore): {width}px</p>;
      }}
    </$>
  );
}
Example_useSyncExternalStore.storyName = 'useSyncExternalStore';

// --- useDeferredValue --- 
export function Example_useDeferredValue() {
  return (
    <$>
      {({ useState, useDeferredValue }) => {
        const [text, setText] = useState('');
        const deferred = useDeferredValue(text);
        return (
          <div>
            <input aria-label="useDeferredValue-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="useDeferredValue: type..."/>
            <p>Deferred: {deferred}</p>
          </div>
        );
      }}
    </$>
  );
}
Example_useDeferredValue.storyName = 'useDeferredValue';

// --- useTransition --- 
export function Example_useTransition() {
  return (
    <$>
      {({ useState, useTransition, useMemo }) => {
        // Create a fixed list of sample products once (more practical than generic numbers)
        const items = useMemo(
          () => [
            'Alligator',
            'Bear',
            'Cat',
            'Dog',
            'Elephant',
            'Fox',
            'Giraffe',
            'Horse',
            'Iguana',
            'Jaguar',
            'Kangaroo',
            'Lion',
            'Monkey',
            'Newt',
            'Owl',
            'Penguin',
            'Quail',
            'Rabbit',
            'Shark',
            'Tiger',
          ],
          [],
        );
        const [list, setList] = useState<string[]>(items);
        const [pending, start] = useTransition();

        const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
          const q = e.target.value.toLowerCase();
          start(() => setList(items.filter((x) => x.toLowerCase().includes(q))));
        };
        return (
          <div>
            {/* Show the full list so users know what can be searched */}
            <p style={{ maxWidth: '600px' }}>
              All items:&nbsp;
              <span style={{ fontStyle: 'italic' }}>{items.join(', ')}</span>
            </p>
            <input aria-label="useTransition-filter" onChange={filter} placeholder="Filter products..." />
            {pending && <p>Updating...</p>}
            <p>{list.length} item{list.length === 1 ? '' : 's'} found. {list.length === items.length ? '(no items filtered)' : ''}</p>
            {/* Show the filtered items */}
            {list.length > 0 && <p style={{ maxWidth: '600px' }}>{list.join(', ')}</p>}
          </div>
        );
      }}
    </$>
  );
}
Example_useTransition.storyName = 'useTransition';

// --- useActionState --- 
export function Example_useActionState() {
  if (!React.useActionState) {
    return <p>React.useActionState is not available in this version of React.</p>;
  }
  return (
    <$>
      {({ useActionState }) => {
        const [msg, submit, pending] = useActionState(
          async (_prev: string | null, data: FormData) => {
            await new Promise((r) => setTimeout(r, 400));
            return data.get('text') as string;
          },
          null,
        );
        return (
          <form action={submit}>
            <input name="text" placeholder="useActionState: Say hi" />
            <button type="submit" disabled={pending}>Send</button>
            {msg && <p>You said: {msg}</p>}
          </form>
        );
      }}
    </$>
  );
}
Example_useActionState.storyName = 'useActionState';

// --- useFormStatus --- 
// Note: react-dom useFormStatus is used here as react's might not be available/same
const FormStatusButton = () => {
  // useFormStatus must be used within a <form>
  // So, we extract it to a sub-component for RenderHooks to access.
  return (
    <$>
      {({ useFormStatus }) => {
        const { pending } = useFormStatus ? useFormStatus() : { pending: false }; // Check if useFormStatus exists
        return <button type="submit" disabled={pending}>{pending ? 'Saving (useFormStatus)...' : 'Save'}</button>;
      }}
    </$>
  );
};
export function Example_useFormStatus() {
  if (!reactDom_useFormStatus) { // Check if the imported one exists
    return <p>ReactDOM.useFormStatus is not available in this version of React DOM.</p>;
  }
  return (
    <$>
      {({ useState }) => {
        const [done, setDone] = useState(false);
        const action = async () => {
          await new Promise((r) => setTimeout(r, 400));
          setDone(true);
          setTimeout(() => setDone(false), 2000); // Reset for story
        };
        return (
          <form action={action}>
            <FormStatusButton />
            {done && <p>Saved!</p>}
          </form>
        );
      }}
    </$>
  );
}
Example_useFormStatus.storyName = 'useFormStatus';

// --- use (awaitable hook) --- 
// Helper function for the 'use' example
let quotePromise: Promise<string>;
const fetchQuote = () => {
  quotePromise = new Promise<string>((resolve) =>
    setTimeout(() => resolve('"Ship early, ship often." (from use hook)'), 800),
  );
  return quotePromise;
};

export function Example_use() {
  if (!React.use) {
    return <p>React.use is not available in this version of React.</p>;
  }
  // To make this storybook-friendly and re-runnable, we reset the promise on each render.
  // In a real app, you might fetch once or based on props.
  fetchQuote(); 

  return (
    <React.Suspense fallback={<p>Loading quote (use hook)...</p>}>
      <$>
        {({ use }) => {
          return <blockquote>{use(quotePromise)}</blockquote>;
        }}
      </$>
    </React.Suspense>
  );
}
Example_use.storyName = 'use';

// --- meta --- 
const meta: Meta = {
  title: 'Examples/Built-in Hooks',
  tags: ['autodocs'],
  parameters: {
    layout: 'top',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
