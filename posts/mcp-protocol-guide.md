---
title: "Model Context Protocol (MCP): The New Standard for AI Tools"
date: "2026-01-03"
excerpt: "Anthropic's MCP is becoming the USB-C of AI integrations. Here's how to build your first MCP server, why it matters for the agentic future, and how to integrate it into your existing systems."
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
tags: ["AI", "Tutorials"]
author: "Yuval Avidani"
---

## The Integration Problem We've All Faced

Every time you connect an AI assistant to a new data source or tool, you're reinventing the wheel. Want Claude to access your database? Write a custom integration. Want GPT to use your internal APIs? Write another custom integration. Want both to use Slack? Write two more integrations.

This is the state of AI tooling: a mess of bespoke connections, each with its own authentication, error handling, and data formatting. It's like the pre-USB era where every device had its own proprietary connector.

Model Context Protocol (MCP) is Anthropic's answer to this chaos. It's an open standard that lets any AI model interact with any tool through a unified interface. Write an MCP server once, and every MCP-compatible AI can use it.

This matters because the future of AI is agentic - AI systems that don't just answer questions but take actions. Those agents need tools. MCP provides the standard way to give them tools.

## What MCP Actually Is

MCP defines a protocol for communication between:
- **Hosts** (AI applications like Claude Desktop, Cursor, or your custom app)
- **Servers** (Tool providers - your database, APIs, services)

```
┌─────────────────────────────────────────────────────────────────┐
│                         MCP Ecosystem                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐         MCP          ┌─────────────────────┐  │
│   │   Claude    │◄───────Protocol──────►│  Database Server   │  │
│   │   Desktop   │                       │  (PostgreSQL MCP)  │  │
│   └─────────────┘                       └─────────────────────┘  │
│          │                                                       │
│          │              MCP            ┌─────────────────────┐  │
│          └─────────Protocol────────────►│  GitHub Server     │  │
│                                         │  (GitHub MCP)      │  │
│                                         └─────────────────────┘  │
│                                                                  │
│   ┌─────────────┐         MCP          ┌─────────────────────┐  │
│   │   Cursor    │◄───────Protocol──────►│  Custom API Server │  │
│   │   IDE       │                       │  (Your MCP)        │  │
│   └─────────────┘                       └─────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

The protocol specifies:
- **Tools**: Actions the AI can take (query database, create issue, send message)
- **Resources**: Data the AI can read (files, database schemas, API docs)
- **Prompts**: Reusable prompt templates the server provides
- **Transport**: How messages flow (stdio, SSE, WebSocket)

## Building Your First MCP Server

Let's build a practical MCP server that gives AI access to a task management system.

### 1. Project Setup

```bash
mkdir task-manager-mcp
cd task-manager-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
npx tsc --init
```

### 2. Define Your Tools

```typescript
// src/server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// In-memory task store (replace with your database)
interface Task {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  assignee?: string;
  dueDate?: string;
  createdAt: string;
}

const tasks: Map<string, Task> = new Map();

// Create the server
const server = new Server(
  {
    name: "task-manager",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_task",
        description: "Create a new task in the task manager",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The task title",
            },
            assignee: {
              type: "string",
              description: "Person assigned to the task",
            },
            dueDate: {
              type: "string",
              description: "Due date in ISO format",
            },
          },
          required: ["title"],
        },
      },
      {
        name: "list_tasks",
        description: "List all tasks, optionally filtered by status",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["todo", "in_progress", "done"],
              description: "Filter by task status",
            },
            assignee: {
              type: "string",
              description: "Filter by assignee",
            },
          },
        },
      },
      {
        name: "update_task",
        description: "Update an existing task",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Task ID to update",
            },
            status: {
              type: "string",
              enum: ["todo", "in_progress", "done"],
            },
            assignee: {
              type: "string",
            },
            dueDate: {
              type: "string",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "delete_task",
        description: "Delete a task by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Task ID to delete",
            },
          },
          required: ["id"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "create_task": {
      const id = crypto.randomUUID();
      const task: Task = {
        id,
        title: args.title as string,
        status: "todo",
        assignee: args.assignee as string | undefined,
        dueDate: args.dueDate as string | undefined,
        createdAt: new Date().toISOString(),
      };
      tasks.set(id, task);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: true, task }, null, 2),
          },
        ],
      };
    }

    case "list_tasks": {
      let results = Array.from(tasks.values());

      if (args.status) {
        results = results.filter((t) => t.status === args.status);
      }
      if (args.assignee) {
        results = results.filter((t) => t.assignee === args.assignee);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ tasks: results }, null, 2),
          },
        ],
      };
    }

    case "update_task": {
      const task = tasks.get(args.id as string);
      if (!task) {
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: "Task not found" }) },
          ],
          isError: true,
        };
      }

      if (args.status) task.status = args.status as Task["status"];
      if (args.assignee) task.assignee = args.assignee as string;
      if (args.dueDate) task.dueDate = args.dueDate as string;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: true, task }, null, 2),
          },
        ],
      };
    }

    case "delete_task": {
      const deleted = tasks.delete(args.id as string);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: deleted }),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Task Manager MCP server running");
}

main().catch(console.error);
```

### 3. Add Resource Support

Resources let the AI read data without taking actions:

```typescript
// Add to server.ts

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "tasks://all",
        name: "All Tasks",
        description: "Complete list of all tasks in the system",
        mimeType: "application/json",
      },
      {
        uri: "tasks://overdue",
        name: "Overdue Tasks",
        description: "Tasks past their due date",
        mimeType: "application/json",
      },
      {
        uri: "tasks://stats",
        name: "Task Statistics",
        description: "Summary statistics about tasks",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "tasks://all":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(Array.from(tasks.values()), null, 2),
          },
        ],
      };

    case "tasks://overdue": {
      const now = new Date();
      const overdue = Array.from(tasks.values()).filter((task) => {
        if (!task.dueDate || task.status === "done") return false;
        return new Date(task.dueDate) < now;
      });
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(overdue, null, 2),
          },
        ],
      };
    }

    case "tasks://stats": {
      const all = Array.from(tasks.values());
      const stats = {
        total: all.length,
        byStatus: {
          todo: all.filter((t) => t.status === "todo").length,
          in_progress: all.filter((t) => t.status === "in_progress").length,
          done: all.filter((t) => t.status === "done").length,
        },
        overdueCount: all.filter((t) => {
          if (!t.dueDate || t.status === "done") return false;
          return new Date(t.dueDate) < new Date();
        }).length,
      };
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});
```

### 4. Configure for Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "task-manager": {
      "command": "node",
      "args": ["/path/to/task-manager-mcp/dist/server.js"]
    }
  }
}
```

Restart Claude Desktop, and you can now ask:
- "Create a task to review the Q4 budget, assign it to Sarah, due Friday"
- "Show me all overdue tasks"
- "Mark task xyz as done"

## Real-World MCP Patterns

### Database Access

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "query_database") {
    const { query } = request.params.arguments;

    // Validate query (important for security!)
    if (!isReadOnlyQuery(query)) {
      return {
        content: [{ type: "text", text: "Only SELECT queries are allowed" }],
        isError: true,
      };
    }

    const results = await db.query(query);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results.rows, null, 2),
        },
      ],
    };
  }
});
```

### API Integration

```typescript
// GitHub MCP server example
const tools = [
  {
    name: "list_issues",
    description: "List issues in a repository",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        state: { type: "string", enum: ["open", "closed", "all"] },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "create_issue",
    description: "Create a new issue",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        title: { type: "string" },
        body: { type: "string" },
        labels: { type: "array", items: { type: "string" } },
      },
      required: ["owner", "repo", "title"],
    },
  },
  {
    name: "create_pull_request",
    description: "Create a pull request",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
        title: { type: "string" },
        body: { type: "string" },
        head: { type: "string" },
        base: { type: "string" },
      },
      required: ["owner", "repo", "title", "head", "base"],
    },
  },
];
```

### File System Access

```typescript
// Secure file system MCP
const allowedPaths = ["/home/user/projects", "/tmp"];

function isPathAllowed(filePath: string): boolean {
  const resolved = path.resolve(filePath);
  return allowedPaths.some((allowed) => resolved.startsWith(allowed));
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "read_file") {
    const { path: filePath } = request.params.arguments;

    if (!isPathAllowed(filePath)) {
      return {
        content: [{ type: "text", text: "Path not allowed" }],
        isError: true,
      };
    }

    const content = await fs.readFile(filePath, "utf-8");
    return {
      content: [{ type: "text", text: content }],
    };
  }
});
```

## Security Best Practices

MCP servers can be powerful - and dangerous. Follow these practices:

### 1. Principle of Least Privilege

Only expose necessary capabilities:

```typescript
// Bad: Full database access
{
  name: "execute_sql",
  description: "Execute any SQL query"
}

// Good: Specific, limited operations
{
  name: "get_user_orders",
  description: "Get orders for a specific user ID"
}
```

### 2. Input Validation

Always validate inputs:

```typescript
import { z } from "zod";

const CreateTaskInput = z.object({
  title: z.string().min(1).max(200),
  assignee: z.string().email().optional(),
  dueDate: z.string().datetime().optional(),
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "create_task") {
    const parsed = CreateTaskInput.safeParse(request.params.arguments);

    if (!parsed.success) {
      return {
        content: [
          { type: "text", text: `Invalid input: ${parsed.error.message}` },
        ],
        isError: true,
      };
    }

    // Use parsed.data safely
  }
});
```

### 3. Authentication

Require authentication for sensitive operations:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const token = request.params._meta?.authToken;

  if (!token || !await validateToken(token)) {
    return {
      content: [{ type: "text", text: "Authentication required" }],
      isError: true,
    };
  }

  // Proceed with authenticated request
});
```

### 4. Audit Logging

Log all tool invocations:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Log before execution
  logger.info("Tool invocation", {
    tool: name,
    arguments: sanitize(args),
    timestamp: new Date().toISOString(),
  });

  try {
    const result = await executeTool(name, args);

    // Log success
    logger.info("Tool success", { tool: name });

    return result;
  } catch (error) {
    // Log failure
    logger.error("Tool failure", { tool: name, error: error.message });
    throw error;
  }
});
```

## The MCP Ecosystem

Existing MCP servers you can use today:

| Server | Purpose | Availability |
|--------|---------|--------------|
| PostgreSQL | Database queries | Official |
| GitHub | Issues, PRs, repos | Official |
| Slack | Messages, channels | Official |
| Filesystem | File operations | Official |
| Puppeteer | Browser automation | Official |
| Brave Search | Web search | Official |
| Google Drive | Document access | Community |
| Notion | Notes and databases | Community |
| Linear | Issue tracking | Community |
| Sentry | Error monitoring | Community |

Find more at [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

## MCP vs Function Calling vs Custom Integrations

| Aspect | MCP | Function Calling | Custom Integration |
|--------|-----|------------------|-------------------|
| Portability | Any MCP host | Model-specific | App-specific |
| Standardization | Protocol spec | Varies by model | None |
| Discovery | Built-in | Manual | Manual |
| Ecosystem | Growing | Mature | None |
| Complexity | Medium | Low | High |
| Best for | Reusable tools | Quick integration | Unique requirements |

Use MCP when:
- You want tools usable across multiple AI systems
- You're building infrastructure for AI agents
- You want to share tools with the community

Use function calling when:
- Quick integration with a specific model
- Simple, app-specific tools
- Maximum performance is critical

## My Take: The Foundation of Agentic AI

In my opinion, MCP is the most important infrastructure development for AI agents since the transformer. The agentic future - AI systems that accomplish tasks autonomously - requires standardized tool access. MCP provides that standard.

Right now, we're in the "early adopter" phase. The protocol is stable, the SDK is mature, but ecosystem adoption is still growing. This is the perfect time to:

1. Build MCP servers for your internal tools
2. Contribute to the open-source ecosystem
3. Learn the patterns that will define agentic development

The teams that invest in MCP infrastructure now will have significant advantages as agentic AI becomes mainstream. You're not just learning a protocol - you're learning the interface layer for human-AI collaboration.

Start building. The agentic future is being defined right now, and MCP is the foundation.
