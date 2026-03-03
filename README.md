<p align="center">
  <img src="assets/typebot-logo.png" alt="Typebot Logo" width="120" />
</p>

# mcp-typebot

MCP server that wraps the [Typebot](https://typebot.io) API as semantic tools for LLM agents.

Works with **Claude Code**, **Codex**, **Claude Desktop**, **Cursor**, **VS Code**, **Windsurf**, and any MCP-compatible client.

---

## Use Cases & Examples

> Real prompts you can use with this MCP server:

- **"List all my typebots"** — Lists all chatbots in your workspace with name, ID, and publish status
- **"Show me the stats for my lead capture bot this month"** — Returns total views, starts, and completions for the specified period
- **"Start a chat with my onboarding bot and prefill the user's name"** — Initiates a live chat session with prefilled variables
- **"Get all conversation results from last 7 days"** — Retrieves submission data with answers and variables
- **"Publish the bot I just updated"** — Publishes the latest draft to make it live

---

## Prerequisites

- Node.js 18+
- Typebot API token ([get one here](https://app.typebot.io) → Settings & Members → My account → API tokens)

| Variable | Where to find |
| -------- | ------------- |
| `TYPEBOT_API_KEY` | Typebot dashboard → Settings & Members → My account → API tokens → Create |
| `TYPEBOT_BASE_URL` | *(Optional)* Your self-hosted instance URL (e.g. `https://bot.example.com`) |

> **Self-hosted?** Set `TYPEBOT_BASE_URL` to your instance URL. If not set, defaults to Typebot Cloud.

## Installation

### Claude Code

Three installation scopes are available:

| Scope | Flag | Config file | Use case |
|-------|------|-------------|----------|
| **local** | `-s local` | `.mcp.json` | This project only (default) |
| **project** | `-s project` | `.claude/mcp.json` | Shared with team via git |
| **user** | `-s user` | `~/.claude/mcp.json` | All your projects |

**Quick setup (CLI):**

```bash
claude mcp add typebot -s user \
  -e TYPEBOT_API_KEY=your-key \
  -e TYPEBOT_BASE_URL=https://bot.example.com \
  -- npx -y github:pauloFroes/mcp-typebot
```

> Omit `TYPEBOT_BASE_URL` if using Typebot Cloud.

> Replace `-s user` with `-s local` or `-s project` as needed.

**Manual setup (.mcp.json):**

Add to your `.mcp.json` with env values directly:

```json
{
  "typebot": {
    "command": "npx",
    "args": ["-y", "github:pauloFroes/mcp-typebot"],
    "env": {
      "TYPEBOT_API_KEY": "your-key"
    }
  }
}
```

> See `.env.example` in the repo for required variables.

### Codex

Add to your Codex configuration:

```toml
[mcp_servers.typebot]
command = "npx"
args = ["-y", "github:pauloFroes/mcp-typebot"]
env_vars = ["TYPEBOT_API_KEY"]
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "typebot": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-typebot"],
      "env": {
        "TYPEBOT_API_KEY": "your-key"
      }
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "typebot": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-typebot"],
      "env": {
        "TYPEBOT_API_KEY": "your-key"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "typebot": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-typebot"],
      "env": {
        "TYPEBOT_API_KEY": "your-key"
      }
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "typebot": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-typebot"],
      "env": {
        "TYPEBOT_API_KEY": "your-key"
      }
    }
  }
}
```

## Available Tools

### Typebots

| Tool | Description |
|------|-------------|
| `list_typebots` | List all typebots in a workspace |
| `get_typebot` | Get complete typebot configuration by ID |
| `create_typebot` | Create a new typebot |
| `update_typebot` | Update typebot fields (name, theme, settings, groups, etc.) |
| `delete_typebot` | Permanently delete a typebot |
| `publish_typebot` | Publish a typebot to make it live |
| `unpublish_typebot` | Remove a typebot from public access |
| `get_published_typebot` | Get the published version of a typebot |

### Chat

| Tool | Description |
|------|-------------|
| `start_chat` | Start a chat session with a published bot (requires public ID) |
| `continue_chat` | Continue a chat by sending a message (requires session ID) |
| `start_preview_chat` | Start a test chat session (answers not saved) |

### Results

| Tool | Description |
|------|-------------|
| `list_results` | List conversation results with pagination and time filters |
| `get_result` | Get a specific result with variables and answers |
| `delete_results` | Delete specific or all results |
| `list_result_logs` | List execution logs for debugging |
| `get_stats` | Get analytics: views, starts, completions |

### Workspaces

| Tool | Description |
|------|-------------|
| `list_workspaces` | List all accessible workspaces |
| `get_workspace` | Get workspace details (plan, limits, status) |
| `create_workspace` | Create a new workspace |
| `update_workspace` | Update workspace name or icon |
| `delete_workspace` | Permanently delete a workspace |
| `list_workspace_members` | List workspace members and roles |

### Folders

| Tool | Description |
|------|-------------|
| `list_folders` | List folders in a workspace |
| `get_folder` | Get folder details |
| `create_folder` | Create a new folder |
| `update_folder` | Rename or move a folder |
| `delete_folder` | Delete a folder and its contents |

### Billing

| Tool | Description |
|------|-------------|
| `get_billing_usage` | Get current chat usage and reset date |
| `list_invoices` | List billing invoices |

## Authentication

This server uses **Bearer token** authentication. The API token is passed as `Authorization: Bearer <token>` header on every request.

The Typebot API uses two different base URLs:
- **Management API** (`https://app.typebot.io/api`) — for CRUD operations on typebots, workspaces, folders, results, and billing
- **Chat API** (`https://typebot.io/api`) — for starting and continuing chat sessions

The token is loaded from the `TYPEBOT_API_KEY` environment variable at startup. If missing, the server exits immediately with instructions on how to obtain one.

## License

MIT
