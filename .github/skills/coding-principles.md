# SonicMarathon — Coding Principles

Every implementation and code review **must** verify compliance with the following sixteen principles.

---

## 1. Avoid Meaningless or Redundant Comments

Delete comments that merely restate what the code already says clearly.

```ts
// ❌ Adds no information
// increment counter
counter++;

// ✅ No comment needed — self-evident
counter++;
```

---

## 2. Extract Named Functions Instead of Comments

When you feel the urge to write a section comment, extract that section into a named function instead.

```ts
// ❌
// validate and save user
if (user.name && user.email) { db.save(user); }

// ✅
function validateAndSaveUser(user: User): void {
  if (isValidUser(user)) db.save(user);
}
```

---

## 3. Avoid Redundant State and Property Wrappers

Do not wrap a value in an object or store when a plain value (or derived store) suffices.

```ts
// ❌
const state = { count: writable(0) };

// ✅
const count = writable(0);
```

---

## 4. Avoid Magic Numbers and Strings

Give every literal constant a named symbol.

```ts
// ❌
if (score > 9999) { ... }

// ✅
const MAX_SCORE = 9999;
if (score > MAX_SCORE) { ... }
```

---

## 5. Move Constants Out of Functions

Constants that do not depend on function arguments belong at module scope, not inside the function body.

```ts
// ❌
function greet(name: string): string {
  const GREETING_PREFIX = "Hello, ";
  return GREETING_PREFIX + name;
}

// ✅
const GREETING_PREFIX = "Hello, ";
function greet(name: string): string {
  return GREETING_PREFIX + name;
}
```

---

## 6. Visually Delimit Begin/End Scopes

When calling paired scope-delimiting functions (e.g. `beginGroup()`/`endGroup()`, `pushMatrix()`/`popMatrix()`, `startBatch()`/`commitBatch()`), wrap the body in a block `{ }` so the scope boundary is immediately visible.

```ts
// ❌ — begin/end boundary is invisible
renderer.beginGroup();
renderer.draw(a);
renderer.draw(b);
renderer.endGroup();

// ✅ — the braces make the owned scope explicit
renderer.beginGroup();
{
  renderer.draw(a);
  renderer.draw(b);
}
renderer.endGroup();
```

---

## 7. Use Braces to Clarify Scope

Always use braces for control-flow blocks, even one-liners.

```ts
// ❌
if (condition) doSomething();

// ✅
if (condition) {
  doSomething();
}
```

---

## 8. Prefer Declarative Collection Operations Over Imperative Loops

Use `map`, `filter`, `reduce`, `flatMap`, `find`, etc. instead of `for`/`while` loops when transforming collections.

```ts
// ❌
const results: string[] = [];
for (const item of items) {
  if (item.active) results.push(item.name);
}

// ✅
const results = items
  .filter(item => item.active)
  .map(item => item.name);
```

---

## 9. Prefer `const` and Type Inference

Use `const` by default; use `let` only when reassignment is genuinely needed. Let TypeScript infer types from context.

```ts
// ❌
let name: string = "Alice";

// ✅
const name = "Alice";
```

---

## 10. Prefer Early Returns and Guard Clauses

Handle error / edge cases at the top of a function and return immediately, keeping the happy-path un-indented.

```ts
// ❌
function process(input: Input | null): Result {
  if (input !== null) {
    if (input.isValid) {
      return compute(input);
    }
  }
  return defaultResult;
}

// ✅
function process(input: Input | null): Result {
  if (input === null) { return defaultResult; }
  if (!input.isValid) { return defaultResult; }
  return compute(input);
}
```

---

## 11. Prefer Expressions and Lookup Tables Over Statement-Heavy Branching

Replace long `if/else if` chains with object maps, `switch` expressions, or ternary expressions.

```ts
// ❌
let label: string;
if (status === "ok") { label = "Success"; }
else if (status === "err") { label = "Error"; }
else { label = "Unknown"; }

// ✅
const STATUS_LABEL: Record<string, string> = {
  ok: "Success",
  err: "Error",
};
const label = STATUS_LABEL[status] ?? "Unknown";
```

---

## 12. Prefer Exhaustive Discriminated Unions and Pattern Matching

Model state as a discriminated union and handle every variant explicitly.

```ts
// ✅
type LoadState<T> =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: T }
  | { kind: "failure"; error: string };

function render<T>(state: LoadState<T>): string {
  switch (state.kind) {
    case "idle":    return "Idle";
    case "loading": return "Loading…";
    case "success": return `Data: ${state.data}`;
    case "failure": return `Error: ${state.error}`;
  }
}
```

To enforce exhaustiveness, add an explicit check (e.g., a `default` branch that assigns to `never` or calls an `assertNever` helper) so a newly added variant cannot compile unless it is handled.

---

## 13. Prefer Derived State and Events Over Manual State Synchronization

Express dependent state as derived stores / computed values rather than synchronising two writable stores manually.

```ts
// ❌ — manual sync
const items = writable<Item[]>([]);
const count = writable(0);
items.subscribe(v => count.set(v.length));

// ✅ — derived
const items = writable<Item[]>([]);
const count = derived(items, $items => $items.length);
```

---

## 14. Prefer Native `async/await` and Non-Blocking Commands

Use `async/await` for all asynchronous operations. Avoid blocking the event loop; use Tauri's non-blocking `invoke` for IPC.

```ts
// ❌
fetch(url).then(r => r.json()).then(data => { ... });

// ✅
const response = await fetch(url);
const data = await response.json();
```

---

## 15. Prefer Explicit State Models, Immutability, and Ownership

- Represent every meaningful application state as an explicit type.
- Treat all state as immutable — produce new values instead of mutating existing ones.
- Each piece of state has one clear owner; other parts of the system receive it as read-only input.

```ts
// ❌ — mutating in place
function addItem(cart: Cart, item: Item): void {
  cart.items.push(item);
}

// ✅ — return new value
function addItem(cart: Cart, item: Item): Cart {
  return { ...cart, items: [...cart.items, item] };
}
```

---

## 16. Make Invalid States Unrepresentable

Enforce invariants at type boundaries so that impossible combinations cannot be constructed.

```ts
// ❌ — both fields optional allows an invalid "neither" state
type Result = { data?: string; error?: string };

// ✅ — exactly one of the variants is possible at any time
type Result =
  | { kind: "success"; data: string }
  | { kind: "failure"; error: string };
```

Use the type system to make illegal states a compile-time error rather than a runtime guard.
