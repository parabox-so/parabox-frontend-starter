# Mandatory Directive: Always Use Hallmark & 21st.dev for Frontend Work

Whenever the user asks to build, modify, redesign, or create any web page, UI component, or frontend feature:

## 1. 21st.dev Component Catalog (Search Before Building)
* The agent environment is authenticated with `API_KEY_21ST` and `~/.config/21st/auth.json`.
* **MANDATORY:** Before hand-writing UI elements or layout components from memory, query 21st.dev:
  ```bash
  npx @21st-dev/cli search "<query>" --limit 5
  ```
  or call 21st MCP tools (`search_components`, `get_component`).
* Use verified community patterns (scrubbers, heroes, cards, controls) as foundational architecture.

## 2. Hallmark Anti-Slop Protocol (Mandatory Execution Gate)
* **Step 1:** Call `view_file` on `.agents/skills/hallmark/SKILL.md`.
* **Step 2:** Call `view_file` on the chosen macrostructure in `.agents/skills/hallmark/references/macrostructures/<name>.md`.
* **Step 3:** Call `view_file` on the chosen theme in `.agents/skills/hallmark/references/themes/<theme>.md`.
* **Step 4:** Stamp Line 1 of the file with the critique signature:
  ```typescript
  /* Hallmark · macrostructure: <name> · theme: <theme> · pre-emit critique: P5 H5 E5 S5 R5 V5 */
  ```

## 3. Strict Anti-Slop Ban List
* ❌ NO text gradient fills (`bg-gradient-to-r`). Solid ink typography only.
* ❌ NO fake macOS window dots (`🔴 🟡 🟢`) or fake browser address bars.
* ❌ NO decorative blueprint grid wallpapers (`.bg-grid` / `.bg-studio-grid`) or ambient blur blobs.
* ❌ NO fabricated metrics (*"98.4% Accuracy"*, *"10x faster"*, *"10 Viral Shorts in 18 Seconds"*). Use real domain specs (`48kHz PCM`, `LUFS`, timecodes).
* ❌ NO italic headings. Headings must always be roman (`font-style: normal`).
