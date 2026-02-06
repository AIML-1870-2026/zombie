# Boids Swarm Simulation - Specification

## Overview
An interactive boids flocking simulation implementing Craig Reynolds' classic algorithm with extensive customization, performance optimizations, and visual polish. Built as a single-page web application using Canvas 2D rendering and Web Workers for smooth performance at 1000+ boids.

---

## Core Simulation

### Boid Behavior Rules
Each boid applies three steering forces every frame:

1. **Separation** - Steer away from nearby flockmates to avoid crowding
2. **Alignment** - Steer toward the average heading of nearby flockmates
3. **Cohesion** - Steer toward the average position of nearby flockmates

### Physics Model
- Position updated via velocity integration
- Velocity clamped to max speed
- Steering forces clamped to max force
- Delta-time based updates for frame-rate independence

---

## User Controls

### Parameter Sliders
All sliders located in top-right dropdown menu with labels and tooltips.

| Parameter | Range | Default | Tooltip |
|-----------|-------|---------|---------|
| Separation Weight | 0 - 5 | 1.5 | How strongly boids avoid crowding neighbors |
| Alignment Weight | 0 - 5 | 1.0 | How strongly boids match neighbor direction |
| Cohesion Weight | 0 - 5 | 1.0 | How strongly boids move toward flock center |
| Neighbor Radius | 20 - 200 | 50 | Distance to detect nearby boids (pixels) |
| Max Speed | 1 - 10 | 4 | Maximum boid velocity |
| Max Force | 0.1 - 1 | 0.3 | Maximum steering force per frame |
| Boid Count | 50 - 2000 | 300 | Number of boids in simulation |

### Behavior Presets
Three buttons that instantly apply parameter configurations:

**Schooling**
- Separation: 1.0
- Alignment: 2.5
- Cohesion: 1.5
- Neighbor Radius: 75
- Max Speed: 3
- Description: "Fish-like coordinated movement"

**Chaotic Swarm**
- Separation: 2.0
- Alignment: 0.3
- Cohesion: 0.3
- Neighbor Radius: 30
- Max Speed: 6
- Description: "Erratic insect-like behavior"

**Tight Cluster**
- Separation: 1.2
- Alignment: 1.0
- Cohesion: 3.0
- Neighbor Radius: 100
- Max Speed: 2
- Description: "Dense flock formation"

### Playback Controls
- **Pause/Resume** button (also: Spacebar)
- **Reset** button (also: R key) - Randomize boid positions/velocities
- **Speed multiplier** slider (0.25x - 3x)

---

## Instrumentation

### On-Screen Stats (Bottom-Left Overlay)
- **FPS** - Frames per second (updated every 500ms)
- **Boid Count** - Current number of active boids
- **Average Speed** - Mean velocity magnitude across all boids
- **Average Neighbors** - Mean neighbor count per boid

### Live Chart
Custom-built chart below stats panel displaying real-time metrics:
- Line graph with rolling 60-second window
- Tracks: Average neighbors, Speed variance, Flock compactness
- Toggle visibility of each metric
- Minimal, non-intrusive design

---

## Boundary Behavior

### Modes (Toggle Switch)
- **Wrap** (default) - Boids exiting one edge appear on opposite edge
- **Bounce** - Boids reflect off edges with velocity inversion

### Visual Indicator
- Subtle border glow indicates current mode
- Blue = Wrap, Orange = Bounce

---

## Advanced Features (Toggleable)

### 1. Perception Cone
- **Toggle**: On/Off
- **FOV Slider**: 90° - 360° (default 270°)
- When enabled, boids only detect neighbors within forward field-of-view
- Visual debug option to show perception cones

### 2. Obstacle Avoidance
- **Toggle**: On/Off
- Circular obstacles placed on canvas
- Boids steer around obstacles using predictive avoidance
- Right-click + drag to paint obstacles
- Double-right-click to clear all obstacles
- Obstacle radius slider: 10 - 100px

### 3. Leaders / Predators
- **Mode Select**: None / Leader / Predator / Both
- **Leader**: Golden boid that others follow (adds seek behavior)
- **Predator**: Red boid that others flee (adds flee behavior)
- Click on canvas with mode active to place/move leader/predator
- Leader/predator follow mouse when held

### 4. Heterogeneous Species
- **Toggle**: On/Off
- When enabled, splits boids into two flocks (Species A & B)
- Each species has independent parameter sets
- **Inter-flock sliders**:
  - Cross-species separation (0 - 5)
  - Cross-species cohesion (0 - 5)
- Visual: Species A = Blue tones, Species B = Green tones

### 5. Spatial Partitioning
- **Toggle**: On/Off (default: On)
- Uniform grid divides canvas into cells
- Only checks neighbors in adjacent cells
- Reduces complexity from O(n²) to ~O(n)
- Debug overlay shows grid and cell populations
- Performance comparison display when toggled

---

## Performance Architecture

### Web Worker
- All physics calculations run in dedicated Web Worker
- Main thread handles rendering and UI only
- Message protocol:
  ```
  Main → Worker: { type: 'update', params, deltaTime }
  Worker → Main: { type: 'positions', boids: [...] }
  Main → Worker: { type: 'config', settings }
  ```

### Rendering Optimizations
- Batch draw calls (single path for all boids)
- Avoid creating objects in render loop
- Use typed arrays for position data transfer
- RequestAnimationFrame with delta time tracking

### Target Performance
- 60 FPS with 500 boids (no spatial partitioning)
- 60 FPS with 1500+ boids (with spatial partitioning)
- Graceful degradation at higher counts

---

## Interaction Features

### Mouse Controls
| Action | Effect |
|--------|--------|
| Left-click | Spawn 10 boids at cursor (toggleable) |
| Shift + Left-click | Spawn 50 boids at cursor (toggleable) |
| Right-click + drag | Paint circular obstacles |
| Double-right-click | Clear all obstacles |
| Shift + hover | Attract nearby boids to cursor |
| Ctrl + hover | Repel nearby boids from cursor |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Space | Pause / Resume |
| R | Reset simulation |
| 1 | Apply Schooling preset |
| 2 | Apply Chaotic Swarm preset |
| 3 | Apply Tight Cluster preset |
| G | Toggle grid debug overlay |
| T | Toggle trails |
| D | Toggle dark/light theme |

---

## Visual Features

### Motion Trails
- **Toggle**: On/Off
- **Trail Length Slider**: 5 - 50 frames
- Trails fade from full opacity to transparent
- Color matches boid color
- Performance-conscious implementation (limited history)

### Themes
Four visual themes accessible via dropdown:

**Light (Default)**
- Background: #f5f5f5
- Boids: #2c3e50
- Obstacles: #e74c3c

**Dark**
- Background: #1a1a2e
- Boids: #eaf6ff
- Obstacles: #ff6b6b

**Neon**
- Background: #0d0d0d
- Boids: #00ff88 (with glow effect)
- Obstacles: #ff00ff

**Nature**
- Background: #e8f5e9
- Boids: #33691e
- Obstacles: #795548

### Boid Appearance
- Triangle shape pointing in velocity direction
- Size: 8px base, 12px height (adjustable)
- Leader: 1.5x size, golden color, subtle glow
- Predator: 1.3x size, red color, sharp edges

---

## Preset Export/Import

### Export
- "Export" button generates JSON of current configuration
- All parameters, toggles, and visual settings included
- Copies shareable URL with query string to clipboard
- Format: `?preset=BASE64_ENCODED_JSON`

### Import
- On page load, check for `preset` query parameter
- If present, decode and apply configuration
- "Import" button opens text field for JSON paste
- Validation with error feedback

### Saved Data Structure
```json
{
  "version": 1,
  "params": {
    "separation": 1.5,
    "alignment": 1.0,
    "cohesion": 1.0,
    "neighborRadius": 50,
    "maxSpeed": 4,
    "maxForce": 0.3,
    "boidCount": 300
  },
  "features": {
    "perceptionCone": false,
    "fov": 270,
    "obstacles": false,
    "leaderMode": "none",
    "heterogeneous": false,
    "spatialPartitioning": true
  },
  "visual": {
    "theme": "dark",
    "trails": false,
    "trailLength": 20,
    "boundaryMode": "wrap"
  }
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│                                              [≡ Menu ▼] │
│                                                         │
│                                                         │
│                     CANVAS                              │
│                  (Full viewport)                        │
│                                                         │
│                                                         │
│ ┌──────────────┐                                        │
│ │ FPS: 60      │                                        │
│ │ Boids: 300   │                                        │
│ │ Avg Spd: 3.2 │                                        │
│ │ Avg Nbrs: 12 │                                        │
│ │ ┌──────────┐ │                                        │
│ │ │ [chart]  │ │                                        │
│ │ └──────────┘ │                                        │
│ └──────────────┘                                        │
└─────────────────────────────────────────────────────────┘
```

### Menu Dropdown Structure
```
≡ Menu
├── Simulation
│   ├── [Pause/Resume]
│   ├── [Reset]
│   └── Speed: [====slider====]
├── Parameters
│   ├── Separation: [====slider====]
│   ├── Alignment: [====slider====]
│   ├── Cohesion: [====slider====]
│   ├── Neighbor Radius: [====slider====]
│   ├── Max Speed: [====slider====]
│   ├── Max Force: [====slider====]
│   └── Boid Count: [====slider====]
├── Presets
│   ├── [Schooling]
│   ├── [Chaotic Swarm]
│   └── [Tight Cluster]
├── Features
│   ├── [ ] Perception Cone → FOV slider
│   ├── [ ] Obstacles → Radius slider
│   ├── Leader/Predator: [dropdown]
│   ├── [ ] Two Species → Cross-species sliders
│   ├── [x] Spatial Partitioning
│   └── [x] Click to Spawn
├── Visuals
│   ├── Theme: [dropdown]
│   ├── [ ] Trails → Length slider
│   ├── Boundary: [Wrap|Bounce]
│   └── [ ] Debug Overlays
└── Data
    ├── [Export Preset]
    └── [Import Preset]
```

---

## File Structure

Single HTML file containing:
- Inline CSS (scoped styles)
- Inline JavaScript (main thread code)
- Inline Web Worker (as Blob URL)

If "Separate the code" is requested later:
```
Boids-Swarm-Simulation/
├── index.html
├── styles.css
├── script.js
├── worker.js
├── chart.js
└── spec.md
```

---

## Browser Support
- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

Requires:
- Canvas 2D
- Web Workers
- ES6+ features

---

## Implementation Phases

### Phase 1: Core Simulation
- Basic boid class and three rules
- Canvas rendering
- Parameter sliders
- Wrap boundary

### Phase 2: Controls & Presets
- Full UI dropdown menu
- All parameter controls
- Three presets
- Pause/Reset/Speed controls

### Phase 3: Instrumentation
- Stats overlay
- FPS counter
- Custom live chart

### Phase 4: Advanced Features
- Perception cone
- Obstacle avoidance
- Leaders/predators
- Two species mode

### Phase 5: Performance
- Web Worker integration
- Spatial partitioning
- Performance testing

### Phase 6: Polish
- Mouse interactions
- Trails
- Themes
- Export/Import
- Keyboard shortcuts

---

## Success Criteria
- [ ] All five core parameters adjustable via sliders
- [ ] Three presets instantly change behavior
- [ ] Stats display updates in real-time
- [ ] Live chart shows rolling metrics
- [ ] All six advanced features toggleable
- [ ] 60 FPS maintained with 1000 boids (spatial partitioning on)
- [ ] Mouse attract/repel works smoothly
- [ ] Presets exportable as shareable URLs
- [ ] Four themes fully implemented
- [ ] Trails render without major performance impact
