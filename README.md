# opencode-auto-readme

An [opencode](https://opencode.ai) plugin that keeps your directory-level `README.md` files in sync with code changes — automatically.

Every time you edit a code file, the plugin asks your current opencode session to check whether the `README.md` next to that file needs an update (new file added to the docs table, changed purpose, updated exports, …). Trivial changes are skipped, so it stays quiet unless there is a genuine reason to touch the README.

## Install

Add the package to the `plugin` array in your `opencode.json`:

**Global** (`~/.config/opencode/opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-auto-readme"]
}
```

**Project** (`./opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-auto-readme"]
}
```

That's it. opencode installs the package automatically with Bun on the next startup — no extra CLI step needed. Then restart opencode.

You can also pin a version:

```json
{ "plugin": ["opencode-auto-readme@0.1.0"] }
```

### Install directly from GitHub (no npm)

If you prefer pulling straight from the repository, use a `name@git+https` spec:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-auto-readme@git+https://github.com/littlekey/opencode-auto-readme.git"]
}
```

opencode installs it with Bun at startup and resolves the package entry from the repo's `package.json`, so no npm publish is required for this path.

### Local install (no npm)

Copy `auto-readme.js` into one of the plugin directories and restart opencode:

- global: `~/.config/opencode/plugins/auto-readme.js`
- project: `.opencode/plugins/auto-readme.js`

## How it works

1. The plugin hooks into the `file.edited` event.
2. It checks whether the edited file is a code file (by extension) and is not inside a skipped directory.
3. If it qualifies, the plugin sends a prompt to your current session asking it to review and, if needed, update the `README.md` in the same directory:
   - add new files to the "Files" table
   - update descriptions when a file's purpose changed
   - update the "Exports" section when the API changed
   - keep the README under ~100 lines (300 for complex directories)
   - skip updates for trivial changes (typos, formatting, comments)

## Which files trigger it

Source files with extensions like `.go .ts .tsx .js .jsx .py .rs .java .c .cpp .h .hpp .cs .rb .php .swift .kt .scala .lua .r .pl .pm .sh .bash .zsh .ps1 .yaml .yml .toml .json .xml .html .css .scss .sass .less .sql .graphql .proto`, plus `Makefile`, `Dockerfile`, `.env`, `.gitignore`, `.dockerignore`.

## Skipped directories

`.opencode`, `node_modules`, `vendor`, `.git`, `__pycache__`, `.pytest_cache`, `dist`, `build`, `.next`, `.nuxt`, `.svelte-kit`

## Known limitations

- The plugin prompts the most recent session returned by `session.list()`. If you run multiple sessions, the README update may land in a different session than the one that edited the file.
- README updates consume session tokens; keep that in mind on long sessions.

## License

[MIT](./LICENSE)
