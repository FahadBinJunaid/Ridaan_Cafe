---
id: 001
title: initialize-nextjs-project-setup
stage: general
date: 2026-07-11
surface: agent
model: deepseek-v4-flash-free
feature: none
branch: master
user: FahadBinJunaid
command: Pehle project ka current folder structure check karo... (full user prompt)
labels: ["project-setup", "nextjs", "shadcn", "supabase", "tailwindcss"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/app/favicon.ico
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/components/ui/button.tsx
  - src/components/ui/card.tsx
  - src/components/ui/input.tsx
  - src/components/ui/label.tsx
  - src/components/ui/textarea.tsx
  - src/components/ui/dialog.tsx
  - src/components/ui/badge.tsx
  - src/components/ui/tabs.tsx
  - src/lib/utils.ts
  - .gitignore
  - .env.local
  - package.json
  - package-lock.json
  - tsconfig.json
  - eslint.config.mjs
  - next.config.ts
  - next-env.d.ts
  - postcss.config.mjs
  - AGENTS.md
  - README.md
  - public/file.svg
  - public/globe.svg
  - public/next.svg
  - public/vercel.svg
  - public/window.svg
tests:
  - null
---

## Prompt

Pehle project ka current folder structure check karo (.specify/, history/, opencode.md sab dekho jo already ban chuke hain) — inhe overwrite ya delete mat karna. Uske baad is folder ke andar hi (root mein, naya subfolder banaye bina) ek Next.js 14 project initialize karo in exact steps ke saath:

1. `npx create-next-app@latest .` chalao current directory mein (naya folder mat banao) in options ke saath: TypeScript = Yes, ESLint = Yes, Tailwind CSS = Yes, src/ directory = Yes, App Router = Yes, import alias customize = No. Agar yeh command kisi existing file (jaise .git, .specify) ki wajah se conflict kare, to un files ko preserve karte hue sirf Next.js ke zaroori files add karo.

2. shadcn/ui initialize karo: `npx shadcn@latest init` — default/neutral base color select karo.

3. Yeh shadcn components add karo: `npx shadcn@latest add button card input label textarea dialog badge tabs`

4. Yeh saari libraries ek command mein install karo: `npm install zustand react-hook-form @hookform/resolvers zod framer-motion @supabase/supabase-js @supabase/ssr`

5. Root mein `.env.local` file banao (khali values ke saath, sirf keys):
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Confirm karo ke .gitignore mein .env.local already included hai (Next.js default karta hai) — agar nahi hai to add karo.

6. `npm run dev` chala kar confirm karo ke project error-free start ho raha hai, phir stop kar do.

7. Ab, sab kuch install/setup hone ke baad, root ki `opencode.md` file ko open karo aur uske EXISTING rules (PHR routing, ADR suggestion logic, Development Guidelines, Default policies) ko bilkul mat chhedo/overwrite karo — sirf file ke end mein ek naya section append karo, is tarah:

## Project Context

- **Project:** Rindaan Cafe & Cuisine — Pakistani Dhaba-style restaurant ordering website
- **Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, React Hook Form + Zod, Supabase (DB/Auth/Storage/Realtime), Cloudinary (images), Zustand (cart state only), Vercel (hosting)
- **No other infra/tools:** No payment gateway, no error-tracking/analytics service, no WhatsApp integration in v1
- **Folder structure:** [yahan actual generated structure likho jo create-next-app ne banaya — src/app, src/components, etc.]
- **Note:** This section is a living summary; the authoritative source of truth for architecture and requirements is `specs/<feature>/spec.md` and `plan.md`, generated via /sp.specify and /sp.plan.

8. Sab kuch hone ke baad, final summary do: kya install hua, kya folder structure bani, aur confirm karo ke .specify/, history/, aur opencode.md ke original rules (sirf new section add hua hai, kuch overwrite nahi hua) safe hain.

Is poore process ka ek PHR (Prompt History Record) bhi banao "general" stage ke through, jaisa opencode.md ki rules mein define hai.

## Response snapshot

Created full Next.js 16 project scaffold (create-next-app @latest) in root—preserved .specify/, .opencode/, opencode.md, .git/. Installed shadcn/ui (neutral base) with 8 UI components (button, card, input, label, textarea, dialog, badge, tabs). Installed zustand, react-hook-form, @hookform/resolvers, zod, framer-motion, @supabase/supabase-js, @supabase/ssr. Created .env.local with empty keys (verified .gitignore already covered .env*). Ran npm run dev—started without errors. Appended "Project Context" section to opencode.md without modifying existing rules. Created PHR at history/prompts/general/001-initialize-nextjs-project-setup.general.prompt.md.

## Outcome

- ✅ Impact: Project scaffolded with all required dependencies
- 🧪 Tests: null
- 📁 Files: 25+ files created (Next.js scaffold, shadcn components, configs, .env.local)
- 🔁 Next prompts: Add features, configure Supabase schema, build UI components
- 🧠 Reflection: Next.js 16 installed (latest create-next-app), not v14 as originally specified; all steps completed successfully

## Evaluation notes (flywheel)

- Failure modes observed: create-next-app cannot run in directory with name containing capitals/underscores—worked around via temp dir scaffolding
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): none
