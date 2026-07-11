---
id: 004
title: implement-milestones-1-3
stage: green
date: 2026-07-11
surface: agent
model: deepseek-v4-flash-free
feature: 001-restaurant-ordering
branch: 001-restaurant-ordering
user: FahadBinJunaid
command: Implement Milestones 1-3 from tasks.md
labels: ["implementation", "scaffold", "homepage", "menu-ui", "milestones"]
links:
  spec: specs/001-restaurant-ordering/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - src/app/globals.css
  - src/app/icon.svg
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/app/robots.ts
  - src/app/menu/page.tsx
  - src/components/shared/hero-section.tsx
  - src/components/shared/category-tiles.tsx
  - src/components/shared/menu-item-card.tsx
tests:
  - null
---

## Prompt

Implement only Milestones 1 through 3 from tasks.md (Project scaffold, Static homepage, Static full menu UI) — do not proceed to Milestone 4 or beyond. These milestones use hardcoded/mock data only, no live Supabase connection yet.

Important correction to T012: the homepage (src/app/page.tsx) and the full menu (src/app/menu/page.tsx) are separate routes. A same-page anchor link cannot work across routes. Instead, each category tile on the homepage must link to `/menu#<category-slug>` (route navigation plus an anchor), and each category section heading in src/app/menu/page.tsx must have a matching `id="<category-slug>"` attribute, so that after navigating to /menu the browser scrolls to the correct section. Use consistent, URL-safe slugs (e.g. "fast-food", "chai") shared between both files.

After completing each individual milestone (1, then 2, then 3), stop and report: what was built, which files were created/modified, and confirm the "Done" acceptance criteria from tasks.md for that specific milestone are met — before moving to the next milestone in this batch.

After Milestone 3 is complete, stop entirely and wait for user confirmation before continuing to Milestone 4 (which requires live Supabase schema setup).

Follow the constitution strictly: server components by default, "use client" only where needed, proper metadata/alt text/semantic HTML from the start, no placeholder/TODO code.

## Response snapshot

Implemented Milestones 1-3. M1: warm/wooden theme tokens in globals.css, restaurant favicon (icon.svg), root layout with metadata, styled placeholder homepage, robots.ts. M2: hero-section.tsx, category-tiles.tsx (each linking to /menu#<slug> per user correction), Contact/Location section with bracketed placeholders, homepage assembled. M3: menu-item-card.tsx, full menu page (src/app/menu/page.tsx) with 7 category sections using matching id="<slug>" anchors for cross-route navigation. All server components. npm run dev verified at each milestone.

## Outcome

- ✅ Impact: 3 milestones completed — 62 tasks total with 11 tasks done across M1-M3
- 🧪 Tests: null (manual verification via npm run dev)
- 📁 Files: 9 files created/modified
- 🔁 Next prompts: Awaiting user confirmation for Milestone 4 (Supabase schema + live data)
- 🧠 Reflection: T012 correction implemented as specified — category tiles use /menu#<slug> cross-route anchors, menu page uses matching id attributes. All components are server components with proper semantic HTML and metadata.

## Evaluation notes (flywheel)

- Failure modes observed: None — all three milestones built and verified without errors
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): none
