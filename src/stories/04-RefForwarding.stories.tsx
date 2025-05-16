import type { Meta, StoryObj } from '@storybook/react';
import React from 'react'; // Needed for React.forwardRef, React.useRef, useState
import $ from '../index'; // Or your chosen alias

// Copied from README.md Forwarding Refs section
interface FocusableInputBoxProps {
  initialValue?: string;
  placeholder?: string;
}

const FocusableInputBox = React.forwardRef<
  HTMLInputElement,
  FocusableInputBoxProps
>((props, ref) => {
  const { initialValue = '', placeholder } = props;
  return (
    <$ ref={ref}>
      {({ useState, forwardedRef }) => {
        const [value, setValue] = useState(initialValue);
        return (
          <input
            ref={forwardedRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder || 'Focusable input...'}
            style={{ border: '1px solid grey', padding: '4px'}}
          />
        );
      }}
    </$>
  );
});
FocusableInputBox.displayName = 'FocusableInputBox';

export function RefForwardingUseExample() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleClick = () => {
    inputRef.current?.focus();
  };
  return (
    <div>
      <FocusableInputBox ref={inputRef} placeholder="Click button to focus me" />
      <button onClick={handleClick} style={{ marginTop: '5px' }}>Focus the Input Box</button>
      <p><small>This demonstrates RenderHooks receiving a forwarded ref and passing it to an internal element.</small></p>
    </div>
  );
}
// End of copied code

const meta: Meta<typeof RefForwardingUseExample> = {
  title: 'Examples/Ref Forwarding',
  component: RefForwardingUseExample,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Forwarding Ref to Internal Element'
}; 