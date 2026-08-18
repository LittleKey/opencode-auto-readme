# opencode-auto-readme

一个 [opencode](https://opencode.ai) 插件：当代码文件被修改时，自动让当前会话检查并更新所在目录的 `README.md`，保持目录级文档与代码同步。

每次编辑代码文件后，插件会提示当前 opencode 会话检查该文件所在目录的 `README.md` 是否需要更新（新增文件加入文档表格、用途变化、导出 API 变化等）。琐碎改动会被跳过，只有确实需要时才会动 README。

## 安装

在你的 `opencode.json` 的 `plugin` 数组中加入本包即可：

**全局**（`~/.config/opencode/opencode.json`）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-auto-readme"]
}
```

**项目级**（`./opencode.json`）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-auto-readme"]
}
```

就这么简单。opencode 下次启动时会用 Bun 自动安装该包，无需额外命令。然后重启 opencode 生效。

也可以固定版本：

```json
{ "plugin": ["opencode-auto-readme@0.1.0"] }
```

### 直接从 GitHub 安装（不走 npm）

如果想直接从仓库拉取，使用 `name@git+https` 格式：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-auto-readme@git+https://github.com/littlekey/opencode-auto-readme.git"]
}
```

opencode 启动时会用 Bun 自动安装，并按仓库 `package.json` 的入口加载，因此这条路不需要发布到 npm。

### 本地安装（不走 npm）

把 `auto-readme.js` 复制到插件目录后重启 opencode：

- 全局：`~/.config/opencode/plugins/auto-readme.js`
- 项目：`.opencode/plugins/auto-readme.js`

## 工作原理

1. 插件监听 `file.edited` 事件。
2. 判断被修改的文件是否是代码文件（按扩展名），且不在跳过目录中。
3. 符合条件时，向当前会话发送一条提示，要求检查并按需更新同目录的 `README.md`：
   - 新文件加入 "Files" 表格
   - 文件用途变化时更新描述
   - API 变化时更新 "Exports" / “主要导出” 部分
   - README 保持在 100 行以内（复杂目录最多 300 行）
   - 琐碎改动（错别字、格式、注释）直接跳过

## 触发的文件类型

扩展名如 `.go .ts .tsx .js .jsx .py .rs .java .c .cpp .h .hpp .cs .rb .php .swift .kt .scala .lua .r .pl .pm .sh .bash .zsh .ps1 .yaml .yml .toml .json .xml .html .css .scss .sass .less .sql .graphql .proto` 的源码文件，以及 `Makefile`、`Dockerfile`、`.env`、`.gitignore`、`.dockerignore`。

## 跳过的目录

`.opencode`、`node_modules`、`vendor`、`.git`、`__pycache__`、`.pytest_cache`、`dist`、`build`、`.next`、`.nuxt`、`.svelte-kit`

## 已知限制

- 插件会向 `session.list()` 返回的最近会话发送提示。如果你开了多个会话，README 更新可能落在与编辑文件不同的会话里。
- README 更新会消耗会话 token，长会话请留意。

## 许可证

[MIT](./LICENSE)
