# 🚀 Autoflow

> ✨ AI-Powered Prompt-to-Automation Platform — Like Cursor, but for Automation.

Autoflow is a developer tool and workflow assistant that lets users create, edit, and manage complex **automations using natural language prompts** — powered by AI, and executed by `n8n` under the hood. Inspired by tools like Cursor and LangChain, Autoflow is focused on **transparency, control**, and **agentic automation**.

---

## 🎯 Vision

Build automations like you write ideas — just describe what you want to happen. Autoflow translates natural language into real, working automations using AI, with **editability, traceability**, and **explainability** at every step.

---

## 💡 Features (v1 Roadmap)

- 🧠 **Prompt → Workflow**: Turn a single-line prompt into a working `n8n` flow.
- ✏️ **AI-Driven Editing**: Update and refactor existing workflows using AI prompts.
- 🔍 **Transparent Changes**: View before/after diffs for all AI-generated modifications.
- 🧪 **Validation & Simulation**: Run dry-test workflows before activation.
- 💾 **Workflow Library**: Save, manage, and clone automations from your dashboard.
- 📤 **Export / Share**: Download n8n JSON or share editable links.

---

## ⚙️ Tech Stack

| Layer         | Tech                              |
|---------------|------------------------------------|
| Frontend      | Next.js + Tailwind + ShadCN UI     |
| Backend       | Node.js + tRPC / FastAPI           |
| AI Layer      | OpenAI GPT-4 / Claude / Mistral    |
| Workflow Core | n8n (forked or via API)            |
| Database      | Supabase / PostgreSQL              |
| Auth          | Supabase / Clerk.dev               |
| Hosting       | Vercel / Railway / Fly.io          |

---

## 🧪 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/autoflow.git
cd autoflow

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm dev
