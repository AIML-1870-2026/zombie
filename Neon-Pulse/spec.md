# Neon Pulse - Rhythm Runner

## Overview
An endless runner where obstacles spawn synchronized to music beats. Players must time their jumps to the rhythm for maximum points. Synthwave aesthetic with heavy visual juice.

## Core Gameplay

### Movement
- Auto-scrolling runner
- Jump on SPACE/tap - player does a full spin while airborne
- Double-jump available in air (tap again)
- Squash/stretch animation on jump and land

### Rhythm System
- 128 BPM beat-synced gameplay
- Hit zone line at player position shows timing
- Timing windows:
  - PERFECT: ±100ms (100 pts × combo) - hit zone turns GOLD
  - GOOD: ±180ms (50 pts × combo) - hit zone turns GREEN
  - MISS: 0 pts, reset combo, lose 1 health

### Obstacle Types
1. **Ground Spikes** (red) - Single jump to clear, spawn on-beat
2. **Air Obstacles** (cyan floating diamonds) - High position REQUIRES double jump
   - Positioned at Y where single jump peak cannot reach
   - Must jump then double-jump to clear
   - Bob up and down with pulsing ring effect
3. **Off-beat Spikes** (orange) - Spawn between beats for variety
   - Appear after 15 seconds of gameplay
   - Test player's off-rhythm awareness

### Pattern System
Game uses rotating rhythmic patterns to prevent repetition:
- Pattern 1: Beats 1 and 3
- Pattern 2: Beats 1 and 4 (syncopated)
- Pattern 3: Beats 1 and 2 (double)
- Pattern 4: Beats 1, 3, 4 (triple)
- Pattern 5: Beats 2 and 4 (off-beat)
- Pattern 6: Extended 8-beat pattern

Patterns change every 16 beats for variety.

### Scoring
- Base points from timing accuracy
- Combo multiplier: 1x → 2x → 3x → 4x (max)
- Builds every 5 consecutive perfect/good hits
- Best combo tracked separately

### Health System
- 3 hearts/lives
- Lose 1 on collision/miss
- Game over at 0 health

## Visual Design

### Player Animation
- Diamond shape that SPINS during jump (full 360° rotation)
- Additional spin on double jump
- Squash on anticipation, stretch on launch
- Landing squash with particle burst
- Trail follows player rotation
- Color changes with multiplier level

### Hit Zone
- Vertical line at player X position
- Color-coded timing feedback:
  - Cyan (default)
  - Green (good window)
  - Gold (perfect window)
- Pulses with the beat

### Obstacle Visuals
- **Ground spikes**: Red triangles with glow
- **Air obstacles**: Cyan diamonds that bob and pulse
- **Off-beat spikes**: Orange triangles

### Effects
- Screen shake on miss
- Chromatic aberration on high combo
- Colored particle explosions
- Screen-wide magenta pulse on every beat
- Grid pulses with the music

## Audio

### Music (128 BPM)
- Procedural beat generation
- Kick on primary beats
- Hi-hat on even beats
- Bass unlocks at 2x combo
- Synth arpeggios at 3x combo

### Sound Effects
- Jump: Ascending whoosh
- Double jump: Higher pitched whoosh
- Perfect: Three-tone chime
- Good: Soft confirmation
- Miss: Low thud
- Combo up: Ascending fanfare

## Progression

### Speed
- Gradual increase over 50 seconds
- Cap at 1.7x base speed

### Difficulty Curve
- 0-15s: Ground spikes only, basic patterns
- 15s+: Off-beat spikes begin appearing
- 25s+: Air obstacles (double jump) introduced
- Patterns rotate every 16 beats

## Technical

### Implementation
- Single HTML file
- Canvas rendering
- Web Audio API
- 60fps game loop

### Controls
- Space/Click/Touch: Jump / Double jump
- M: Mute toggle
