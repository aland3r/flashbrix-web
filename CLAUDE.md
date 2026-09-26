# CLAUDE.md — flashbrix-web

Rules Claude Code follows in this repository. See the README for full context.

## Project
- Front end for flashbrix.com: **Vite + React in JavaScript** (not TypeScript), linted with **Oxlint**.
- The API lives in `aland3r/flashbrix-api`. Do not add backend logic here.
- Deployed on **Vercel**: `main` = production; other branches = previews.
- Everything written in the repository (code, comments, docs, commits, PRs) is in English.
- Commits must use the personal GitHub identity (alanderavila@gmail.com), never a work account.

## Design sources of truth
- **Figma** — file `Y0KtoT4HYoGFEPflChy4Cj` (Flashbrix v1.0)
  - `Components` page (372:2360): **official only**.
  - `Drafts` page (499:1328): under discussion. **Never implement from here** unless the user explicitly asks for a wireframe/prototype.
  - `Pages` page (216:2): screens.
- **Notion** — Design System: `3e75fc724940802aa866fabec535639f`
  - Components: `3e75fc72494080f2a316fa6f59c9575b`
  - Pages: `3e75fc72494080bca1ffc5e6f0329eee`
  - Tokens: `5853ea4c4737473f9b46b94c91bdbfe3`
  - Flows: `17b95c0eac634cb89ef2e7002fdab803`
  - Templates: `53714b46f0cf4fc0891b9f49e290aaa2`

## Mandatory rules
1. **Only implement official components**: Stage `Designed` or `Implemented` in Notion **and** present on the Figma Components page. If either is missing, stop and tell the user.
2. **Identical names** in Notion, Figma and code. Components in PascalCase, props in camelCase, variant values in lowercase. Component props are the Figma variant properties.
3. **Do not invent variants, sizes or colors.** If the design needs something undocumented, ask.
4. **Tokens, not raw values.** Use the variables in `src/tokens`. Raw values only where no token exists yet, and list them in the PR.
5. **8px grid**: dimensions, spacing and heights in multiples of 8.
6. **Never commit or push to `main`.** Work on a branch (`design/<component>`, `page/<page>`, `wireframes/<flow>`) and open a PR.
7. **Brand assets** (isotype, wordmark) come from Figma as SVGs in `src/assets/brand/`. Never recreate logos in code.
8. **Do not edit `src/tokens` by hand**: they are generated from Figma by `/sync-design`.

## Structure
- Components: `src/components/<Name>/<Name>.jsx` + `<Name>.css` + `index.js`.
- Pages: `src/pages/<Name>/`, one per entry in the Notion Pages database.
- Tokens: `src/tokens/` (generated CSS variables).

## When implementing from a Figma link
1. Read the node with the Figma MCP (design context + screenshot).
2. Find the component in Notion by name and check its Stage.
3. Reuse existing components in `src/components`. Do not duplicate.
4. Implement with props matching the Figma variants.
5. Run `npm run lint` and `npm run build`.
6. Update Notion: Stage `Implemented`, code link in the `Code` field, and adjust the spec if Figma changed.

## Definition of done
- Lint and build pass.
- Visuals checked against the Figma screenshot on desktop and mobile.
- Notion updated.
- PR opened with: what changed, Figma and Notion links, open items (e.g. values without tokens).
