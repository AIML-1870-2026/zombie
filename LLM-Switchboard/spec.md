# LLM Switchboard — Spec

## Overview
A single-page web app for interacting with OpenAI and Anthropic language models through their
APIs. Supports free-form and JSON-structured output modes, key management via paste or file
upload, and a tabbed response history.

## Architecture
- Single `index.html` file. No backend. All state in JS memory.
- Keys cleared on tab close; never written to localStorage or transmitted anywhere except
  the selected provider's API endpoint.

---

## Features

### API Key Handling
- **Manual entry** — password input in settings dropdown
- **File upload** — parses `.env` (`OPENAI_API_KEY=`, `ANTHROPIC_API_KEY=`) and CSV formats
- Keys stored in a JS `state` object only
- Privacy notice displayed in the settings panel

### Provider & Model Selection
Settings dropdown (top-right corner, per UI standards):
- Provider toggle: OpenAI / Anthropic
- OpenAI models: `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`
- Anthropic models: `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`

### Anthropic CORS Limitation
Anthropic's API blocks direct browser requests. When Anthropic is selected:
- Inline warning banner in the main content area
- Collapsible proxy setup code snippet
- Request still attempted; CORS failure surfaces a specific friendly message

### Dual Output Modes
Toggle between:
- **Unstructured** — free-form text via chat completions
- **Structured JSON** — response constrained to a user-defined JSON schema
  - OpenAI: `response_format.json_schema`
  - Anthropic: `tools` + `tool_choice` (works if request reaches server via proxy)

### Example Prompts
5 pre-loaded AI/ML prompts:
1. Transformer vs. RNN architectural trade-offs
2. Attention mechanisms explained by analogy
3. Modeling strategy for a tabular classification dataset
4. Fine-tuning a large language model on domain data
5. Emergent capabilities and the scaling debate

### Schema Templates
4 presets for structured mode:
1. **Entity Extraction** — array of `{name, type, context}`
2. **Sentiment Classification** — sentiment enum, confidence score, reasoning
3. **Structured Summary** — title, summary, key_points, tags, reading_level
4. **Custom** — minimal blank template

Raw JSON editor with real-time parse validation.

### Side-by-Side Comparison (Compare mode)
Third mode on the toolbar. Two model selectors (left/right) drawn from all providers. Both
requests fire simultaneously via `Promise.allSettled`. Results displayed in a two-column grid.
Each column shows its own model badge, token count, and character count.

### Response Metrics
Every response card shows a metrics bar:
- Response time (ms or seconds)
- Token count broken down as `prompt in / completion out`
- Character count of the response

### Prompt Library
In-memory collection of saved prompts (and optionally schemas). Accessible via "Library" and
"+ Save" buttons in the prompt section header. Search by name or content. Load restores the
prompt (and schema if saved). Persists for the session lifetime only.

### Structured Output Validator
After receiving a structured JSON response, a collapsible "Schema Compliance" panel shows a
per-field report card:
- ✓ field present with correct type
- ✗ required field missing
- ⚠ wrong type or enum value
- + unexpected field not in schema
- ○ optional field absent

Summary line: "N/N required fields valid" or specific failure count.

### Session Metrics Dashboard
Collapsible panel at the bottom showing aggregate stats:
- Total requests, avg response time, total time, total tokens, avg tokens/request, saved prompt count

### Response History
- Last 10 responses stored in memory
- Tabbed navigation with prompt preview as tab label
- Each card: model badge, mode badge, timestamp, prompt preview, response body
- Copy button per response
- JSON syntax highlighting for structured responses
- Clear all button

### Error Handling
| Scenario | Behavior |
|---|---|
| No API key | Alert + open settings panel |
| Invalid key (401) | Friendly error in response card |
| Rate limit (429) | Retry suggestion in response card |
| CORS (Anthropic) | Specific CORS explanation in response card |
| Bad schema | Send blocked, inline validation error |
| Other HTTP errors | Message from API surfaced in response card |

---

## UI
- Dark theme (`#0f0f13` background, `#6e56cf` accent)
- Settings in top-right dropdown (provider indicator dot, model name)
- Max content width: 860px, centered
- Responsive down to mobile
