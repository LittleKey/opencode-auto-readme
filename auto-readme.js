/**
 * auto-readme — an opencode plugin that keeps directory README.md files in
 * sync with code changes.
 *
 * Whenever a code file is edited, the plugin prompts the current session to
 * check whether the README.md next to that file needs updating.
 *
 * Hooks used: file.edited
 */

export const AutoReadmePlugin = async ({ client, $, directory }) => {
  const CODE_EXTENSIONS = new Set([
    '.go', '.ts', '.tsx', '.js', '.jsx', '.py', '.rs', '.java', '.c', '.cpp',
    '.h', '.hpp', '.cs', '.rb', '.php', '.swift', '.kt', '.scala', '.lua',
    '.r', '.R', '.pl', '.pm', '.sh', '.bash', '.zsh', '.ps1', '.yaml', '.yml',
    '.toml', '.json', '.xml', '.html', '.css', '.scss', '.sass', '.less',
    '.sql', '.graphql', '.proto', '.dockerfile', 'Makefile', '.env',
    '.gitignore', '.dockerignore'
  ])

  const SKIP_DIRS = new Set([
    '.opencode', 'node_modules', 'vendor', '.git', '__pycache__',
    '.pytest_cache', 'dist', 'build', '.next', '.nuxt', '.svelte-kit'
  ])

  function shouldProcess(filePath) {
    const pathParts = filePath.split('/')
    for (const part of pathParts) {
      if (SKIP_DIRS.has(part)) return false
    }

    if (filePath.includes('plugins/auto-readme')) return false

    const lastPart = pathParts[pathParts.length - 1]

    if (lastPart === 'Makefile' || lastPart === 'Dockerfile' ||
        lastPart === '.env' || lastPart === '.gitignore' ||
        lastPart === '.dockerignore') {
      return true
    }

    for (const ext of CODE_EXTENSIONS) {
      if (lastPart.endsWith(ext)) return true
    }

    return false
  }

  function extractDirInfo(filePath) {
    const parts = filePath.split('/')
    const filename = parts.pop()
    const dirPath = parts.join('/')
    const dirName = parts.pop() || 'root'
    return { filename, dirPath, dirName }
  }

  async function getCurrentSession() {
    try {
      const sessions = await client.session.list()
      if (sessions.data && sessions.data.length > 0) {
        return sessions.data[0]
      }
      return null
    } catch (err) {
      console.error('[auto-readme] Failed to list sessions:', err.message)
      return null
    }
  }

  async function triggerReadmeUpdate(sessionId, filePath, dirPath, dirName, filename) {
    try {
      await client.session.prompt({
        path: { id: sessionId },
        body: {
          parts: [{
            type: "text",
            text: `File "${filename}" was just modified in the "${dirName}/" directory.

Please check if the README.md in "${dirPath}" needs to be updated to reflect this change.

If the README.md exists and the modification to "${filename}" changes what this directory does or how it's used, update the README accordingly.
- Add the file to the "Files" table if it's new
- Update the file description if its purpose changed
- Update "Exports" or "主要导出" section if API changed
- Keep it under 100 lines (or 300 for complex directories)

If the change is trivial (typo fix, formatting, comment update), you may skip the README update.

IMPORTANT: Only modify README.md if there's a genuine need. Do not update for minor changes.`
          }],
          noReply: false
        }
      })

      await client.app.log({
        body: {
          service: "auto-readme",
          level: "info",
          message: `Triggered readme check for: ${filePath}`
        }
      })
    } catch (err) {
      await client.app.log({
        body: {
          service: "auto-readme",
          level: "error",
          message: `Failed to trigger readme update: ${err.message}`
        }
      })
    }
  }

  return {
    "file.edited": async (input, output) => {
      const { filePath } = input

      if (!shouldProcess(filePath)) {
        return output
      }

      const { filename, dirPath, dirName } = extractDirInfo(filePath)

      console.log(`[auto-readme] Processing: ${filePath}`)

      const session = await getCurrentSession()
      if (session) {
        await triggerReadmeUpdate(session.id, filePath, dirPath, dirName, filename)
      } else {
        console.log('[auto-readme] No active session found, skipping')
      }

      return output
    },
  }
}

export default AutoReadmePlugin
