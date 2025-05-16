import type { Meta } from '@storybook/react';
import React from 'react'; // For useState
import $ from '../index';

// Dummy custom hooks (as defined in README, assuming they would be in ./myHooks)
// For Storybook, we'll define them directly in this file.
const useToggle = (initialValue = false): [boolean, () => void] => {
  const [state, setState] = React.useState(initialValue);
  const toggle = React.useCallback(() => setState((s) => !s), []);
  return [state, toggle];
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};
// End of dummy custom hooks

// Copied from README.md Custom Hooks section
export function CustomHooksExample() {
  return (
    <$ hooks={{ useToggle, useDebounce }}>
      {/* @ts-ignore */}
      {({ useToggle, useDebounce, useState }) => { // Added useState for completeness
        const [open, toggle] = useToggle(false);
        const dOpen = useDebounce(open, 250);
        const [count, setCount] = useState(0); // Example of using a built-in hook alongside

        return (
          <div>
            <button onClick={toggle}>Toggle Custom Hook</button>
            <p> 'open' (from useToggle): {open.toString()}</p>
            <p>Debounced 'open' (from useDebounce): {dOpen.toString()}</p>
            <hr />
            <button onClick={() => setCount(c => c + 1)}>Increment Built-in Hook ({count})</button>
          </div>
        );
      }}
    </$>
  );
}
CustomHooksExample.storyName = 'Using Custom Hooks';

const meta: Meta<typeof CustomHooksExample> = {
  title: 'Examples/Custom Hooks',
  component: CustomHooksExample,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;