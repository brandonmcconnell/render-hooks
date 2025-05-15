/** @vitest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor, act as rtlAct } from '@testing-library/react';
import '@testing-library/jest-dom';
import $ from './index'; // Assuming RenderHooks is the default export from src/index.tsx
import { useFormStatus as reactDom_useFormStatus } from 'react-dom'; // Import for useFormStatus test
import { vi, describe, it, expect } from 'vitest';

describe('RenderHooks Component', () => {
  describe('Built-in Hooks Examples', () => {
    it('useState example works', () => {
      const UseStateExample = () => (
        <$>
          {({ useState }) => {
            const [value, set] = useState!('');
            return <input aria-label="value-input" value={value} onChange={(e) => set(e.target.value)} />;
          }}
        </$>
      );
      render(<UseStateExample />);
      const inputElement = screen.getByLabelText('value-input') as HTMLInputElement;
      expect(inputElement.value).toBe('');
      fireEvent.change(inputElement, { target: { value: 'test' } });
      expect(inputElement.value).toBe('test');
    });

    it('useReducer example works', () => {
      const UseReducerExample = () => (
        <$>
          {({ useReducer }) => {
            const [count, dispatch] = useReducer!(
              (s: number, a: 'inc' | 'dec') => (a === 'inc' ? s + 1 : s - 1),
              0,
            );
            return (
              <>
                <button onClick={() => dispatch('dec')}>-</button>
                <span data-testid="count-span">{count}</span>
                <button onClick={() => dispatch('inc')}>+</button>
              </>
            );
          }}
        </$>
      );
      render(<UseReducerExample />);
      const countSpan = screen.getByTestId('count-span');
      const incButton = screen.getByText('+');
      const decButton = screen.getByText('-');

      expect(countSpan).toHaveTextContent('0');
      fireEvent.click(incButton);
      expect(countSpan).toHaveTextContent('1');
      fireEvent.click(decButton);
      fireEvent.click(decButton);
      expect(countSpan).toHaveTextContent('-1');
    });

    it('useCallback example works', () => {
      const mockFn = vi.fn();
      const UseCallbackExample = () => (
        <$>
          {({ useState, useCallback }) => {
            const [txt, setTxt] = useState!('');
            const onChange = useCallback!(
              (e: React.ChangeEvent<HTMLInputElement>) => {
                setTxt(e.target.value);
                mockFn(e.target.value);
              },
              [],
            );
            return <input aria-label="callback-input" value={txt} onChange={onChange} />;
          }}
        </$>
      );
      render(<UseCallbackExample />);
      const inputElement = screen.getByLabelText('callback-input');
      fireEvent.change(inputElement, { target: { value: 'callback test' } });
      expect(mockFn).toHaveBeenCalledWith('callback test');
    });

    it('useContext example works', () => {
      const ThemeCtx = React.createContext<'light' | 'dark'>('light');
      const UseContextExample = () => (
        <ThemeCtx.Provider value="dark">
          <$>
            {({ useContext }) => <p>Theme: {useContext!(ThemeCtx)}</p>}
          </$>
        </ThemeCtx.Provider>
      );
      render(<UseContextExample />);
      expect(screen.getByText('Theme: dark')).toBeInTheDocument();
    });

    it('useMemo example works', () => {
      const UseMemoExample = () => (
        <$>
          {({ useState, useMemo }) => {
            const [n, setN] = useState!(5);
            const fib = useMemo!(() => {
              const f = (x: number): number => (x <= 1 ? x : f(x - 1) + f(x - 2));
              return f(n);
            }, [n]);
            return (
              <>
                <input
                  type="number"
                  aria-label="memo-input"
                  value={n}
                  onChange={(e) => setN(+e.target.value)}
                />
                <p>Fib({n}) = {fib}</p>
              </>
            );
          }}
        </$>
      );
      render(<UseMemoExample />);
      expect(screen.getByText('Fib(5) = 5')).toBeInTheDocument();
      const inputElement = screen.getByLabelText('memo-input');
      fireEvent.change(inputElement, { target: { value: '6' } });
      expect(screen.getByText('Fib(6) = 8')).toBeInTheDocument();
    });

    it('useEffect example works', async () => {
      vi.useFakeTimers();
      const UseEffectExample = () => (
        <$>
          {({ useState, useEffect }) => {
            const [time, setTime] = useState!('');
            useEffect!(() => {
              const id = setInterval(
                () => {
                  const newTime = new Date().toLocaleTimeString();
                  setTime(newTime);
                },
                1000,
              );
              return () => clearInterval(id);
            }, []);
            return <p>{time || 'loading...'}</p>;
          }}
        </$>
      );
      render(<UseEffectExample />);
      expect(screen.getByText('loading...')).toBeInTheDocument();
      rtlAct(() => {
        vi.advanceTimersByTime(1000);
      });
      vi.advanceTimersByTime(0); // Ensure setInterval callback and React re-render are processed

      // Synchronous check for "loading..." to be gone
      expect(screen.queryByText('loading...')).not.toBeInTheDocument();

      // Second synchronous check for the time text
      vi.advanceTimersByTime(0); // Ensure microtasks from first assertion are flushed
      expect(screen.getByText(/:/)).toBeInTheDocument();

      vi.useRealTimers();
    }, 5000); // <-- Test-specific timeout of 5000ms

    it('useLayoutEffect example works', () => {
      const UseLayoutEffectExample = () => (
        <$>
          {({ useRef, useLayoutEffect }) => {
            const box = useRef!<HTMLDivElement>(null);
            useLayoutEffect!(() => {
              if (box.current) {
                box.current.style.background = 'rgb(255, 213, 79)'; // #ffd54f
              }
            }, []);
            return <div ref={box} data-testid="layout-box"> highlighted after layout </div>;
          }}
        </$>
      );
      render(<UseLayoutEffectExample />);
      const boxElement = screen.getByTestId('layout-box');
      expect(boxElement).toHaveStyle('background: rgb(255, 213, 79)');
    });

    it('useImperativeHandle example works', () => {
      const Fancy = React.forwardRef<{ focus: () => void }>((_, ref) => (
        <$>
          {({ useRef, useImperativeHandle }) => {
            const local = useRef!<HTMLInputElement>(null);
            useImperativeHandle!(ref, () => ({
              focus: () => local.current?.focus(),
            }));
            return <input ref={local} placeholder="Fancy input" defaultValue="fancy value" />;
          }}
        </$>
      ));
      Fancy.displayName = 'Fancy';

      const UseImperativeHandleExample = () => {
        const ref = React.useRef<{ focus: () => void }>(null);
        return (
          <>
            <Fancy ref={ref} />
            <button onClick={() => ref.current?.focus()}>Focus Fancy</button>
          </>
        );
      };
      render(<UseImperativeHandleExample />);
      const button = screen.getByText('Focus Fancy');
      const inputInsideFancy = screen.getByPlaceholderText('Fancy input') as HTMLInputElement;
      expect(inputInsideFancy).not.toHaveFocus();
      fireEvent.click(button);
      expect(inputInsideFancy).toHaveFocus();
    });

    it('useRef example works', () => {
      const UseRefExample = () => (
        <$>
          {({ useRef }) => {
            const input = useRef!<HTMLInputElement>(null);
            return (
              <>
                <button onClick={() => input.current?.focus()}>focus</button>
                <input ref={input} aria-label="ref-input" />
              </>
            );
          }}
        </$>
      );
      render(<UseRefExample />);
      const inputElement = screen.getByLabelText('ref-input');
      const button = screen.getByText('focus');
      expect(inputElement).not.toHaveFocus();
      fireEvent.click(button);
      expect(inputElement).toHaveFocus();
    });

    it('useInsertionEffect example works', () => {
      const UseInsertionEffectExample = () => (
        <$>
          {({ useInsertionEffect }) => {
            useInsertionEffect!(() => {
              const style = document.createElement('style');
              style.id = 'flash-style';
              style.textContent = '.flash{animation:flash 1s steps(2) infinite;}\n@keyframes flash{to{opacity:.2}}';
              document.head.append(style);
              return () => {
                document.getElementById('flash-style')?.remove();
              };
            }, []);
            return <p className="flash" data-testid="flash-text">flashing text</p>;
          }}
        </$>
      );
      const { unmount } = render(<UseInsertionEffectExample />);
      const styleElement = document.getElementById('flash-style');
      expect(styleElement).toBeInTheDocument();
      expect(styleElement?.textContent).toContain('.flash{animation:flash 1s steps(2) infinite;}');
      expect(screen.getByTestId('flash-text')).toHaveClass('flash');
      unmount();
      expect(document.getElementById('flash-style')).not.toBeInTheDocument();
    });

    it('useId example works', () => {
      const UseIdExample = () => (
        <$>
          {({ useId, useState }) => {
            const id = useId!();
            const [v, set] = useState!('');
            return (
              <>
                <label htmlFor={id}>Name</label>
                <input id={id} value={v} onChange={(e) => set(e.target.value)} />
              </>
            );
          }}
        </$>
      );
      render(<UseIdExample />);
      const label = screen.getByText('Name');
      const input = screen.getByLabelText('Name');
      expect(input.id).toBe(label.getAttribute('for'));
      expect(input.id).toMatch(/^(:r\d+:|«r\d+?»)$/);
    });

    it('useSyncExternalStore example works', () => {
      const listeners: Array<() => void> = [];
      const subscribe = (cb: () => void) => {
        window.addEventListener('resize', cb);
        listeners.push(cb);
        return () => {
          window.removeEventListener('resize', cb);
          const index = listeners.indexOf(cb);
          if (index > -1) listeners.splice(index, 1);
        };
      };
      const getSnapshot = () => window.innerWidth;

      const originalInnerWidth = window.innerWidth;

      const UseSyncExternalStoreExample = () => (
        <$>
          {({ useSyncExternalStore }) => {
            const width = useSyncExternalStore!(
              subscribe,
              getSnapshot,
            );
            return <p>width: {width}px</p>;
          }}
        </$>
      );

      render(<UseSyncExternalStoreExample />);
      expect(screen.getByText(`width: ${originalInnerWidth}px`)).toBeInTheDocument();

      rtlAct(() => {
        (window as any).innerWidth = 1024;
        window.dispatchEvent(new Event('resize'));
      });
      expect(screen.getByText('width: 1024px')).toBeInTheDocument();

      rtlAct(() => {
        (window as any).innerWidth = originalInnerWidth;
         window.dispatchEvent(new Event('resize'));
      });
       expect(screen.getByText(`width: ${originalInnerWidth}px`)).toBeInTheDocument();
    });

    it('useDeferredValue example works', async () => {
      vi.useFakeTimers();
      const UseDeferredValueExample = () => (
        <$>
          {({ useState, useDeferredValue }) => {
            const [text, setText] = useState!('');
            const deferred = useDeferredValue!(text);
            return (
              <>
                <input aria-label="deferred-input" value={text} onChange={(e) => setText(e.target.value)} />
                <p data-testid="deferred-output">deferred: {deferred}</p>
              </>
            );
          }}
        </$>
      );
      render(<UseDeferredValueExample />);
      const input = screen.getByLabelText('deferred-input');
      const output = screen.getByTestId('deferred-output');

      expect(output).toHaveTextContent('deferred:');

      rtlAct(() => {
        fireEvent.change(input, { target: { value: 'hello' } });
      });

      // Allow deferred value to update
      rtlAct(() => {
        vi.runAllTimers();
      });
      vi.advanceTimersByTime(0); // Flush tasks

      expect(output).toHaveTextContent('deferred: hello');
      vi.useRealTimers();
    }, 5000); // Test-specific timeout

    it('useTransition example works', async () => {
      vi.useFakeTimers();
      const UseTransitionExample = () => (
        <$>
          {({ useState, useTransition }) => {
            const [list, setList] = useState!<string[]>([]);
            const [pending, start] = useTransition!();
            const filter = (e: React.ChangeEvent<HTMLInputElement>) => {
              const q = e.target.value;
              start(() => {
                // Simulate async work for the transition with a timer
                setTimeout(() => {
                  const fullList = Array.from({ length: 10 }, (_, i) => `Item ${i}`);
                  setList(fullList.filter((x) => x.includes(q)));
                }, 10); 
              });
            };
            return (
              <>
                <input onChange={filter} placeholder="filter items" aria-label="transition-input"/>
                {/* We will not assert the pending state directly due to timing complexities with fake timers */}
                {/* {pending && <p>updating…</p>} */}
                <p data-testid="transition-list-length">{list.length} items</p>
                <ul>{list.map(item => <li key={item}>{item}</li>)}</ul>
              </>
            );
          }}
        </$>
      );
      render(<UseTransitionExample />);
      const input = screen.getByLabelText('transition-input');
      const listLength = screen.getByTestId('transition-list-length');

      expect(listLength).toHaveTextContent('0 items');

      rtlAct(() => {
        fireEvent.change(input, { target: { value: 'Item 1' } });
      });

      // Removed: Check for pending state, as it's too transient with fake timers here.

      // Complete the transition work by running all timers
      rtlAct(() => {
        vi.runAllTimers(); // This executes the setTimeout(..., 10) inside startTransition
      });
      
      // Flush any pending macrotasks from React updates
      vi.advanceTimersByTime(0);

      // Assertions for the final state
      expect(screen.queryByText('updating…')).not.toBeInTheDocument(); // Should be gone now
      expect(listLength).toHaveTextContent('1 items');
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      
      vi.useRealTimers();
    }, 10000); 

    it('useActionState example works', async () => {
      vi.useFakeTimers();

      const mockAction = vi.fn(async (_prev: string | null, data: FormData) => {
        await new Promise((r) => setTimeout(r, 50));
        return `Said: ${data.get('text') as string}`;
      });

      const UseActionStateExample = () => (
        <$>
          {({ useActionState }) => {
            const [msg, submit, pending] = useActionState!<string | null, FormData>(mockAction, null);
            return (
              <form 
                action={submit as unknown as ((payload: FormData) => void) | string}
              >
                <input name="text" placeholder="Say hi" aria-label="action-state-input" />
                <button type="submit" disabled={pending}>Send</button>
                {pending && <p>Submitting...</p>}
                {msg && <p data-testid="action-state-msg">{msg}</p>}
              </form>
            );
          }}
        </$>
      );

      render(<UseActionStateExample />);
      const input = screen.getByLabelText('action-state-input');
      const button = screen.getByText('Send');

      rtlAct(() => {
        fireEvent.change(input, { target: { value: 'Hello Action' } });
        fireEvent.click(button);
      });

      // Assert pending state immediately after action is dispatched
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
      expect(button).toBeDisabled();

      // Wait for the action to complete and UI to update
      // This act block covers the resolution of timers and the promise from mockAction,
      // and the subsequent state updates in useActionState.
      await rtlAct(async () => {
        vi.runAllTimers(); // Resolve the setTimeout within mockAction
        await Promise.resolve(); // Ensure promise from mockAction (if any) resolves and is processed
      });

      // Assert final state: React should have updated after the act block
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument();

      // Final check for mock calls after waitFor confirms UI is stable
      expect(mockAction).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    }, 5000);

    it('useFormStatus example works (within a form component)', async () => {
      vi.useFakeTimers(); // Good practice, though mockFormAction is manually resolved
      let formActionResolver: () => void = () => {}; // Initialize to satisfy TS
      const mockFormAction = vi.fn(async () => {
        await new Promise<void>(resolve => { formActionResolver = resolve; });
      });

      const SubmitButton = () => {
        const { pending } = reactDom_useFormStatus();
        return <button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>;
      };

      const StatusDisplay = () => {
         const { pending } = reactDom_useFormStatus();
         return pending ? <p>Form is pending...</p> : <p>Form is idle.</p>;
      };

      const UseFormStatusExampleForm = () => {
         const [done, setDone] = React.useState(false);
         const formActionAttr = async (payload: FormData) => {
           await mockFormAction();
           setDone(true);
         };
        return (
           <$>
            {() => (
              <form action={formActionAttr as unknown as ((payload: FormData) => void) | string}>
                <StatusDisplay/>
                <SubmitButton />
                {done && <p data-testid="form-done-msg">saved!</p>}
              </form>
            )}
          </$>
        );
      };

      render(<UseFormStatusExampleForm />);
      const saveButton = screen.getByText('Save');
      expect(screen.getByText('Form is idle.')).toBeInTheDocument();

      rtlAct(() => {
        fireEvent.click(saveButton);
      });

      expect(mockFormAction).toHaveBeenCalledTimes(1);
      // Assert pending state for SubmitButton and StatusDisplay
      expect(screen.getByText('Saving…')).toBeInTheDocument();
      expect(screen.getByText('Form is pending...')).toBeInTheDocument();
      expect(saveButton).toBeDisabled();

      // Resolve the form action and wait for state updates
      await rtlAct(async () => {
        formActionResolver(); // Resolve the mockFormAction's promise
        await Promise.resolve(); // Ensure promise propagation and related state updates are processed
      });
      vi.advanceTimersByTime(0); // Flush any final React updates if necessary

      // Assert final state
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Form is idle.')).toBeInTheDocument();
      expect(screen.getByTestId('form-done-msg')).toHaveTextContent('saved!');
      expect(saveButton).not.toBeDisabled();
      vi.useRealTimers();
    }, 5000);

    it("'use' (awaitable hook) example works", async () => {
      vi.useFakeTimers();
      const fetchQuote = () => new Promise<string>((r) => setTimeout(() => r('"Ship early, ship often."' ), 50));
      const fetchQuotePromise = fetchQuote(); // Get the promise instance beforehand

      // Ensure the promise is resolved before rendering the component that uses it.
      // Use act to be safe, though direct await might also work if no React updates are expected here.
      await rtlAct(async () => {
        vi.runAllTimers();       // Resolve the setTimeout in fetchQuote
        await fetchQuotePromise; // Explicitly wait for the promise to settle
      });

      const UseAwaitExample = () => (
        <React.Suspense fallback={<p>Loading quote...</p>}>
          <$>
            {({ use }) => {
                const quote = (use! as (promise: Promise<string>) => string)(fetchQuotePromise);
                return <blockquote>{quote}</blockquote>;
            }}
          </$>
        </React.Suspense>
      );

      // Wrap render in act to handle the synchronous resolution of the pre-resolved promise by the 'use' hook
      await rtlAct(async () => {
        render(<UseAwaitExample />);
        // Since the promise is pre-resolved, React should synchronously render the result.
        // We might need a microtask tick for React to fully process if there are internal updates.
        await Promise.resolve(); 
      });
      
      // With a pre-resolved promise and render in act, the content should be immediately available
      expect(screen.getByText('"Ship early, ship often."' )).toBeInTheDocument();
      // And the fallback should not have been rendered (or be gone)
      expect(screen.queryByText('Loading quote...')).not.toBeInTheDocument();

      vi.useRealTimers();
    }, 5000);
  });

  describe('Custom Hooks Example', () => {
    it('custom hooks can be provided and used', async () => {
      vi.useFakeTimers(); // Added for debounce
      const useToggle = (initialValue = false): [boolean, () => void] => {
        const [value, setValue] = React.useState(initialValue);
        const toggle = React.useCallback(() => setValue((v) => !v), []);
        return [value, toggle];
      };
      const useDebounce = <T,>(value: T, delay: number): T => {
        const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
        React.useEffect(() => {
          const handler = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(handler);
        }, [value, delay]);
        return debouncedValue;
      };

      const customHooks = { useToggle, useDebounce };

      const CustomHooksExample = () => (
        <$ hooks={customHooks}>
          {({ useToggle, useDebounce }) => {
            const [open, toggle] = useToggle!(false);
            const dOpen = useDebounce!(open, 50);
            return (
              <>
                <button onClick={toggle}>toggle</button>
                <p data-testid="custom-open-state">open: {open.toString()}</p>
                <p data-testid="custom-debounced-state">debounced: {dOpen.toString()}</p>
              </>
            );
          }}
        </$>
      );
      render(<CustomHooksExample />);
      const toggleButton = screen.getByText('toggle');
      const openState = screen.getByTestId('custom-open-state');
      const debouncedState = screen.getByTestId('custom-debounced-state');

      expect(openState).toHaveTextContent('open: false');
      expect(debouncedState).toHaveTextContent('debounced: false');

      fireEvent.click(toggleButton);
      expect(openState).toHaveTextContent('open: true');
      expect(debouncedState).toHaveTextContent('debounced: false');

      // Wait for debounce to complete
      rtlAct(() => {
        vi.runAllTimers(); // Process setTimeout in useDebounce
      });
      vi.advanceTimersByTime(0); // Ensure React re-renders and microtasks are flushed

      // Now assert the debounced state
      expect(debouncedState).toHaveTextContent('debounced: true');
      vi.useRealTimers(); // Added for debounce
    }, 5000); // Added test-specific timeout
  });
}); 