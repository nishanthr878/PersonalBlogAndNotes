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

## Table of contents

- Part 1: Fundamentals of React
- Part 2: Components and Props
- Part 3: State Management in React
- Part 4: React Hooks in Depth
- Part 5: Asynchronous Operations and Data Fetching
- Part 6: Styling in React
- Part 7: Testing in React
- Part 8: Common Interview Questions and Practical Scenarios

---

## The Road to React - Annotated Study Notes

Based on annotations from "The Road to React" by Robin Wieruch.

---

## Part 1 - Fundamentals of React

React is a JavaScript library for building user interfaces. It focuses on the view layer: how data is displayed and updated in response to user interactions.

### Key Concepts

- Declarative UI: describe what the UI should look like, not how to build it step by step.
- Component-based: break UIs into reusable, self-contained units.
- Unidirectional data flow: data flows parent -> child through props.
- Virtual DOM: React keeps a virtual representation of the DOM and updates only parts that change.

### Setting Up and Running a React App

Use Vite (or create-react-app) for fast setup.

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev       # runs the development server
npm run build     # creates the optimized production build
npm run preview   # tests the production build locally
```

Note: `npm run dev` is for local development; it is not optimized for production. Use `npm run preview` to test the production build.

### Hot Reloading vs Fast Refresh

React Fast Refresh bridges React with the development server, instantly updating the browser when files change.

### JSX (JavaScript XML)

JSX lets you write HTML inside JavaScript.

```jsx
const greeting = 'Hello React';
const element = <h1>{greeting}</h1>;
```

- Curly braces `{}` embed any JS expression inside JSX.
- JSX must have one parent element. Use `<div>` or `<React.Fragment>` to wrap siblings.
- JSX is transpiled (e.g., by Babel) into `React.createElement()` calls.

### JSX Attributes and Conventions

React replaces HTML attributes with camelCase equivalents:

| HTML Attribute | JSX Equivalent |
| --- | --- |
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |

Example:

```jsx
<label htmlFor="username">Username:</label>
<input id="username" className="form-input" onClick={handleClick} />
```

### Embedding Expressions

```jsx
const user = { name: 'Nishanth', role: 'Engineer' };
return <p>{user.name} is a {user.role}</p>;
```

You can also call functions:

```jsx
<p>{formatDate(new Date())}</p>
```

### Rendering Lists in React

Use `Array.map()`.

```jsx
const items = ['React', 'Redux', 'TypeScript'];

function List() {
  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}
```

#### Why Keys Matter

- Each item needs a unique `key` so React can track changes efficiently.
- Use stable identifiers (IDs), not indexes.

Bad:

```jsx
{items.map((item, index) => <li key={index}>{item}</li>)}
```

Good:

```jsx
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

### React DOM and the Root Element

`index.html`:

```html
<div id="root"></div>
```

`index.js`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

### Components and Hierarchies (Preview)

```jsx
function App() {
  return (
    <div>
      <Search />
      <List />
    </div>
  );
}
```

### Interview Checkpoints

1. What is JSX? JSX is a syntax extension that must be transpiled to JavaScript.
2. Is JSX mandatory? No; `React.createElement()` works too.
3. Why use keys in lists? Efficient reconciliation.
4. `class` vs `className`? JSX uses `className` because `class` is reserved in JS.

---

## Part 2 - Components and Props

React apps are built from components: small, isolated, reusable chunks of UI.

### Function Components

```jsx
function Welcome() {
  return <h1>Hello World</h1>;
}
```

Arrow function:

```jsx
const Welcome = () => <h1>Hello World</h1>;
```

### Component Tree and Hierarchy

```jsx
function App() {
  return (
    <div>
      <Search />
      <List />
    </div>
  );
}
```

### Props - Passing Data Parent -> Child

```jsx
function Greeting({ name }) {
  return <h2>Hello {name}</h2>;
}

function App() {
  return <Greeting name="Nishanth" />;
}
```

Props are immutable.

### One-Way Data Flow

If a child needs to affect parent state, pass a callback down.

```jsx
function Child({ onClick }) {
  return <button onClick={onClick}>Click Me</button>;
}

function Parent() {
  const handleClick = () => alert('Clicked!');
  return <Child onClick={handleClick} />;
}
```

### Do Not Mutate Props

```jsx
function Profile(props) {
  props.name = 'Changed';  // do not do this
  return <p>{props.name}</p>;
}
```

### Destructuring Props

```jsx
function Item({ title, url, author }) {
  return (
    <a href={url}>
      {title} - {author}
    </a>
  );
}
```

Nested destructuring:

```jsx
function Item({ item: { title, url, author } }) {
  return <a href={url}>{title} - {author}</a>;
}
```

### Spread and Rest Operators with Props

Spread:

```jsx
const user = { name: 'Nishanth', role: 'Engineer' };
<UserCard {...user} />;
```

Rest:

```jsx
function Card({ title, ...rest }) {
  return <div {...rest}>{title}</div>;
}
```

### Prop-Type Validation (vs TypeScript)

```bash
npm install prop-types
```

```jsx
import PropTypes from 'prop-types';

function Button({ label }) {
  return <button>{label}</button>;
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
};
```

### Callback Handlers Across Components

```jsx
function Search({ onSearch }) {
  return <input onChange={(e) => onSearch(e.target.value)} />;
}

function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <Search onSearch={setQuery} />
      <p>Searching for: {query}</p>
    </>
  );
}
```

### Interview Checkpoints

1. What are props used for? Parent -> child data transfer.
2. Can props be mutated? No.
3. How does child -> parent communication work? Callback props.
4. Props vs state? Props are external inputs; state is internal mutable data.

---

## Part 3 - State Management in React

State is data that changes over time and triggers re-renders.

### `useState`

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount(count + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}
```

### React State Rules

- Call hooks only at the top level.
- State updates are batched/asynchronous.
- Never mutate state directly.

### Lifting State Up

```jsx
function Search({ query, onSearch }) {
  return <input value={query} onChange={e => onSearch(e.target.value)} />;
}

function List({ query, items }) {
  return (
    <ul>
      {items.filter(item => item.includes(query)).map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const items = ['React', 'Redux', 'Hooks'];

  return (
    <>
      <Search query={query} onSearch={setQuery} />
      <List query={query} items={items} />
    </>
  );
}
```

### Controlled Components

```jsx
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
```

### Uncontrolled Components

```jsx
function UncontrolledForm() {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="text" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### `useReducer`

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
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

### Interview Checkpoints

1. Props vs state? Props in, state inside.
2. Why lift state up? Share state across siblings.
3. When useReducer? Complex transitions/interdependent state.
4. Controlled component? Input controlled by React state.

---

## Part 4 - React Hooks in Depth

Hooks let you use React features without class components.

### Hook Rules

1. Call hooks only at the top level.
2. Call hooks only in React function components or custom hooks.

### `useEffect`

```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Clicked ${count} times`;
  }, [count]);
}
```

Cleanup:

```jsx
useEffect(() => {
  const timer = setInterval(() => console.log('Tick'), 1000);
  return () => clearInterval(timer);
}, []);
```

### Fetching Data with `useEffect`

```jsx
function DataFetcher() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/posts');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <ul>{data.map(item => <li key={item.id}>{item.title}</li>)}</ul>;
}
```

### `useRef`

```jsx
function Timer() {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current++;
    console.log(countRef.current);
  };

  return <button onClick={handleClick}>Count (check console)</button>;
}
```

DOM ref:

```jsx
function FocusInput() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Auto-focused input" />;
}
```

### `useCallback`

```jsx
const handleSearch = useCallback((query) => {
  console.log('Searching:', query);
}, []);
```

### `useMemo`

```jsx
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

### Custom Hooks

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    loadData();
  }, [url]);

  return { data, loading };
}
```

### Interview Checkpoints

1. useEffect vs useLayoutEffect? useEffect after paint; useLayoutEffect before paint.
2. Why not async useEffect? It expects cleanup or void, not a Promise.
3. useCallback vs useMemo? Function vs computed value.
4. useRef vs useState? Ref persists without re-render.

---

## Part 5 - Asynchronous Operations and Data Fetching

### Fetch API Basics

```jsx
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Async/Await

```jsx
async function getData() {
  try {
    const response = await fetch('https://api.example.com/posts');
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
```

### Async Calls in Components

```jsx
function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {posts.slice(0, 5).map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### useReducer for Async State (Pattern)

```jsx
function dataReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, data: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
}
```

Cancel flag cleanup:

```jsx
useEffect(() => {
  let cancel = false;

  const fetchData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    if (!cancel) setData(data);
  };

  fetchData();
  return () => (cancel = true);
}, [url]);
```

Parallel calls:

```jsx
const [users, posts] = await Promise.all([
  fetch('/users').then(r => r.json()),
  fetch('/posts').then(r => r.json()),
]);
```

### Interview Checkpoints

1. Why not async useEffect? Cleanup contract.
2. Common async states? loading/error/data.
3. useReducer vs multiple useState? Shared transitions.
4. Why cleanup? Avoid setting state after unmount.

---

## Part 6 - Styling in React

### Inline Styles

```jsx
function Button() {
  return (
    <button style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px' }}>
      Click Me
    </button>
  );
}
```

### CSS Stylesheets

```jsx
import './Button.css';

function Button() {
  return <button className="btn-primary">Click Me</button>;
}
```

### CSS Modules

```jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.primary}>Click Me</button>;
}
```

### Conditional Styling

```jsx
<button className={isActive ? styles.active : styles.inactive}>
  {isActive ? 'Active' : 'Inactive'}
</button>
```

Using `clsx`:

```bash
npm install clsx
```

```jsx
import clsx from 'clsx';

<button className={clsx(styles.button, isActive && styles.active)}>
  Click
</button>
```

### Styled Components (CSS-in-JS)

```bash
npm install styled-components
```

```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => (props.primary ? 'blue' : 'gray')};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;

  &:hover {
    opacity: 0.9;
  }
`;

function App() {
  return <Button primary>Submit</Button>;
}
```

### Interview Checkpoints

1. CSS Modules vs Styled Components? Scoped files vs CSS-in-JS with dynamic props.
2. Why CSS Modules? Avoid global class collisions.
3. Conditional styles? Ternary/AND/clsx.
4. Inline styles drawbacks? No pseudo selectors/media queries.

---

## Part 7 - Testing in React

### Types of Tests

| Type | Purpose |
| --- | --- |
| Unit | test a single function/component |
| Integration | test multiple components together |
| E2E | full user flows in a real browser |

### Jest

```bash
npm install --save-dev jest
```

```js
function sum(a, b) {
  return a + b;
}

test('adds two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
```

### React Testing Library

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

### Mocking Fetch

```jsx
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ id: 1, title: 'Mock Post' }]),
  })
);
```

### Snapshot Testing

```jsx
import { render } from '@testing-library/react';
import App from './App';

test('matches snapshot', () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});
```

### Coverage

```bash
npm test -- --coverage
```

### Interview Checkpoints

1. Why RTL over shallow tests? Test behavior over implementation.
2. When use waitFor/findBy? Async UI updates.
3. Why avoid internal state tests? Fragile and implementation-coupled.
4. Jest vs RTL? Runner/assertions vs UI interaction utilities.

---

## Part 8 - Common Interview Questions and Practical Scenarios

### Virtual DOM

React uses a Virtual DOM to batch and minimize expensive DOM operations.

### Reconciliation

React diffs previous vs next trees; keys help list diffing.

### Immutability

React relies on referential equality; avoid mutation.

Bad:

```jsx
state.items.push(newItem);
```

Good:

```jsx
setItems([...state.items, newItem]);
```

### Performance Optimization

- `React.memo` for components
- `useCallback` for function identity
- `useMemo` for expensive computed values
- code splitting via `React.lazy`

```jsx
const Chart = React.lazy(() => import('./Chart'));
```

### Props vs State vs Context

| Concept | Owned By | Mutable | Purpose |
| --- | --- | --- | --- |
| Props | parent | no | inputs |
| State | component | yes | internal data |
| Context | app | yes | shared global-ish data |

```jsx
const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  return <h1 className={theme}>Dark Mode</h1>;
}
```

### Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) return <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}
```

### Debounce Search (Practical)

```jsx
import { useState, useEffect } from 'react';

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
  const debounced = useDebounce(query, 500);

  useEffect(() => {
    if (debounced) fetch(`/api/search?q=${debounced}`);
  }, [debounced]);

  return <input onChange={e => setQuery(e.target.value)} />;
}
```

### Rapid-Fire

- `React.StrictMode` double-invokes some functions in dev to surface unsafe patterns.
- Array index keys break reordering logic.
- Custom hooks share logic.
- setState in render causes infinite loops.

### Mental Model

UI = f(state). State changes -> re-render -> diff -> minimal DOM updates.
