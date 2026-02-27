# Blackjack - Project Specification

## Overview
A browser-based Blackjack game with authentic casino rules, chip-based betting, and an optional card counting practice mode. Features polished animations, sound effects, and a classic casino aesthetic.

---

## Game Rules

### Deck Configuration
- **6 standard decks** (312 cards)
- Reshuffled when **~75% penetration** reached (234 cards dealt)
- Cards reshuffled automatically between hands when threshold met

### Dealer Rules
- Dealer **stands on all 17s** (including soft 17)
- Dealer peeks for blackjack when showing Ace or 10-value card

### Payouts
| Result | Payout |
|--------|--------|
| Blackjack | 3:2 |
| Standard Win | 1:1 |
| Insurance (dealer BJ) | 2:1 |
| Push | Bet returned |

### Player Options
- **Hit** - Draw another card
- **Stand** - Keep current hand
- **Double Down** - Double bet, receive exactly one card (available on any first two cards)
- **Split** - Split matching cards into two hands (up to 4 hands)
  - Re-splitting aces allowed
  - Double after split allowed
  - Split aces receive only one card each
- **Insurance** - Side bet of half original wager when dealer shows Ace

---

## Bankroll System

### Starting Conditions
- Initial bankroll: **$1,000**
- Displayed prominently on screen

### Chip Denominations
| Chip | Color |
|------|-------|
| $1 | White |
| $5 | Red |
| $25 | Green |
| $100 | Black |
| $500 | Purple |

### Betting
- Click chips to add to bet
- Click bet stack to remove chips
- Minimum bet: $1
- Maximum bet: Current bankroll
- "Clear Bet" and "Rebet" quick actions

### Game Over
- Triggered when bankroll reaches $0
- Display final statistics
- "Play Again" button resets to $1,000

---

## Card Counting Practice Mode

### Toggle
- Switch in options menu: "Practice Mode: ON/OFF"
- When enabled, displays counting HUD

### Hi-Lo System Values
| Cards | Count Value |
|-------|-------------|
| 2, 3, 4, 5, 6 | +1 |
| 7, 8, 9 | 0 |
| 10, J, Q, K, A | -1 |

### Practice HUD Display
- **Running Count** - Current count based on cards seen
- **Deck Penetration** - Visual bar + percentage (cards dealt / total)
- **Counting Accuracy** - Your input vs actual count

### Deviation Alerts
- Highlight when optimal play differs from basic strategy based on count
- Examples:
  - Insurance profitable at true count +3 or higher
  - Stand on 16 vs 10 at count +1 or higher
  - Hit 12 vs 3 at count below +2
- Visual indicator showing recommended deviation

### Count Input (Practice Feature)
- Prompt player to input running count periodically
- Track accuracy percentage over session

---

## User Interface

### Main Game Area
- Casino green felt background (default)
- Dealer area (top) - cards face down then revealed
- Player area (bottom) - active hand(s) highlighted
- Chip tray (bottom) - clickable chip stacks
- Current bet display (center)
- Bankroll display (bottom corner)

### Action Buttons
- Context-sensitive (only show valid actions)
- Hit, Stand, Double, Split, Insurance
- Clear styling with hover states

### Options Menu (Top-Right Dropdown)
Accessible via gear/menu icon:

#### Theme Options
- **Felt Color**: Green (default), Blue, Red, Black
- **Card Back**: Classic Red, Classic Blue, Casino Pattern, Minimalist

#### Sound Options
- **Master Volume**: Slider (0-100%)
- **Sound Effects**: Toggle ON/OFF

#### Game Speed
- **Slow** - Deliberate animations for beginners
- **Normal** - Standard pacing (default)
- **Fast** - Quick animations for experienced players

#### Practice Mode
- **Enable Practice Mode**: Toggle ON/OFF
- **Show Deviation Alerts**: Toggle ON/OFF (when practice mode on)
- **Count Check Frequency**: Every hand / Every 5 hands / Manual

---

## Statistics (Practice Mode)

### Session Statistics Panel
Collapsible panel showing:

#### Performance Stats
- Hands Played
- Wins / Losses / Pushes (with percentages)
- Blackjacks Hit
- Current Win Streak
- Best Win Streak
- Total Profit/Loss

#### Counting Stats (Practice Mode Only)
- Count Checks Attempted
- Correct Count Inputs
- Counting Accuracy Percentage
- Average Deviation from True Count

### Reset Stats Button
- Clears session statistics
- Confirms before clearing

---

## Sound Effects

### Card Sounds
- Card deal (slide/snap)
- Card flip (reveal)
- Shuffle (when decks reset)

### Chip Sounds
- Chip click (adding to bet)
- Chip stack (removing from bet)
- Chips collect (winning)
- Chips slide (losing)

### Game Sounds
- Blackjack fanfare
- Win chime
- Lose tone
- Push neutral sound

---

## Animations

### Card Animations
- Deal from shoe (slide in from right)
- Flip reveal (3D rotation)
- Hit card (quick slide)
- Bust shake effect

### Chip Animations
- Stack building (chips drop)
- Winning collection (slide to bankroll)
- Losing removal (dealer collects)

### UI Animations
- Button hover effects
- Action button pulse (valid moves)
- Count alert fade-in (practice mode)
- Win/loss result display

### Speed Settings
| Setting | Deal Time | Flip Time |
|---------|-----------|-----------|
| Slow | 600ms | 400ms |
| Normal | 300ms | 200ms |
| Fast | 150ms | 100ms |

---

## Technical Requirements

### Structure
- Single `index.html` file (until "separate the code" requested)
- Embedded CSS and JavaScript
- No external dependencies (vanilla JS)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design (desktop-first, tablet-friendly)

### Assets
- Card graphics (CSS-generated or embedded SVG)
- Chip graphics (CSS circles with styling)
- Sound files (Web Audio API or embedded base64)

---

## Game Flow

```
1. Initial Load
   └── Display table with $1,000 bankroll

2. Betting Phase
   ├── Player clicks chips to bet
   ├── "Deal" button activates when bet > $0
   └── Player clicks "Deal"

3. Initial Deal
   ├── Two cards to player (face up)
   ├── Two cards to dealer (one up, one down)
   └── Check for blackjacks

4. Player Turn
   ├── Show available actions
   ├── Player makes decisions
   ├── Repeat until stand or bust
   └── Handle splits as separate hands

5. Dealer Turn
   ├── Reveal hole card
   ├── Dealer hits until 17+
   └── Determine winners

6. Resolution
   ├── Calculate payouts
   ├── Animate chip movements
   ├── Update bankroll
   ├── Update statistics
   └── "Rebet" or "New Bet" options

7. Deck Check
   ├── If penetration >= 75%
   └── Reshuffle all decks (with animation/sound)
```

---

## Future Considerations (Not in Initial Scope)
- Multiplayer support
- Side bets (Perfect Pairs, 21+3)
- Achievement system
- Leaderboards
- Mobile-optimized layout
