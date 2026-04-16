# Science Experiment Generator — Spec

## Overview
A static single-page web app that uses OpenAI's chat completions API to generate
grade-appropriate science experiments from a list of materials the user has on hand.
No server required — opens directly in the browser.

---

## Reference Implementation

The `temp/` folder contains my complete LLM Switchboard project (`index.html`).
This is NOT part of the current project — do not include it in the final build or
deployment.

Use it as a reference for:
- How to parse a `.env` file for API keys (in-memory only)
- The `fetch()` call structure for OpenAI's chat completions API
- Error handling patterns for failed API requests
- How CSS variables, header layout, settings panel, and loading state are structured
- The general approach to building a single-page LLM tool

Ignore these Switchboard features (not needed here):
- Anthropic integration (this project is OpenAI-only)
- The model selection dropdown / provider switching
- Structured output mode and JSON schema handling
- Compare mode, prompt library, schema validator, session metrics dashboard

This project uses unstructured (free-form) responses only.
Render the model's markdown output as formatted HTML.

---

## Deliverable
- **Single file:** `index.html`
- No build step, no dependencies, no server

---

## Core Features

### API Key Setup
- Settings panel (top-right dropdown, per UI standards) contains:
  - Upload `.env` file button — reads key in-memory, never stored or persisted
  - Key status indicator (valid / invalid format)
  - Privacy note matching Switchboard pattern
- `.env` parser looks for `OPENAI_API_KEY=...`

### Form Inputs
| Field | Control | Notes |
|---|---|---|
| Grade Level | Dropdown | K–2, 3–5, 6–8, 9–12 |
| Available Supplies | Textarea | Free-form list; also populated by quick-select |
| Quick-Select Supplies | Tag pills | See list below; clicking a pill appends it to the textarea |

#### Quick-Select Supply List (common household items)
Baking soda, Vinegar, Salt, Sugar, Food coloring, Dish soap, Cornstarch, Flour,
Yeast, Hydrogen peroxide, Rubbing alcohol, Lemon juice, Milk, Eggs, Butter,
Vegetable oil, Coffee filters, Paper towels, Aluminum foil, Plastic wrap,
Ziplock bags, Rubber bands, Paper clips, Toothpicks, Straws, Cotton balls,
Tape, Scissors, Ruler, Magnifying glass, Flashlight, Balloons, String, Yarn,
Cardboard, Tissue paper, Newspaper, Index cards, Sponges, Stopwatch

### Generate Button
- Sends a structured system + user prompt to `gpt-4o` via OpenAI chat completions
- System prompt instructs the model to return a complete, grade-appropriate science
  experiment in markdown, including: title, objective, materials, procedure,
  expected results, and the science behind it
- Difficulty rating (Easy / Medium / Hard) must be included in the response header
- Loading spinner during the request (matches Switchboard pattern)

### Response Rendering
- Model's markdown output is converted to formatted HTML using a lightweight
  in-page markdown renderer (no external library — implement a simple one covering
  `#` headings, `**bold**`, `*italic*`, `-` lists, and `---` rules)
- Difficulty badge displayed above the response (parsed from the model output)
- Copy-to-clipboard button

---

## Extended Features

### 1. Saved Experiments
- After a successful generation, a **Save Experiment** button appears below the
  response
- Saved experiments are stored in `localStorage` (key: `seg_saved`)
- A collapsible **Saved Experiments** panel below the form lists all saved entries,
  showing: title (parsed from response), grade level, date saved
- Each saved entry can be expanded to view the full rendered response, or deleted
- Session limit: unlimited saves (localStorage only)

### 2. Predefined Quick-Select Supplies
- Described above under Form Inputs
- Pills are displayed in a horizontally-wrapping grid below the supplies textarea
- Clicking a pill appends `, [supply]` to the textarea (or just the supply name
  if the field is empty)
- Active state on pill when the supply text appears in the textarea

### 3. Difficulty Rating
- The system prompt explicitly asks the model to begin its response with a line
  such as: `**Difficulty:** Easy` (or Medium / Hard)
- The generator parses this line from the raw response and displays a styled badge
  (green = Easy, yellow = Medium, red = Hard) above the rendered output
- The difficulty line is stripped from the rendered markdown body

---

## Prompt Design

**System message:**
```
You are a science experiment designer for K–12 classrooms. When given a grade level
and a list of available supplies, you generate a single, complete science experiment
that is safe, engaging, and appropriate for that grade level.

Your response must follow this exact format:
**Difficulty:** [Easy | Medium | Hard]

# [Experiment Title]

**Objective:** ...

## Materials
- ...

## Procedure
1. ...

## Expected Results
...

## The Science Behind It
...

Keep the language and complexity appropriate for the grade level specified.
Use only the supplies listed — do not require anything else.
```

**User message:**
```
Grade Level: [selected grade]
Available Supplies: [textarea contents]
```

---

## Visual Design
- Color palette and typography follow the Switchboard exactly (same CSS variables)
- Header: app icon + title "Science Experiment Generator" + settings button
- Main content area: max-width 860px, centered
- Section labels in uppercase muted style (matching Switchboard `.sec-lbl`)
- Responsive: usable on mobile (single-column layout below 640px)

---

## Error Handling
- No API key set → alert + open settings panel
- API key invalid (401) → inline error message below generate button
- Rate limit (429) → inline message with retry suggestion
- Network/other error → generic inline error
- Empty supplies field → alert before sending

---

## Files
```
Science-Experiment-Generator/
├── index.html     (complete app — HTML + CSS + JS)
├── spec.md        (this file)
└── temp/
    └── index.html (LLM Switchboard reference — not part of final build)
```
