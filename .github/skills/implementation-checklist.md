# SonicMarathon — Implementation & Review Checklist

Use this checklist when **implementing** a feature or **reviewing** a pull request.  
Every item maps to one of the project's [sixteen coding principles](./coding-principles.md).

---

## Implementation Checklist

### Before You Write Code
- [ ] Is there a failing test that describes the desired behaviour? (TDD — red phase)
- [ ] Is the domain model expressed as pure TypeScript types / discriminated unions, free from UI or infrastructure concerns? (DDD)

### While Writing Code
- [ ] **[P1]** Have you removed all comments that merely restate the code?
- [ ] **[P2]** Have you replaced any section comments with named functions?
- [ ] **[P3]** Have you avoided unnecessary wrapper objects or stores around plain values?
- [ ] **[P4]** Have you named every magic number and string constant?
- [ ] **[P5]** Have you moved all constant declarations to module scope (outside functions)?
- [ ] **[P6]** Have you wrapped code owned by paired begin/end-style calls in a `{ }` block so the scope is visually explicit?
- [ ] **[P7]** Have you added braces to every `if`/`else`/`for`/`while` block?
- [ ] **[P8]** Have you replaced imperative loops with declarative collection operations (`map`, `filter`, `reduce`, …)?
- [ ] **[P9]** Have you used `const` everywhere and allowed TypeScript to infer types?
- [ ] **[P10]** Have you added early returns for all edge cases and guard clauses?
- [ ] **[P11]** Have you replaced multi-branch `if/else` chains with lookup tables or expressions?
- [ ] **[P12]** Have you modelled variant state as exhaustive discriminated unions?
- [ ] **[P13]** Have you used `derived` stores instead of manually synchronising two writables?
- [ ] **[P14]** Have you used `async/await` for all async work and avoided blocking calls?
- [ ] **[P15]** Have you kept state immutable and given each state value a single clear owner?
- [ ] **[P16]** Have you used the type system to make invalid states unrepresentable?

### After Writing Code
- [ ] Does the implementation pass all tests (green phase)?
- [ ] Have you refactored while keeping tests green (refactor phase)?
- [ ] Does the new code stay within its correct architectural layer (domain / application / infrastructure / ui)?

---

## Code Review Checklist

Run through the same sixteen points as above, plus:

- [ ] Does the PR introduce no new magic numbers or strings?
- [ ] Is all new async code using `async/await` (not `.then()` chains)?
- [ ] Are all new Svelte stores either primitive writables or `derived` from other stores?
- [ ] Do new discriminated unions handle every variant in every `switch`/conditional?
- [ ] Does the PR include tests that would have caught the bug / verified the feature before the code was written?
- [ ] Is state mutated anywhere it should not be (e.g., pushing to an array instead of spreading)?
- [ ] Are Tauri `invoke` calls placed in `infrastructure/`, not in UI components or domain functions?
