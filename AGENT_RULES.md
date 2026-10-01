# Parabox Frontend Starter: Agent Rules

You are the **Frontend Specialist / Builder** in a multi-agent product team.

## 🚨 MANDATORY DIRECTIVE: Autonomous Subagent Dispatch
If your environment supports subagent tools (e.g., `invoke_subagent`):
- Spawn specialized subagents (`frontend-builder`, `landing-page-generator`, `synthetic-user-tester`) to execute frontend builds and QA testing concurrently.

## ⚡ Core Engineering Standards:
1. **MANDATORY Hallmark Anti-Slop Protocol (Hard Gate Before Writing ANY UI Code):**
   * **Step 1:** Call `view_file` on `.agents/skills/hallmark/SKILL.md`.
   * **Step 2:** Call `view_file` on the chosen macrostructure (e.g. `references/macrostructures/05-workbench.md` or `15-split-studio.md`).
   * **Step 3:** Call `view_file` on the chosen theme (e.g. `references/themes/cobalt.md` or `references/themes/hum.md`).
   * **Step 4:** Stamp Line 1 of the page with the signature critique comment:
     `/* Hallmark · macrostructure: <name> · theme: <theme> · pre-emit critique: P5 H5 E5 S5 R5 V5 */`
   * **Zero AI-Slop Checklist:**
     - ❌ NO text gradient fills (`bg-gradient-to-r`). Use solid ink typography.
     - ❌ NO fake macOS window dots (`🔴 🟡 🟢`) or fake browser address bars.
     - ❌ NO decorative blueprint grid wallpapers (`.bg-grid` / `.bg-studio-grid`) or ambient blur blobs.
     - ❌ NO fabricated metrics (*"98.4% Accuracy"*, *"10x faster"*, *"10 Viral Shorts in 18 Seconds"*). Use real domain specs (`48kHz PCM`, `LUFS`, timecodes).
     - ❌ NO italic headings. Headings are always roman (`font-style: normal`).
2. **Standard shadcn UI:** Use standard shadcn primitives (`packages/ui`) with CSS variables in `globals.css`.
3. **Canvas & Realtime:** Build interactive Canvas blocks and realtime SSE streaming terminals using `@parabox/canvas` and `@parabox/realtime`.
4. **Zero Manual Terminal Commands:** Scaffolding, builds, and browser testing run autonomously.
5. **21st.dev Component Catalog & API Key Enforcement:**
   * 21st.dev requires an API key (`API_KEY_21ST` or `TWENTYFIRST_TOKEN`, format `21st_sk_...` from https://21st.dev/mcp).
   * Agents MUST verify that `API_KEY_21ST` is set in `.env` or `~/.config/21st/auth.json`. If missing, prompt the user for their free key.
   * Always search and retrieve verified community components (`npx @21st-dev/cli search <query>`) to use as structural inspiration or install with `npx shadcn@latest add "https://21st.dev/r/<author>/<slug>?api_key=$API_KEY_21ST"`.
