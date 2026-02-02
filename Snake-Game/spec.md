# Snake Game Specification

## Overview
A retro-style snake game with multiple game modes, power-ups, opponent snakes, custom maps, and dynamic color schemes.

## Core Gameplay

### Grid
- Default 32x32 playing field (customizable in level designer: 16-64)
- Standard game has walls on all edges by default
- Custom maps: edge behavior determined by obstacles (wall on edge = death, no wall = wrap)

### Controls
- Player 1: WASD keys (W, A, S, D)
- Player 2: Arrow keys (Up, Down, Left, Right)
- Single player modes accept both control schemes

### Snake
- Starting length: 3 segments
- Grows by eating food
- Dies on wall/obstacle collision, self-collision, or running into opponent snakes

### Scoring
- Apple-based scoring: base points = current snake length
- Each active power-up adds 10 points per apple
- 2x Multiplier: adds its +10, then doubles the total apple score
- Separate high score lists (top 5 each): Classic, Power-Up Easy, Power-Up Medium, Power-Up Hard
- No high scores for Two Player mode (resets on page refresh)

## Color System
- Random color scheme generated on game start and each death
- Background uses complementary/opposite color from snake (e.g., red bg → green snake)
- Food uses a distinct color (90° hue offset from snake, brighter for visibility)
- Obstacles are always black
- Power-ups have their own fixed colors (consistent across all schemes)
- Player 2 uses a different hue from Player 1

## Game Modes

### Classic Mode
- Basic snake gameplay
- No power-ups or enemy snakes
- Can load custom maps

### Power-Up Mode
- Power-ups spawn every 5 apples eaten
- Power-ups last 5 seconds when collected
- Each active power-up spawns an opponent snake
- Can load custom maps

### Two Player Mode
- Player 1: WASD (spawns above center, moving left)
- Player 2: Arrow keys (spawns below center, moving right)
- Win condition: Last snake standing
- Optional toggle: Enable/disable power-ups (includes enemy snakes)
- Can load custom maps

### Random Maze Mode
- Random obstacle layout generated each game
- Works with any other mode settings
- Obstacles kill on contact like walls

## Power-ups (Power-Up Mode only)

### Mechanics
- Spawn every 5 apples eaten
- Last 20 seconds when collected
- Only one of each power-up type can exist on the map at a time
- Cannot pick up the same power-up type twice in a row
- If all 8 power-up types are already on the map, no new power-up spawns
- Each active power-up spawns an opponent snake
- **Special: All Power-Ups Active** - If player has all 6 timed power-ups active simultaneously, all enemy snakes transform into apples

### Types (Timed - 20 seconds)
1. **Speed Boost** - Faster movement speed
2. **Slow Motion** - Slower movement speed
3. **Shield** - Survive one collision (wall, self, or opponent)
4. **Score Multiplier** - 2x points while active
5. **Ghost Mode** - Pass through yourself (no self-collision)
6. **Wrap** - Pass through walls (appear on opposite side)

### Types (Instant)
7. **Shrink** - Remove tail segments (immediate effect)
8. **Timer Refresh** - Reset all active power-up timers and double their duration (immediate effect)

## Opponent Snakes

### Behavior
- Spawned when a power-up becomes active (Power-Up Mode only)
- Length based on AI difficulty: Easy=3, Medium=4, Hard=5 segments (fixed length)
- Move at standard player speed (unaffected by player's speed power-ups)
- Spawn at least 8 tiles away from any player's head

### AI Difficulty
- **Easy**: 3 segments, random movement with occasional direction changes (15% chance per move)
- **Medium**: 4 segments, always follows the player's head position directly
- **Hard**: 5 segments, randomly switches between 5 targeting modes every 1 second: head, 3 tiles ahead, left side of head, right side of head, or random

### Collision Rules
- Opponents cannot kill each other
- Opponent runs into any part of player's body → Opponent dies
- Player runs into opponent → Player dies (excluding tail segment which moves away)
- Tail collision exemption: Player can safely move into their own tail or enemy tail position since it moves that same frame

## Map System

### Hex Encoding
- Map code format: `[size]:[hex_data]` (e.g., `32:00FF00AA...`)
- Each hex digit represents 4 cells (0=empty, 1=obstacle)
- Hex length = ceil(size² / 4)
- For sizes not divisible by 4: last hex digit is padded (extra bits ignored on decode)
- Read left-to-right, top-to-bottom
- Legacy format (256 hex chars, no size prefix) assumes 32x32

### Edge Wrapping
- Standard game (no custom map): walls on all edges by default
- Custom maps: edge behavior determined by obstacles
  - Wall on edge = death
  - No wall on edge = wrap to opposite side

### Level Designer
- Adjustable grid size (16-64, default 32)
- Click and drag to toggle obstacles (drag to paint/erase)
- Spawn protection zone in center (cannot place obstacles)
- Generates hex code with size prefix for sharing
- Input field to load hex codes
- Universal: designed maps work with any game mode

### Spawn Protection
- Center area of map is protected from obstacles
- Prevents instant death on spawn
- Applies to both level designer and random maze generation
- Protection radius scales with map size

## UI Elements

### Start Menu
- Game mode selection (Classic, Power-Up, Two Player, Random Maze)
- Power-ups toggle (for Two Player mode)
- AI difficulty selector (for modes with opponent snakes)
- Map code input field
- Level Designer button

### In-Game
- Score display
- Active power-ups with timers (Power-Up mode)
- High score list (top 5)

### Game Over
- Final score display
- Restart button
- Return to menu button

## Technical
- Single HTML file
- Canvas-based rendering
- Retro visual style
