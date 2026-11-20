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
| **ecc** (Everything Claude Code) v2.2.3, ~308k stars | https://github.com/affaan-m/ECC | `/plugin marketplace add affaan-m/ECC`, then `/plugin install ecc@ecc`. My settings: `hooks_enabled: true`, `hook_profile: "standard"`. |
| **caveman** (marketplace only, nothing installed from it), ~122k stars | https://github.com/JuliusBrussee/caveman | Registered as a marketplace, no plugin enabled. |
| **token-optimizer** v5.13.75 | https://github.com/alexgreensh/token-optimizer | `/plugin marketplace add alexgreensh/token-optimizer`, then `/plugin install token-optimizer@alexgreensh-token-optimizer` (user scope). Run `/token-optimizer` once afterwards to set up its hooks. PolyForm Noncommercial licence. |
| **imessage** v0.2.0 | `claude-plugins-official` marketplace | Official plugin, user scope: `/plugin install imessage@claude-plugins-official`. |
| **effort-picker**, **handoff**, **replay-theater**, **team-tracker** (mods v0.1.0) | From a **WeAreNoCode YouTube video** (video link: add here). Closest repo found: [nicman101/wearenocode-claude-mods](https://github.com/nicman101/wearenocode-claude-mods) (README only, no code) | Author in the manifests is "WeAreNoCode". The mods live in `~/.claude/mods/` and are loaded through `CLAUDE_CODE_PLUGIN_DIRS`. Not copied into this repo since I can't confirm their licence; to reinstall, follow the steps in that video or get the files from the channel's description. About mods in general: [Anthropic's mods announcement](https://claude.com/blog/claude-code-mods). |

## 3. Installed third-party skills (in `~/.claude/skills`, not in this repo)

| Skill | Source |
|---|---|
| impeccable (~114k stars) | https://github.com/pbakaus/impeccable |
| graphify (~151k stars) | https://github.com/Graphify-Labs/graphify (older name: safishamsi/graphify, redirects). Install: `pip install graphifyy && graphify install` |
| design-taste-frontend (~119k stars) | https://github.com/Leonxlnx/taste-skill |
| emil-design-eng, apple-design, review-animations (~58k stars) | https://github.com/emilkowalski/skills, install with `npx skills add emilkowalski/skills --skill <name>` |
| captions-overlay, changelog-video, cut-the-curve, motion-doctrine, oversized-cursor, seam-craft (~87k stars) | https://github.com/heygen-com/hyperframes (under `.claude/skills/`). The main HyperFrames skills install with `npx skills add heygen-com/hyperframes` |
| design-review (~38 stars) | https://github.com/Superfuture/design-review (matched by identical description text) |
| spline-interactive (~1.4k stars) | https://github.com/freshtechbro/claudedesignskills (matched by description) |

## Notes
- No secrets, tokens or personal config are in this repo. My global `~/.claude/CLAUDE.md` and `settings.json` are not included.
- Mods are hook modules (`hooks/register.*`) built on the Claude Desktop plugin UI API.
