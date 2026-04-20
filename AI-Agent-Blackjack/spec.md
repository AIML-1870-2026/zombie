# AI Agent Blackjack - Project Specification

## Overview
A browser-based Blackjack game where an LLM AI agent reads the game state and recommends
actions (hit/stand/double). The user can verify the recommendation and execute it. The agent
returns structured JSON so the action is extracted reliably — no keyword parsing ambiguity.

---

## Reference: temp/ Folder

The `temp/` folder contains a working example of a static webpage that interacts with an LLM
via an uploaded `.env` file. Use it as a reference for:
- How to parse a `.env` file for the API key (in-memory only)
- The fetch() call structure for the LLM API
- Error handling patterns for failed API requests

**Do NOT include the `temp/` folder in the final build or deployment.**

---

## API Key Handling

- User uploads a `.env` file containing `ANTHROPIC_API_KEY=sk-ant-...`
- File is read with the FileReader API, parsed in-memory, and discarded
- Key is never stored in localStorage, sessionStorage, or any persistent store
- Key is only used as a header value in the Anthropic API fetch() call
- Console logs confirm key loaded (first 8 chars only, rest masked)

---

## Game Engine

### Deck
- 6 standard decks (312 cards)
- Reshuffle when ~75% penetration reached (234 cards dealt)
- Fisher-Yates shuffle

### Scoring
- Number cards: face value
- Jack, Queen, King: 10
- Ace: 11 unless it causes bust, then 1
- Soft hand detection (Ace counted as 11)

### Dealer Rules
- Dealer stands on all 17s (including soft 17)
- Dealer hole card revealed after player turn

### Player Options
- **Hit** — draw a card
- **Stand** — end turn
- **Double Down** — double bet, receive exactly one more card (first two cards only)

### Payouts
| Result | Payout |
|--------|--------|
| Blackjack | 3:2 |
| Win | 1:1 |
| Push | Bet returned |

### Balance
- Starting balance: $500
- Fixed bet: $25 per hand (configurable via options menu)
- Balance updated after each hand resolves
- Game over at $0

---

## AI Agent

### Trigger
- After the initial deal, agent is called automatically
- Receives: player hand (cards + total), dealer up-card, is-soft-hand flag

### LLM Prompt
Structured prompt specifying the game state and requesting a JSON response:
```
You are a Blackjack AI agent. Given the game state below, respond with ONLY valid JSON.
Game state: { playerCards, playerTotal, isSoft, dealerUpCard, balance, bet }
Respond: { "action": "hit"|"stand"|"double", "reasoning": "...", "confidence": 0-100 }
```

### Response Parsing
- Parse JSON directly — no keyword search
- Fall back gracefully if JSON is malformed (log error, prompt user to retry)

### Execute Recommendation Flow
1. Agent recommendation displayed (action + reasoning + confidence)
2. Basic strategy "book" recommendation computed client-side
3. UI shows whether agent matches book strategy
4. User clicks **Execute Recommendation** button
5. Action is taken, hand resolves, balance updates
6. All steps logged to console

---

## Console Logging

Key events logged throughout:
- `[DECK]` Shuffle events, penetration %
- `[DEAL]` Cards dealt to player and dealer
- `[AGENT]` Game state sent to LLM, raw response, parsed action
- `[ACTION]` Action executed, result (win/loss/push), payout
- `[BALANCE]` Balance before/after each hand

---

## Enhancements

### 1. Strategy Visualization
- Color-coded matrix: player total (8–21) vs dealer up-card (2–A)
- Each cell shows recommended basic strategy action (H/S/D)
- Current hand highlighted in the matrix
- Agent's recommendation highlighted — green if it matches book, yellow if it deviates

### 2. Performance Analytics
- Session stats panel (collapsible):
  - Hands played, wins, losses, pushes (with percentages)
  - Net profit/loss, peak balance, low balance
  - Agent accuracy: % of hands where agent matched basic strategy
  - Win rate when agent followed vs deviated from basic strategy
- Mini sparkline chart tracking balance over time (canvas-based)

---

## UI Layout

### Top Bar
- Title: "AI Agent Blackjack"
- Balance display (left)
- API key status indicator (right)

### Options Menu (Top-Right Dropdown)
- Upload .env file
- Bet size selector ($5 / $10 / $25 / $50 / $100)
- Explanation detail: Brief / Standard / In-Depth
- Reset session

### Main Table (Center)
- Casino green felt
- Dealer area (top): cards, hand total
- Player area (bottom): cards, hand total, soft indicator
- Action buttons: Hit, Stand, Double (context-sensitive)

### Agent Panel (Right Side)
- Recommended action (large, color-coded)
- Reasoning text
- Confidence meter
- Book strategy comparison
- **Execute Recommendation** button

### Strategy Matrix (Below Table)
- Toggleable via button
- Current hand cell highlighted

### Analytics Panel (Bottom, Collapsible)
- Stats grid + sparkline chart

---

## Technical

- Single `index.html` file (CSS and JS inline unless "separate the code" requested)
- No external dependencies — vanilla JS, CSS, Canvas API
- Anthropic API endpoint: `https://api.anthropic.com/v1/messages`
- Model: `claude-haiku-4-5-20251001` (fast, cost-effective for game loop)
- Browser support: Chrome, Firefox, Safari, Edge (modern)

---

## File Structure

```
AI-Agent-Blackjack/
├── index.html       (main project — single file)
├── spec.md          (this file)
└── temp/
    └── index.html   (dev reference only — .env + LLM demo)
```

---

## Deployment Notes
- `temp/` folder excluded from zombie/ deployment
- No sensitive data in source code
- API key only ever in memory during session
