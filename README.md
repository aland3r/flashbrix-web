# Flashbrix web

Front end for [flashbrix.com](https://flashbrix.com).

- **Stack:** Vite + React (JavaScript), linted with Oxlint.
- **API:** lives in a separate repository, [`aland3r/flashbrix-api`](https://github.com/aland3r/flashbrix-api).
- **Deploy:** Vercel. The `main` branch is **production**; every other branch gets a **preview URL**.

## Running locally

```bash
npm install
cp .env.example .env   # fill in the variables
npm run dev
```

---

## Design system

Flashbrix design lives in three places, each with a fixed role.

### Sources of truth

| Where | What it holds |
|---|---|
| **Figma**: [Flashbrix v1.0](https://www.figma.com/design/Y0KtoT4HYoGFEPflChy4Cj/Flashbrix-v1.0) | The **design**. **Components** page = official. **Drafts** page = under discussion, explorations (Labs) and replaced items. **Pages** page = screens. |
| **Notion**: [Flashbrix — Living Documentation / Design System](https://app.notion.com/p/3e75fc724940802aa866fabec535639f) | The **documentation**: variants, usage rules, specs, status and links. |
| **This repository** | The **implementation**. Only official items get implemented. |

### Role of each tool

| Tool | Use |
|---|---|
| **Figma** | The only place where components and screens are created or edited. |
| **Claude Code** (in this repository) | The day-to-day engine: reads Figma, implements, updates Notion and opens PRs. This is where `/sync-design` runs. |
| **Claude (chat)** | System decisions: naming, structure, conventions, planning. |
| **Claude Design** | Optional, only for exploring ideas before drawing them in Drafts. Not part of the official flow. |

> Editing in Figma **does not propagate on its own**. Propagation happens through a single trigger: the `/sync-design` command (see below).

### Official flow (fixed for any new element)

1. **Request**: a need comes up for a component, token, template or page.
2. **Draft**: it is designed or explored on the Figma **Drafts** page.
3. **Decision**: name, variants, sizes and usage rules are defined.
4. **Officialization**: happens once both are done:
   - documented in the Notion **Components** database with Stage `Designed` and the Figma link;
   - moved to the Figma **Components** page.
5. **Implementation**: through `/sync-design`, on a branch, with a PR and a preview.
6. **Release**: merge into `main` after reviewing the preview. The Notion Stage becomes `Implemented`.

If something exists in Figma but is not documented in Notion, it is **not official** and must not be implemented.

### Daily loop

1. Edit or create in **Figma**. New things go to Drafts; tweaks to official items can be made directly in Components.
2. Select the element and copy its link. In Figma: **MCP** panel › *Copy example prompt*, or right-click › *Copy link to selection*.
3. In Claude Code, inside this repository:
   ```
   /sync-design <Figma link>
   ```
4. Claude Code:
   - reads the design through the Figma MCP;
   - compares it with the code and updates components and tokens;
   - updates the matching Notion entry (variants, spec, links, Stage);
   - runs lint and build;
   - creates a branch, commits, pushes and opens a PR with a summary.
5. Open the Vercel **preview URL** from the PR and review it.
6. Merge into `main` to ship to production.

### Notion structure

| Database | Content |
|---|---|
| **Tokens** | Design values. `Layer`: Primitive → Semantic → Component. |
| **Components** | Assets and components. `Level`: Asset · Primitive · Composite · Pattern. `Composed of` records composition (e.g. Header → Logo → Isotype + Wordmark). |
| **Templates** | Page skeletons. |
| **Pages** | Actual screens, with states, breakpoints and the components they use. |
| **Flows** | Journeys that order the pages. |

Component stages: `Candidate` → `Defined` → `Designed` → `Implemented` (or `Deprecated`).
Page stages: `Idea` → `Wireframe` → `Hi-fi` → `Approved` → `Implemented`.

### Conventions

- **Components:** PascalCase, identical in Notion, Figma and code (`LanguageLabel`, `Header`).
- **Variant properties / props:** camelCase (`language`, `size`, `scroll`).
- **Variant values:** lowercase (`lg`, `md`, `sm`, `desktop`, `top`).
- **Tokens:** dot notation (`color.text.primary`, `space.inset.md`); in CSS they become variables (`--color-text-primary`).
- **Inner Figma layers:** lowercase and descriptive (`flag`, `label`, `logo`).
- **Dimensions:** always multiples of 8.
- **Variants describe the element** (size, state, composition), never where it appears. Context-specific usage lives in the Notion usage rules.

### Folder structure

```
src/
  components/
    LanguageLabel/
      LanguageLabel.jsx
      LanguageLabel.css
      index.js
  tokens/          # generated from Figma (do not edit by hand)
  pages/           # one folder per Notion page (Landing, Search, VocabularyDetail…)
  assets/brand/    # official SVGs (isotype, wordmark)
```

---

## Branches and deploy

- **Never** commit directly to `main`. It publishes to flashbrix.com.
- One branch per change: `design/<component>`, `page/<page>`, `wireframes/<flow>`.
- Every push to a branch creates a Vercel preview. Review it there before merging.

---

## Setting up Claude Code (once)

1. Install Claude Code and open this repository.
2. Connect **Figma** and **Notion** as MCP servers, for example:
   ```bash
   claude mcp add --transport http figma https://mcp.figma.com/mcp
   claude mcp add --transport http notion https://mcp.notion.com/mcp
   ```
   Then run `/mcp` in Claude Code to authenticate each one.
3. The rules Claude Code follows live in [`CLAUDE.md`](./CLAUDE.md). The `/sync-design` command lives in `.claude/skills/sync-design/`.

---

## Roadmap

- [ ] **Phase 0: foundation.** README, CLAUDE.md, `/sync-design` and MCPs set up.
- [ ] **Phase 1: wireframes.** Landing → Search → Detail flow in low fidelity, working on a preview.
- [ ] **Phase 2: tokens.** Figma Variables + Notion Tokens database + `src/tokens`.
- [ ] **Phase 3: components.** One by one, in flow order, through the official cycle.
- [ ] **Phase 4: high-fidelity pages.** Replace wireframes with hi-fi.
- [ ] **Phase 5: production.** Merge into `main` with a checklist (visual, mobile, accessibility).
- [ ] **Phase 6: continuous loop.** Figma → `/sync-design` → PR → preview → production.