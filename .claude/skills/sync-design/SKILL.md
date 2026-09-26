---
name: sync-design
description: Syncs a Figma element (link) with the Flashbrix design system code and Notion, then commits and pushes to `dev`. Use when the user pastes a Figma link to implement or update a component, token or page.
---

# /sync-design

Input: a node link from the Flashbrix v1.0 Figma file ($ARGUMENTS).

Follow `CLAUDE.md` in every step.

## 1. Understand the selection
- Read the node with the Figma MCP (design context + screenshot).
- Classify it: **component**, **token/style** or **page**.
- Check which Figma page the node is on:
  - `Components` → official, continue.
  - `Drafts` → **stop** and ask whether the user wants to officialize it first (document in Notion + move to Components) or whether it is only a wireframe/prototype.

## 2. Check Notion
- Find the entry by exact name in the matching database (Components, Tokens or Pages).
- If it does not exist or its Stage is `Candidate`/`Defined`, stop and tell the user.
- Note the documented variants, usage rules and spec.

## 3. Compare and plan
- Compare Figma × Notion × current code.
- Tell the user, in a few lines, what will change (files, props, tokens) **before** editing.

## 4. Implement
- Work on the `dev` branch (switch to it if needed). Do not create other branches.
- Components: `src/components/<Name>/` with props = Figma variants.
- Tokens: update `src/tokens/` from the Figma Variables/Styles.
- Pages: `src/pages/<Name>/` using official components only.
- Run `npm run lint` and `npm run build` and fix any failures.

## 5. Update Notion
- Stage → `Implemented` (components) or the correct page stage.
- `Code` field → file path on GitHub.
- If Figma changed something (size, variant, color), update the entry's spec.

## 6. Deliver
- Commit on `dev` with a clear message (`feat(LanguageLabel): ...`) and push `dev`.
- Reply to the user with the Vercel **preview URL** of `dev`, a summary, Figma and Notion links, and open items (e.g. values without tokens).
- Never merge into `main` on your own.
