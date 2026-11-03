---
"jest-styled-components": patch
---

Fix a crash on load under Bun. Stable Bun releases through 1.4.4 expose `expect.addSnapshotSerializer` but throw "Not implemented" when it is called, so importing this package stopped every test. `toHaveStyleRule` now works on those releases, and snapshots keep hashed class names until Bun ships the API
