#!/usr/bin/env python3
"""Create one uniquely named Claude workspace, without touching existing files."""
import argparse
import datetime
import re
import unicodedata
from pathlib import Path


def slugify(value):
    text = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()
    text = re.sub(r'[^a-z0-9]+', '-', text).strip('-')[:48].rstrip('-')
    return text or 'untitled'


def create(root, kind, title, date=None):
    base = root / ('projects' if kind == 'project' else 'chats')
    if not base.is_dir():
        raise RuntimeError(f'Workspace parent does not exist: {base}')
    name = slugify(title)
    if kind == 'task':
        name = f'{date or datetime.date.today().isoformat()}-{name}'
    for n in range(1, 10001):
        candidate = base / (name if n == 1 else f'{name}-{n}')
        try:
            candidate.mkdir()
            if kind == 'project':
                (candidate / 'PROJECT.md').write_text('# Project instructions\n\nAdd project-specific goals, preferences, and constraints here.\n', encoding='utf-8')
                (candidate / 'CLAUDE.md').write_text('# Project instructions\n\n@PROJECT.md\n', encoding='utf-8')
            return candidate
        except FileExistsError:
            continue
    raise RuntimeError('Unable to find an unused folder name')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--kind', choices=('task', 'project'), required=True)
    parser.add_argument('--title', required=True)
    args = parser.parse_args()
    print(create(Path.home() / 'Claude', args.kind, args.title))


if __name__ == '__main__':
    main()
