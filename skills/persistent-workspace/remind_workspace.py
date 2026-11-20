#!/usr/bin/env python3
"""Remind Claude about durable workspaces only in the shared chats folder."""
import json
import sys
from pathlib import Path

try:
    event = json.load(sys.stdin)
    cwd = Path(event.get('cwd', '')).expanduser().resolve()
    shared = (Path.home() / 'Claude' / 'chats').resolve()
    if cwd == shared:
        print('Workspace reminder: This session is in the shared chats folder. If the request needs durable files, a new project, or work on an existing named project, invoke the persistent-workspace skill BEFORE creating or editing files, even if earlier turns were only questions. For an existing project find it and switch the desktop session to it; shell cd alone does not move the session. Respect explicit paths and existing projects. For questions or read-only work, do not create a folder.')
    projects = (Path.home() / 'Claude' / 'projects').resolve()
    if projects in cwd.parents:
        print('Project sidebar reminder: invoke persistent-workspace skill to check whether this local project session can be placed in its Project section. Preserve pinned and manually assigned sessions; if status is unclear, skip.')
except (ValueError, OSError, TypeError):
    pass
