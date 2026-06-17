---
title: The Road to React Notes (Parts 1-8)
date: 2026-03-16
description: Study notes covering React fundamentals, components/props, state, hooks, async data fetching, styling, testing, and interview scenarios.
tags:
  - react
  - frontend
  - javascript
  - hooks
  - testing
draft: false
---

# React Reference Notes (Parts 1–8)

---

## Part 1 — Fundamentals of React

> **Mental model:** `UI = f(state)`. State changes → re-render → diff virtual DOM → minimal real DOM updates.

### What React Is (and Isn't)

React is a **view library**, not a framework. It handles rendering and state. Everything else (routing, data fetching, forms) you bring yourself.

| Concept | Meaning |
|---|---|
| Declarative UI | Describe *what* to render, not *how* to do it step-by-step |
| Component-based | UI = tree of isolated, reusable pieces |
| Unidirectional data flow | Data moves parent → child via props only |
| Virtual DOM | In-memory representation; React diffs it and patches only what changed |

### Setup (Vite — use this, not CRA)

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev      # dev server — NOT production-ready
npm run build    # optimized production build
npm run preview  # serve the production build locally
```

### JSX

JSX = JavaScript + HTML syntax sugar. Transpiled by Babel to `React.createElement()` calls.

```jsx
const name = 'Nishanth';
const element = <h1>{name}</h1>; // {} embeds any JS expression

// Must have one root — use Fragment to avoid extra DOM nodes
return (
  <>
    <Header />
    <Main />
  </>
);
```

HTML → JSX attribute differences:

| HTML | JSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |

### Rendering Lists

```jsx
// ✅ Good — stable unique key
items.map(item => <li key={item.id}>{item.name}</li>)

// ❌ Bad — index as key breaks reordering
items.map((item, index) => <li key={index}>{item}</li>)
```

Keys must be unique among siblings. They help React identify which items changed, were added, or were removed. Array index keys break when the list reorders.

### Entry Point

```jsx
// main.jsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

### Key Pitfalls

- JSX is not HTML — `class` → `className`, `for` → `htmlFor`.
- Fragment (`<>`) avoids unnecessary wrapper `div`s.
- Never use array index as key if list can reorder or filter.
- JSX must return one root element.

---

## Part 2 — Components and Props

> Props are immutable inputs. If a child needs to change something in the parent, pass a callback down.

### Function Components

```jsx
// Named function (prefer for debugging)
function Welcome({ name }) {
  return <h2>Hello {name}</h2>;
}

// Arrow function
const Welcome = ({ name }) => <h2>Hello {name}</h2>;
```

### Props

```jsx
// Parent passes data
<UserCard name="Nishanth" role="Engineer" />

// Child receives via destructuring
function UserCard({ name, role }) {
  return <p>{name} — {role}</p>;
}
```

Props are **read-only**. Never mutate them:

```jsx
// ❌ Never do this
function Profile(props) {
  props.name = 'Changed'; // mutation — will cause bugs
}
```

### Child → Parent Communication

Pass a callback function as a prop:

```jsx
function Child({ onAction }) {
  return <button onClick={onAction}>Click Me</button>;
}

function Parent() {
  const handleAction = () => console.log('child triggered this');
  return <Child onAction={handleAction} />;
}
```

### Spread and Rest Props

```jsx
// Spread — pass all props of an object
const user = { name: 'Nishanth', role: 'Engineer' };
<UserCard {...user} />

// Rest — capture remaining props
function Card({ title, ...rest }) {
  return <div {...rest}>{title}</div>; // rest forwarded to div
}
```

### Default Props

```jsx
function Button({ label = 'Submit', size = 'md' }) {
  return <button className={`btn-${size}`}>{label}</button>;
}
```

### Prop Types (runtime validation — use TypeScript in real projects)

```jsx
import PropTypes from 'prop-types';

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
```

### Key Pitfalls

- Props vs state: props are external inputs, state is internal mutable data.
- Child → parent always through callbacks, never by mutating props.
- `children` is a special prop — what you put between component tags.

---

## Part 3 — State Management in React

> State is data that changes over time and triggers re-renders.

### `useState`

```jsx
const [count, setCount] = useState(0);

// Functional update — use when new state depends on old state
setCount(prev => prev + 1); // safe in async context
setCount(count + 1);        // can be stale in batched updates
```

### Rules of Hooks

1. Call hooks only at the **top level** — never inside loops, conditions, or nested functions.
2. Call hooks only in **React function components** or **custom hooks**.

### Lifting State Up

When siblings need to share state, move it to their closest common ancestor:

```jsx
function App() {
  const [query, setQuery] = useState('');

  return (
    <>
      <Search onSearch={setQuery} />        {/* sets state */}
      <List query={query} />                {/* reads state */}
    </>
  );
}
```

### Controlled vs Uncontrolled Components

```jsx
// Controlled — React owns the value
function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// Uncontrolled — DOM owns the value, ref to read it
function UncontrolledForm() {
  const inputRef = useRef();
  const handleSubmit = e => {
    e.preventDefault();
    console.log(inputRef.current.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Prefer controlled components — React has full control of the data.

### `useReducer` — When State Logic Gets Complex

Use over `useState` when:
- Multiple sub-values are interdependent
- Next state depends on a specific action type
- Logic is complex enough to extract and test separately

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    case 'RESET':     return { count: 0 };
    default: throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </>
  );
}
```

### Key Pitfalls

- Never mutate state directly: `state.items.push(x)` — React won't re-render.
- Always use spread to update objects/arrays: `setItems([...items, newItem])`.
- State updates are **asynchronous and batched** — don't read state immediately after setting.
- `useState(fn)` — pass a function for expensive initial state computation (runs once).

---

## Part 4 — React Hooks in Depth

### `useEffect`

Runs **after** the render is committed to the screen.

```jsx
// Dependency array controls when it runs
useEffect(() => { /* ... */ });            // every render
useEffect(() => { /* ... */ }, []);        // once on mount
useEffect(() => { /* ... */ }, [value]);   // when value changes
```

Always return a **cleanup function** for subscriptions, timers, and event listeners:

```jsx
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timer); // cleanup on unmount or before next run
}, []);
```

> ⚠️ Don't make the `useEffect` callback `async` directly. Create an inner async function and call it:

```jsx
useEffect(() => {
  const load = async () => {
    const res = await fetch(url);
    setData(await res.json());
  };
  load();
}, [url]);
```

### `useEffect` vs `useLayoutEffect`

| Hook | Fires When | Use For |
|---|---|---|
| `useEffect` | After browser paint | Data fetching, subscriptions, logging |
| `useLayoutEffect` | Before browser paint (sync) | DOM measurements, preventing flicker |

Default to `useEffect`. Only use `useLayoutEffect` for visual DOM measurements.

### `useRef`

Persists a value across renders **without triggering a re-render**.

```jsx
// 1. DOM access
const inputRef = useRef();
useEffect(() => { inputRef.current.focus(); }, []);
return <input ref={inputRef} />;

// 2. Mutable value (timer ID, previous value, etc.)
const timerRef = useRef(null);
timerRef.current = setTimeout(...);
clearTimeout(timerRef.current);
```

`useRef` vs `useState`:

| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render | Yes | No |
| Persists across renders | Yes | Yes |
| Use for | UI data | DOM refs, mutable values |

### `useCallback` and `useMemo`

```jsx
// useCallback — memoize a function (stable reference across renders)
const handleSearch = useCallback((query) => {
  performSearch(query);
}, [/* deps */]);

// useMemo — memoize a computed value
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

When to use:
- `useCallback` — when passing callbacks to memoized children (`React.memo`)
- `useMemo` — when computation is expensive and deps change infrequently

Don't memoize everything — it has overhead. Measure first.

### Custom Hooks

Extract and reuse stateful logic. Must start with `use`.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
```

### Key Pitfalls

- Missing deps in `useEffect` → stale closures.
- Async `useEffect` callback → will return a Promise, not a cleanup function.
- `useLayoutEffect` in SSR → runs synchronously, can cause issues.
- Refs don't trigger re-renders — don't use them to display data in JSX.

---

## Part 5 — Asynchronous Operations and Data Fetching

### Fetch Patterns

```jsx
// Basic
const res = await fetch('/api/posts');
if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
const data = await res.json();

// Parallel — faster than sequential awaits
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
]);
```

### Standard Async State Pattern

```jsx
function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (!cancelled) setPosts(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; }; // prevent state update after unmount
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

### `useReducer` for Async State (Cleaner Pattern)

```jsx
function dataReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':    return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { loading: false, error: null, data: action.payload };
    case 'FETCH_FAILURE': return { ...state, loading: false, error: action.error };
    default: throw new Error(`Unknown action: ${action.type}`);
  }
}

// Dispatch actions instead of juggling 3 setX() calls
dispatch({ type: 'FETCH_INIT' });
dispatch({ type: 'FETCH_SUCCESS', payload: data });
dispatch({ type: 'FETCH_FAILURE', error: err.message });
```

### Debounced Search (Common Interview Pattern)

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500); // only fires 500ms after typing stops

  useEffect(() => {
    if (debouncedQuery) fetch(`/api/search?q=${debouncedQuery}`);
  }, [debouncedQuery]);

  return <input onChange={e => setQuery(e.target.value)} />;
}
```

### Key Pitfalls

- Not checking `res.ok` — fetch only rejects on network failure, not HTTP errors (404, 500).
- Setting state after unmount — use the cancel flag pattern.
- Sequential `await` calls when they could be parallel — use `Promise.all`.
- Not handling loading and error states — users see nothing or a broken UI.

---

## Part 6 — Styling in React

### Approach Comparison

| Approach | Scope | Dynamic Styles | Pseudo-selectors | Best For |
|---|---|---|---|---|
| Plain CSS | Global | No | Yes | Simple apps |
| CSS Modules | Scoped | No | Yes | Most projects |
| Inline styles | Scoped | Yes | ❌ No | Quick one-offs |
| Styled Components | Scoped | Yes | Yes | Design systems |
| Tailwind CSS | Utility | Yes | Yes | Rapid UI |

### CSS Modules (Recommended Default)

```jsx
// Button.module.css
.primary { background: blue; color: white; }
.active  { border: 2px solid green; }

// Button.jsx
import styles from './Button.module.css';

function Button({ isActive }) {
  return (
    <button className={`${styles.primary} ${isActive ? styles.active : ''}`}>
      Click
    </button>
  );
}
```

Generates unique class names at build time — no global collision.

### Conditional Classes with `clsx`

```jsx
import clsx from 'clsx';

<button className={clsx(
  styles.button,
  isActive && styles.active,
  isDisabled && styles.disabled
)}>
  Submit
</button>
```

### Styled Components (CSS-in-JS)

```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
  padding: 10px 20px;

  &:hover { opacity: 0.9; }
  @media (max-width: 600px) { padding: 6px 12px; }
`;

<Button primary>Submit</Button>
```

### Inline Styles — Use Sparingly

```jsx
<div style={{ backgroundColor: 'blue', fontSize: '16px' }}>
  Inline styled
</div>
```

No pseudo-selectors (`:hover`, `:focus`). No media queries. Only for truly dynamic, one-off values.

### Key Pitfalls

- Inline styles can't do `:hover` or media queries.
- Plain CSS classes leak globally — use Modules or CSS-in-JS for isolation.
- Don't put all styles in one file — colocate component styles with the component.

---

## Part 7 — Testing in React

### Test Types

| Type | What It Tests | Tools |
|---|---|---|
| Unit | Single function or component in isolation | Jest, Vitest |
| Integration | Multiple components working together | React Testing Library |
| E2E | Full user flows in real browser | Cypress, Playwright |

### React Testing Library (RTL) — Core Philosophy

Test behavior, not implementation. Query the DOM as a user would.

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments count on button click', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

### Query Priority (Use in This Order)

| Query | Use When |
|---|---|
| `getByRole` | Accessible role (button, heading, input) — **prefer** |
| `getByLabelText` | Form labels |
| `getByPlaceholderText` | Input placeholders |
| `getByText` | Visible text content |
| `getByTestId` | Last resort — brittle |

### Async Queries

```jsx
// findBy — returns a Promise, use with await
const element = await screen.findByText(/loaded data/i);

// waitFor — waits until assertion passes
await waitFor(() => expect(screen.getByText(/done/i)).toBeInTheDocument());
```

### Mocking Fetch

```jsx
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, title: 'Mock Post' }]),
    })
  );
});

afterEach(() => jest.resetAllMocks());
```

### Snapshot Testing

```jsx
test('matches snapshot', () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});
```

Use sparingly. Snapshots fail on any UI change — they're noisy and developers tend to blindly update them.

### Jest Basics

```js
describe('sum function', () => {
  test('adds two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('returns 0 for empty input', () => {
    expect(sum(0, 0)).toBe(0);
  });
});
```

Common matchers: `toBe`, `toEqual`, `toBeInTheDocument`, `toHaveBeenCalled`, `toThrow`.

### Key Pitfalls

- Testing internal state or implementation details — tests break on refactor.
- Using `getByTestId` everywhere — ties tests to markup, not behavior.
- Not cleaning up mocks between tests — test pollution.
- Shallow rendering — doesn't test component integration.

---

## Part 8 — Performance, Patterns, and Interview Scenarios

### Virtual DOM and Reconciliation

React builds a virtual DOM tree. On state change, it diffs the new tree against the old one and applies **only the changed nodes** to the real DOM. Keys help React match list items across renders.

### Immutability Is Required

React uses **referential equality** to detect changes. Mutating an object/array directly won't trigger a re-render.

```jsx
// ❌ Mutation — React won't re-render
state.items.push(newItem);

// ✅ New reference — React detects change
setItems(prev => [...prev, newItem]);
setUser(prev => ({ ...prev, name: 'Nishanth' }));
```

### Performance Optimization

```jsx
// React.memo — skip re-render if props didn't change
const MemoizedList = React.memo(function List({ items }) {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
});

// useCallback — stable function reference for memoized children
const handleClick = useCallback(() => doSomething(id), [id]);

// useMemo — expensive computation
const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);

// Code splitting — lazy load heavy components
const Chart = React.lazy(() => import('./Chart'));
// Wrap in Suspense:
<Suspense fallback={<p>Loading chart...</p>}>
  <Chart />
</Suspense>
```

### Props vs State vs Context

| Concept | Owned By | Mutable | Purpose |
|---|---|---|---|
| Props | Parent | No | Pass data down |
| State | Component | Yes | Internal changing data |
| Context | Provider | Yes | Avoid prop drilling for global data |

```jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext); // no prop threading
  return <h1 className={theme}>Title</h1>;
}
```

Context is not a state management solution — it's a dependency injection mechanism. Every consumer re-renders when context value changes.

### Error Boundaries

Catch rendering errors in child trees. **Must be class components** — no hook equivalent yet.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>
```

### `React.StrictMode`

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

In development only: double-invokes render, `useState` initializer, and `useReducer` to surface side effects and unsafe patterns. No effect in production.

### Common Interview Questions

**What is the Virtual DOM?**
An in-memory JS object representation of the real DOM. React diffs old vs new virtual DOM on each render and applies minimal real DOM updates.

**What triggers a re-render?**
State change, prop change, or parent re-render (even if props didn't change — unless wrapped in `React.memo`).

**`useEffect` cleanup — when does it run?**
Before the next effect execution, and on component unmount.

**Why can't you call hooks conditionally?**
React relies on hook call order to associate state with the right hook. Conditional calls break this ordering.

**`useState` vs `useReducer` — when to switch?**
`useReducer` when state transitions are complex, interdependent, or numerous enough that multiple `useState` setters become hard to reason about.

**What is prop drilling?**
Passing props through intermediate components that don't use them. Fix with Context or state management (Zustand, Redux).

**What is a controlled component?**
An input whose value is controlled by React state — not the DOM.

**How does `React.memo` differ from `useMemo`?**
`React.memo` memoizes a **component** (skips re-render if props unchanged). `useMemo` memoizes a **computed value** inside a component.

---

## Quick Reference

### Hook Cheatsheet

| Hook | Purpose | Triggers Re-render |
|---|---|---|
| `useState` | Reactive state | Yes |
| `useReducer` | Complex state with actions | Yes |
| `useEffect` | Side effects after render | No |
| `useRef` | DOM access, mutable values | No |
| `useCallback` | Memoize function reference | No |
| `useMemo` | Memoize computed value | No |
| `useContext` | Read from nearest Provider | Yes (on context change) |

### When to Use What

| Situation | Solution |
|---|---|
| Share state across siblings | Lift state up |
| Avoid passing props 3+ levels deep | Context or state manager |
| Expensive list filter/sort | `useMemo` |
| Callback passed to `React.memo` child | `useCallback` |
| Async data fetching | `useEffect` + cancel flag |
| Complex async state | `useReducer` |
| DOM manipulation or timer ID | `useRef` |
| Debounce user input | Custom `useDebounce` hook |
| Lazy load heavy component | `React.lazy` + `Suspense` |
| Catch render errors | `ErrorBoundary` |