---
name: auto-readme
description: Conventions for writing and maintaining per-directory README.md files. Use when the auto-readme plugin triggers a "check if the README.md needs updating" prompt after a code file was edited, when creating a README.md for a directory, when updating a Files table or Exports section in an existing README.md, or when the user asks to document a directory. Use ONLY for directory-level README.md maintenance, not for top-level project READMEs or general documentation.
---

# auto-readme: directory README conventions

Keep every source directory's `README.md` in sync with its actual contents. A
directory README answers one question for a newcomer: *what lives here and why?*

## When to update

- A file was added, removed, or renamed in the directory
- A file's purpose changed (new responsibilities, changed behavior)
- The directory's public API / exports changed
- A README.md does not exist yet and the directory holds more than one file

Skip the update when the change is trivial: typo fixes, formatting, comment
edits, dependency bumps, or anything a reader of the README cannot observe.

## Structure

```markdown
# <directory-name>

One short paragraph: what this directory contains and its role in the project.

## Files

| File    | Description                                  |
| ------- | -------------------------------------------- |
| foo.ts  | One line per file: what it does, not what it is named |

## Exports

| Symbol        | Type      | Description                |
| ------------- | --------- | -------------------------- |
| `doFoo()`     | function  | What it does and when to call it |
```

Rules:

- **Files table**: one row per meaningful file. Skip editor noise and
  generated artifacts. One-line descriptions written for a reader who has
  never seen the code.
- **Exports section** (API-ish directories only): public functions, types,
  and constants other code imports. Directories of scripts or configs can
  omit it.
- **Length**: under 100 lines. Complex directories (many files, rich API) may
  go up to 300 lines. If it outgrows that, split the directory or move detail
  into per-file docs and link them.
- **Language**: match the README's existing language. Chinese READMEs keep
  Chinese section titles (e.g. "主要导出"); English READMEs stay English.
- **No fabrication**: read the file before describing it. Never invent a
  description from the filename alone.

## What not to do

- Don't rewrite a whole README when one table row changed
- Don't document internals no consumer touches
- Don't add badges, build status, or long intros - this is a map, not a
  landing page
- Don't create READMEs for directories that are self-explanatory or hold a
  single trivial file
