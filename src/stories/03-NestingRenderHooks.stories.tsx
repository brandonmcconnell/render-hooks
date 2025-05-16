import type { Meta } from '@storybook/react';
import React from 'react'; // Needed for useState, useTransition in this example
import $ from '../index';

// Copied from README.md Nesting RenderHooks section
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
  {
    id: 3,
    name: 'Food',
    posts: [
      { id: 31, title: 'Quick Dinners' },
      { id: 32, title: 'Baking Bread' },
      { id: 33, title: 'Global Cuisine' },
    ],
  },
];

export function NestedExample() {
  return (
    <ul style={{ listStyle: 'none', paddingLeft: '0'}}>
      {data.map((cat) => (
        /* ───── 1️⃣  Outer RenderHooks for each category row ───── */
        <$ key={cat.id}>
          {({ useState, useTransition }) => {
            const [expanded, setExpanded] = useState(false);
            const [likes, setLikes] = useState(0);
            const [isPending, startTransition] = useTransition();

            return (
              <li style={{ marginBottom: '10px', border: '1px solid #eee', padding: '10px' }}>
                <button onClick={() => setExpanded(!expanded)} style={{ fontWeight: 'bold', marginBottom: '5px'}}>
                  {expanded ? '▾' : '▸'} {cat.name} {likes === 0 ? '🖤' : '❤️'.repeat(likes)} ({likes} like{likes === 1 ? '' : 's'})
                  {isPending && ' (updating...)'}
                </button>

                {expanded && (
                  <ul style={{ listStyle: 'none', paddingLeft: '20px'}}>
                    {cat.posts.map((post) => (
                      /* ───── 2️⃣  Inner RenderHooks per post row ───── */
                      <$ key={post.id}>
                        {({ useState: useItemState }) => {
                          const [liked, setItemLiked] = useItemState(false);

                          const toggleLike = () => {
                            setItemLiked((prev) => {
                              const next = !prev;
                              // 🔄 Update outer «likes» using startTransition from the parent RenderHooks
                              startTransition(() => {
                                setLikes((c) => c + (next ? 1 : -1));
                              });
                              return next;
                            });
                          };

                          return (
                            <li style={{ marginTop: '5px'}}>
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
NestedExample.storyName = 'Using Nested Hooks';
// End of copied code

const meta: Meta<typeof NestedExample> = {
  title: 'Examples/Nested Hooks',
  component: NestedExample,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
