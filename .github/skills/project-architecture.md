# SonicMarathon — Project Architecture

## Technology Stack

- **Frontend Framework**: [Svelte](https://svelte.dev/) (SvelteKit for web builds)
- **Desktop Runtime** (when applicable): [Tauri v2](https://v2.tauri.app/) — wraps the Svelte frontend as a native application
- **Language**: TypeScript (strict mode)

## Development Paradigms

| Paradigm | Description |
|----------|-------------|
| **TDD** (Test-Driven Development) | Write a failing test first, then implement the minimum code to make it pass, then refactor |
| **DDD** (Domain-Driven Design) | Model the core domain explicitly; keep domain logic free from infrastructure / UI concerns |
| **Functional-Based** | Favour pure functions, immutable data structures, and function composition over mutable objects and inheritance |
| **Reactive** | Express state changes as data flows (Svelte stores, derived stores, event streams) rather than imperative mutations |

## Project Layout (convention)

```
src/
  domain/          # Pure domain models, types, and business logic (no framework dependencies)
  application/     # Use-cases / command handlers that orchestrate domain logic
  infrastructure/  # External integrations (APIs, persistence, Tauri commands)
  ui/              # Svelte components and page routes
    components/
    routes/
  lib/             # Shared pure utilities
tests/
  unit/            # Fast, isolated unit tests (domain + application)
  integration/     # Integration tests (infrastructure + application)
  e2e/             # End-to-end tests (UI flows)
```

## Key Conventions

- **Domain objects are plain TypeScript types / discriminated unions** — no class instances with mutable fields.
- **Side effects are pushed to the edges** — domain functions are pure; Tauri commands and fetch calls live in `infrastructure/`.
- **Svelte stores are derived where possible** — avoid manual `store.set()` / `store.update()` calls when a `derived()` store can express the same relationship.
- **All async work uses `async/await`** — no raw Promise chains or callback APIs unless wrapping a third-party library.
- **Tests run without a browser** — Svelte component logic is extracted into plain TypeScript functions that are unit-tested independently.
