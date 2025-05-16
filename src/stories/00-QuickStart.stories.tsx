import type { Meta, StoryObj } from '@storybook/react';
import React from 'react'; // React is implicitly used by JSX and useState
import $ from '../index';

// Copied from README.md Quick Start
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

const meta: Meta<typeof Counter> = {
  title: 'Examples/Quick Start',
  component: Counter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
// type Story = StoryObj<typeof meta>;

// export const Default: Story = {}; 