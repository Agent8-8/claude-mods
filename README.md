# claude-mods

My custom Claude Code / Claude Desktop setup. Hand this repo's link to another Claude and ask it to "install everything in this README".

## 1. Custom things (in this repo)

| Name | Type | What it does | Location |
|---|---|---|---|
| **Persistent Workspace** | skill + hook | Puts file-producing work into durable folders: tasks go in `~/Claude/chats`, projects in `~/Claude/projects`. Each new project gets `PROJECT.md` and a `CLAUDE.md` that imports it. | `skills/persistent-workspace/` |
| **project-panel** | plugin (mod) | Side pane to edit the current project's `PROJECT.md`. Command: `/project-instructions`. | `plugins/project-panel/` |
| **context-meter** | plugin (mod) | A line above the prompt showing how full the chat is, with a LOW / MEDIUM / HIGH marker. | `plugins/context-meter/` |

### Install: Persistent Workspace

Instructions for Claude, run these steps:

1. Copy the folder:
   ```bash
   mkdir -p ~/.claude/skills && cp -R skills/persistent-workspace ~/.claude/skills/
   mkdir -p ~/Claude/chats ~/Claude/projects
   ```
2. Add this hook to `~/.claude/settings.json` (merge into any existing `hooks`; do not overwrite other hooks):
   ```json
   "hooks": {
     "UserPromptSubmit": [
       { "hooks": [ { "type": "command",
         "command": "/usr/bin/python3 \"$HOME/.claude/skills/persistent-workspace/remind_workspace.py\"",
         "timeout": 5 } ] }
     ]
   }
   ```
3. Add to `~/.claude/CLAUDE.md`: "For local Claude Code Desktop, use the persistent-workspace skill when a task needs durable files while in ~/Claude/chats or a no-folder scratch workspace."

### Install: project-panel and context-meter

Option A, as a plugin marketplace (recommended):
```
/plugin marketplace add <this repo's GitHub URL>
/plugin install project-panel@claude-mods
/plugin install context-meter@claude-mods
```
Option B, load a folder directly: set `env.CLAUDE_CODE_PLUGIN_DIRS` in `~/.claude/settings.json` to a colon-separated list of the plugin folders.

**project-panel needs one edit:** open `plugins/project-panel/hooks/register.js` and set `BASE` to your absolute projects folder (it ships as `/Users/YOUR_USERNAME/Claude/projects`).

## 2. Installed third-party plugins (not in this repo)

Install these from their own repos.

| Plugin | GitHub | Notes |
|---|---|---|
| **ecc** (Everything Claude Code) v2.2.3 | https://github.com/affaan-m/ECC | `/plugin marketplace add affaan-m/ECC`, then `/plugin install ecc@ecc`. My settings: `hooks_enabled: true`, `hook_profile: "standard"`. |
| **caveman** (marketplace only, nothing installed from it) | https://github.com/JuliusBrussee/caveman | Registered as a marketplace, no plugin enabled. |
| **effort-picker**, **handoff**, **replay-theater**, **team-tracker** (mods v0.1.0) | repo unknown (author in manifests: "WeAreNoCode") | Third-party mods living in `~/.claude/mods/`. Not copied here because I don't have their licence or repo. **TODO: add the repo link.** |

## 3. Installed third-party skills (in `~/.claude/skills`, not in this repo)

| Skill | Source |
|---|---|
| impeccable | https://github.com/pbakaus/impeccable |
| graphify | repo unknown (author handle in the skill: safishamsi) |
| apple-design, emil-design-eng, design-review, review-animations, design-taste-frontend, spline-interactive | repo unknown. **TODO: add links.** |
| captions-overlay, changelog-video, cut-the-curve, motion-doctrine, oversized-cursor, seam-craft | HyperFrames-related, marked `internal: true`; repo unknown. **TODO: add links.** |

## Notes
- No secrets, tokens or personal config are in this repo. My global `~/.claude/CLAUDE.md` and `settings.json` are not included.
- Mods are hook modules (`hooks/register.*`) built on the Claude Desktop plugin UI API.
