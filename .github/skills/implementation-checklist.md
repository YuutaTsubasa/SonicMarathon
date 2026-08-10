# SonicMarathon — Implementation & Review Checklist

Use this checklist when **implementing** a feature or **reviewing** a pull request.  
The authoritative definitions for P1–P16 live in [coding-principles.md](./coding-principles.md). This checklist intentionally references those principles instead of redefining the complete list.

---

## Implementation Checklist

### Before You Write Code
- [ ] Is there a failing test that describes the desired behaviour? (TDD — red phase)
- [ ] Is the domain model expressed as pure TypeScript types / discriminated unions, free from UI or infrastructure concerns? (DDD)

### While Writing Code
- [ ] Have you reviewed the implementation against [P1–P16](./coding-principles.md)?
- [ ] For **P6**, are shared constants and protocol definitions extracted instead of duplicated across modules?
- [ ] For **P7**, are paired begin/end-style API scopes visually delimited where applicable?
- [ ] For **P16**, are invariants enforced at type boundaries so invalid states cannot be represented?

### After Writing Code
- [ ] Does the implementation pass all tests (green phase)?
- [ ] Have you refactored while keeping tests green (refactor phase)?
- [ ] Does the new code stay within its correct architectural layer (domain / application / infrastructure / ui)?

---

## Code Review Checklist

Review the change against the authoritative [sixteen coding principles](./coding-principles.md), plus:

- [ ] Does the PR introduce no new magic numbers or strings?
- [ ] Is all new async code using `async/await` (not `.then()` chains)?
- [ ] Are all new Svelte stores either primitive writables or `derived` from other stores?
- [ ] Do new discriminated unions handle every variant in every `switch`/conditional?
- [ ] Does the PR include tests that would have caught the bug / verified the feature before the code was written?
- [ ] Is state mutated anywhere it should not be (e.g., pushing to an array instead of spreading)?
- [ ] Are Tauri `invoke` calls placed in `infrastructure/`, not in UI components or domain functions?
