<h5 align="center"><img src="./.github/render-hooks-logo_full.png?raw=true" width="100%" height="auto" alt="Anchors for Tailwind CSS" /></h5>

<div align="center">
<b><i>RenderHooks (<code>render-hooks</code>)</i></b><br>
<small><i>Use hooks inline in React/JSX</i></small>
</div><br>

RenderHooks lets you place hooks right next to the markup that needs them—no wrapper components, no breaking the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks), and zero boilerplate, even when you supply your own custom hooks.

---

- [📖 How it works](#-how-it-works)
- [✨ Features](#-features)
- [🚀 Install](#-install)
- [⚡ Quick start](#-quick-start)
- [🧩 API](#-api)
- [📚 Examples by hook](#-examples-by-hook)
  - [`useState` (React ≥ 16.8)](#usestatereact--168)
  - [`useReducer` (React ≥ 16.8)](#usereducerreact--168)
  - [`useCallback` (React ≥ 16.8)](#usecallbackreact--168)
  - [`useContext` (React ≥ 16.8)](#usecontextreact--168)
  - [`useMemo` (React ≥ 16.8)](#usememoreact--168)
  - [`useEffect` (React ≥ 16.8)](#useeffectreact--168)
  - [`useLayoutEffect` (React ≥ 16.8)](#uselayouteffectreact--168)
  - [`useImperativeHandle` (React ≥ 16.8)](#useimperativehandlereact--168)
  - [`useRef` (React ≥ 16.8)](#userefreact--168)
  - [`useInsertionEffect` (React ≥ 18)](#useinsertioneffectreact--18)
  - [`useId` (React ≥ 18)](#useidreact--18)
  - [`useSyncExternalStore` (React ≥ 18)](#usesyncexternalstorereact--18)
  - [`useDeferredValue` (React ≥ 18)](#usedeferredvaluereact--18)
  - [`useTransition` (React ≥ 18)](#usetransitionreact--18)
  - [`useActionState` (React ≥ 19, experimental in 18)](#useactionstatereact--19-experimental-in-18)
  - [`useFormStatus` (React-DOM ≥ 19)](#useformstatusreact-dom--19)
  - [`use` (awaitable hook, React ≥ 19)](#useawaitable-hook-react--19)
- [🛠 Custom hooks](#-custom-hooks)
- [🧱 Nesting hooks](#-nesting-hooks)
- [🤝 Collaboration](#-collaboration)
  - [How to contribute](#how-to-contribute)

---

## 📖 How it works

1. At runtime RenderHooks scans the installed `react` and `react-dom`
   modules and wraps every export whose name starts with **`use`**.
2. A TypeScript mapped type reproduces *exactly* the same keys from the typings,
   so autocompletion never lies.
3. The callback you give to `<RenderHooks>` (commonly aliased, e.g. `<$>`) is executed during that same render
   pass, keeping the Rules of Hooks intact.
4. Custom hooks are merged in once—stable reference, fully typed.

---

## ✨ Features

| ✔︎ | Description |
|----|-------------|
| **One element** | `<$>` merges every `use*` hook exposed by the consumer's version of **`react` + `react-dom`** into a single helpers object. |
| **Version-adaptive** | Only the hooks that exist in *your* React build appear. Upgrade React → new hooks show up automatically. |
| **Custom-hook friendly** | Pass an object of your own hooks once—full IntelliSense inside the render callback. |
| **100 % type-safe** | No `any`, no `unknown`. Generic signatures flow through the helpers object. |
| **Tiny runtime** | Just an object merge—`<$>` renders nothing to the DOM. |

---

## 🚀 Install

```bash
npm install render-hooks             # or yarn / pnpm / bun
```

RenderHooks lists **`react`** and **`react-dom`** as peer dependencies, so it
always tracks *your* versions.

---

## ⚡ Quick start

```tsx
import $ from 'render-hooks';

export function Counter() {
  return (
    <$>
      {({ useState }) => {
        const [n, set] = useState(0);
        return <button onClick={() => set(n + 1)}>Clicked {n}</button>;
      }}
    </$>
  );
}
```

The hook runs during the same render, so the Rules of Hooks are upheld.

---

## 🧩 API

| Prop        | Type                                               | Description |
|-------------|----------------------------------------------------|-------------|
| `hooks`     | `Record<string, (...args: never[]) => unknown>`    | (optional) custom hooks to expose. |
| `children`  | `(helpers) ⇒ ReactNode`                            | Render callback receiving **all** built-in hooks available in your React version **plus** the custom hooks you supplied. |

---

## 📚 Examples by hook

Below is a **minimal, practical snippet for every built-in hook**.  
Each header lists the **minimum React (or React-DOM) version** required—if your
project uses an older version, that hook simply won't appear in the helpers
object.

> All snippets assume  
> `import $ from 'render-hooks';`

---

### `useState` (React ≥ 16.8)

```tsx
export function UseStateExample() {
  return (
    <$>
      {({ useState }) => {
        const [value, set] = useState('');
        return <input value={value} onChange={(e) => set(e.target.value)} />;
      }}
    </$>
  );
}
```

---

### `useReducer` (React ≥ 16.8)

```tsx
export function UseReducerExample() {
  return (
    <$>
      {({ useReducer }) => {
        const [count, dispatch] = useReducer(
          (s: number, a: 'inc' | 'dec') => (a === 'inc' ? s + 1 : s - 1),
          0,
        );
        return (
          <>
            <button onClick={() => dispatch('dec')}>-</button>
            <span>{count}</span>
            <button onClick={() => dispatch('inc')}>＋</button>
          </>
        );
      }}
    </$>
  );
}
```

---

### `useCallback` (React ≥ 16.8)

```tsx
export function UseCallbackExample() {
  return (
    <$>
      {({ useState, useCallback }) => {
        const [txt, setTxt] = useState('');
        const onChange = useCallback(
          (e: React.ChangeEvent<HTMLInputElement>) => setTxt(e.target.value),
          [],
        );
        return <input value={txt} onChange={onChange} />;
      }}
    </$>
  );
}
```

---

### `useContext` (React ≥ 16.8)

```tsx
const ThemeCtx = React.createContext<'light' | 'dark'>('light');

export function UseContextExample() {
  return (
    <ThemeCtx.Provider value="dark">
      <$>
        {({ useContext }) => <p>Theme: {useContext(ThemeCtx)}</p>}
      </$>
    </ThemeCtx.Provider>
  );
}
```

---

### `useMemo` (React ≥ 16.8)

```tsx
export function UseMemoExample() {
  return (
    <$>
      {({ useState, useMemo }) => {
        const [n, setN] = useState(25);
        const fib = useMemo(() => {
          const f = (x: number): number =>
            x <= 1 ? x : f(x - 1) + f(x - 2);
          return f(n);
        }, [n]);
        return (
          <>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(+e.target.value)}
            />
            <p>Fib({n}) = {fib}</p>
          </>
        );
      }}
    </$>
  );
}
```

---

### `useEffect` (React ≥ 16.8)

```tsx
export function UseEffectExample() {
  return (
    <$>
      {({ useState, useEffect }) => {
        const [time, setTime] = useState('');
        useEffect(() => {
          const id = setInterval(
            () => setTime(new Date().toLocaleTimeString()),
            1000,
          );
          return () => clearInterval(id);
        }, []);
        return <p>{time}</p>;
      }}
    </$>
  );
}
```

---

### `useLayoutEffect` (React ≥ 16.8)

```tsx
export function UseLayoutEffectExample() {
  return (
    <$>
      {({ useRef, useLayoutEffect }) => {
        const box = useRef<HTMLDivElement>(null);
        useLayoutEffect(() => {
          box.current!.style.background = '#ffd54f';
        }, []);
        return <div ref={box}> highlighted after layout </div>;
      }}
    </$>
  );
}
```

---

### `useImperativeHandle` (React ≥ 16.8)

```tsx
const Fancy = React.forwardRef<HTMLInputElement>((_, ref) => (
  <$>
    {({ useRef, useImperativeHandle }) => {
      const local = useRef<HTMLInputElement>(null);
      useImperativeHandle(ref, () => ({ focus: () => local.current?.focus() }));
      return <input ref={local} placeholder="Fancy input" />;
    }}
  </$>
));

export function UseImperativeHandleExample() {
  const ref = React.useRef<{ focus: () => void }>(null);
  return (
    <>
      <Fancy ref={ref} />
      <button onClick={() => ref.current?.focus()}>Focus</button>
    </>
  );
}
```

---

### `useRef` (React ≥ 16.8)

```tsx
export function UseRefExample() {
  return (
    <$>
      {({ useRef }) => {
        const input = useRef<HTMLInputElement>(null);
        return (
          <>
            <button onClick={() => input.current?.focus()}>focus</button>
            <input ref={input} />
          </>
        );
      }}
    </$>
  );
}
```

---

### `useInsertionEffect` (React ≥ 18)

```tsx
export function UseInsertionEffectExample() {
  return (
    <$>
      {({ useInsertionEffect }) => {
        useInsertionEffect(() => {
          const style = document.createElement('style');
          style.textContent = `.flash{animation:flash 1s steps(2) infinite;}
            @keyframes flash{to{opacity:.2}}`;
          document.head.append(style);
          return () => style.remove();
        }, []);
        return <p className="flash">flashing text</p>;
      }}
    </$>
  );
}
```

---

### `useId` (React ≥ 18)

```tsx
export function UseIdExample() {
  return (
    <$>
      {({ useId, useState }) => {
        const id = useId();
        const [v, set] = useState('');
        return (
          <>
            <label htmlFor={id}>Name</label>
            <input id={id} value={v} onChange={(e) => set(e.target.value)} />
          </>
        );
      }}
    </$>
  );
}
```

---

### `useSyncExternalStore` (React ≥ 18)

```tsx
export function UseSyncExternalStoreExample() {
  return (
    <$>
      {({ useSyncExternalStore }) => {
        const width = useSyncExternalStore(
          (cb) => {
            window.addEventListener('resize', cb);
            return () => window.removeEventListener('resize', cb);
          },
          () => window.innerWidth,
        );
        return <p>width: {width}px</p>;
      }}
    </$>
  );
}
```

---

### `useDeferredValue` (React ≥ 18)

```tsx
export function UseDeferredValueExample() {
  return (
    <$>
      {({ useState, useDeferredValue }) => {
        const [text, setText] = useState('');
        const deferred = useDeferredValue(text);
        return (
          <>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <p>deferred: {deferred}</p>
          </>
        );
      }}
    </$>
  );
}
```

---

### `useTransition` (React ≥ 18)

```tsx
export function UseTransitionExample() {
  return (
    <$>
      {({ useState, useTransition }) => {
        const [list, setList] = useState<string[]>([]);
        const [pending, start] = useTransition();
        const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
          const q = e.target.value;
          start(() =>
            setList(
              Array.from({ length: 5_000 }, (_, i) => `Item ${i}`).filter((x) =>
                x.includes(q),
              ),
            ),
          );
        };
        return (
          <>
            <input onChange={filter} placeholder="filter 5 k items" />
            {pending && <p>updating…</p>}
            <p>{list.length} items</p>
          </>
        );
      }}
    </$>
  );
}
```

---

### `useActionState` (React ≥ 19, experimental in 18)

```tsx
export function UseActionStateExample() {
  return (
    <$>
      {({ useActionState }) => {
        const [msg, submit, pending] = useActionState(
          async (_prev: string, data: FormData) => {
            await new Promise((r) => setTimeout(r, 400));
            return data.get('text') as string;
          },
          '',
        );
        return (
          <form action={submit}>
            <input name="text" placeholder="Say hi" />
            <button disabled={pending}>Send</button>
            {msg && <p>You said: {msg}</p>}
          </form>
        );
      }}
    </$>
  );
}
```

---

### `useFormStatus` (React-DOM ≥ 19)

```tsx
export function UseFormStatusExample() {
  return (
    <$>
      {({ useState, useFormStatus }) => {
        const [done, setDone] = useState(false);
        const { pending } = useFormStatus();

        const action = async () => {
          await new Promise((r) => setTimeout(r, 400));
          setDone(true);
        };

        return (
          <form action={action}>
            <button>{pending ? 'Saving…' : 'Save'}</button>
            {done && <p>saved!</p>}
          </form>
        );
      }}
    </$>
  );
}
```

---

### `use` (awaitable hook, React ≥ 19)

```tsx
function fetchQuote() {
  return new Promise<string>((r) =>
    setTimeout(() => r('"Ship early, ship often."'), 800),
  );
}

export function UseAwaitExample() {
  return (
    <$>
      {({ use }) => <blockquote>{use(fetchQuote())}</blockquote>}
    </$>
  );
}
```

---

## 🛠 Custom hooks

Inject any custom hooks once via the `hooks` prop:

```tsx
import $ from 'render-hooks';
import { useToggle, useDebounce } from './myHooks';

export function Example() {
  return (
    <$ hooks={{ useToggle, useDebounce }}>
      {({ useToggle, useDebounce }) => {
        const [open, toggle] = useToggle(false);
        const dOpen = useDebounce(open, 250);
        return (
          <>
            <button onClick={toggle}>toggle</button>
            <p>debounced: {dOpen.toString()}</p>
          </>
        );
      }}
    </$>
  );
}
```

---

## 🧱 Nesting hooks

You can nest `RenderHooks` (`$`) as deeply as you need. Each instance provides its own fresh set of hooks, scoped to its render callback. This is particularly useful for managing item-specific state within loops, where you'd otherwise need to create separate components.

Here's an example where RenderHooks is used to manage state for both levels of a nested list directly within the `.map()` callbacks, and a child can affect a parent RenderHook's state:

```tsx
import React from 'react'; // Needed for useState, useTransition in this example
import $ from 'render-hooks';

type Category = {
  id: number;
  name: string;
  posts: { id: number; title: string }[];
};

const data: Category[] = [
  {
    id: 1,
    name: 'Tech',
    posts: [{ id: 11, title: 'Next-gen CSS' }],
  },
  {
    id: 2,
    name: 'Life',
    posts: [
      { id: 21, title: 'Minimalism' },
      { id: 22, title: 'Travel hacks' },
    ],
  },
];

export function NestedExample() {
  return (
    <ul>
      {data.map((cat) => (
        /* ───── 1️⃣  Outer RenderHooks for each category row ───── */
        <$ key={cat.id}>
          {({ useState, useTransition }) => {
            const [expanded, setExpanded] = useState(false);
            const [likes, setLikes] = useState(0); 
            const [isPending, startTransition] = useTransition();

            return (
              <li>
                <button onClick={() => setExpanded(!expanded)}>
                  {expanded ? '▾' : '▸'} {cat.name} {likes === 0 ? '🖤' : '❤️'.repeat(likes)} ({likes} like{likes === 1 ? '' : 's'})
                  {isPending && ' (updating...)'}
                </button>

                {expanded && (
                  <ul>
                    {cat.posts.map((post) => (
                      /* ───── 2️⃣  Inner RenderHooks per post row ───── */
                      <$ key={post.id}>
                        {({ useState: useItemState }) => {
                          const [liked, setItemLiked] = useItemState(false);

                          const toggleLike = () => {
                            setItemLiked((prev) => {
                              // 🔄 Update outer «likes» using startTransition from the parent RenderHooks
                              const next = !prev;
                              startTransition(() => {
                                setLikes((c) => c + (next ? 1 : -1));
                              });
                              return next;
                            });
                          };

                          return (
                            <li>
                              {post.title}{' '}
                              <button onClick={toggleLike}>
                                {liked ? '❤️ Liked' : '🖤 Like'}
                              </button>
                            </li>
                          );
                        }}
                      </$>
                    ))}
                  </ul>
                )}
              </li>
            );
          }}
        </$>
      ))}
    </ul>
  );
}
```

In this example:
- The main `NestedExample` component does not use RenderHooks directly.
- The **first `.map()`** iterates through `data`. Inside this map, `<$>` is used to give each `category` its own states: `expanded` and `likes`. It also gets `useTransition` to acquire `startTransition`.
- The **second, inner `.map()`** iterates through `cat.posts`. Inside *this* map, another, nested `<$>` is used to give each `post` its own independent `liked` state.
- Crucially, when a post's `toggleLike` function is called, it updates its local `liked` state and then calls `startTransition` (obtained from the parent category's RenderHooks scope) to wrap the update to the parent's `likes` state. 

This demonstrates not only nesting for independent state but also how functions and transition control from a parent RenderHooks instance can be utilized by children that also use RenderHooks, facilitating robust cross-scope communication.

> [!IMPORTANT]
> **Note on `startTransition`**: Using `startTransition` here is important. When an interaction (like clicking "Like") in a nested `RenderHooks` instance needs to update state managed by a parent `RenderHooks` instance, React might issue a warning about "updating one component while rendering another" if the update is synchronous. Wrapping the parent's state update in `startTransition` signals to React that this update can be deferred, preventing the warning and ensuring smoother UI updates. This is a general React pattern applicable when updates across component boundaries (or deeply nested state updates) might occur.

---

## 🤝 Collaboration

RenderHooks is a community-driven project. Every idea, issue, and pull request helps it grow and improve.

Whether you're fixing a typo or implementing a brand-new feature, **you're warmly welcome here!** ✨

### How to contribute

1. ⭐️ **Star the repo** – it helps others discover the project and shows your support.
2. 🐛 **Report bugs / request features** – open an issue and describe the problem or idea. Reproduction steps or code snippets are golden.
3. 📚 **Improve the docs** – spot a typo, unclear wording, or missing example? Submit a quick PR.
4. 👩‍💻 **Send code changes** – bug fixes, performance tweaks, new examples, or custom hooks… big or small, they're all appreciated. If you're unsure, open a draft PR and we'll figure it out together.
5. 💬 **Join the conversation** – comment on issues & PRs, share how you're using RenderHooks, or ask questions. First-time contributors are encouraged to jump in!
6. 📣 **Share it** - if you love it, please share it! I want to grow this tool into something that makes all of our day-to-day lives a bit easier, so no gate-keeping. 

If this would be your **first open-source contribution**, don't hesitate to ask for guidance—I'll happily walk you through the process.

Thank you for making RenderHooks better for everyone! 🙏
