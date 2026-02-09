# Turing Pattern Explorer

## Overview
An interactive reaction-diffusion simulation that generates Turing patterns in real-time. Users can explore the parameter space, paint with chemicals, compare simulations side-by-side, and export high-resolution images.

---

## Simulation Models

### Gray-Scott Model
The primary reaction-diffusion system:
```
∂U/∂t = Dᵤ∇²U - UV² + f(1-U)
∂V/∂t = Dᵥ∇²V + UV² - (f+k)V
```
- **U**: Chemical A concentration (substrate)
- **V**: Chemical B concentration (catalyst)
- **Dᵤ, Dᵥ**: Diffusion rates
- **f**: Feed rate (replenishes U)
- **k**: Kill rate (removes V)

### Brusselator Model
Oscillatory reaction-diffusion:
```
∂U/∂t = Dᵤ∇²U + A - (B+1)U + U²V
∂V/∂t = Dᵥ∇²V + BU - U²V
```
- Produces spiral waves and oscillating patterns
- Parameters: A, B control pattern behavior

### Schnakenberg Model
Activator-inhibitor dynamics:
```
∂U/∂t = Dᵤ∇²U + γ(a - U + U²V)
∂V/∂t = Dᵥ∇²V + γ(b - U²V)
```
- Clean spots and stripes
- Parameters: a, b, γ control pattern formation

---

## Features

### 1. Real-Time Simulation
- WebGL compute shaders for GPU-accelerated computation
- Configurable grid resolution (256x256, 512x512, 1024x1024)
- Adjustable simulation speed (steps per frame)
- Pause/play toggle
- Reset (restart with initial conditions)
- Clear (uniform chemical distribution)

### 2. Color Schemes
Selectable via dropdown:
| Name | Description |
|------|-------------|
| Grayscale | Classic black-to-white mapping |
| Heat | Black → Red → Yellow → White |
| Ocean | Deep blue → Cyan → White |
| Toxic | Black → Green → Yellow |
| Sunset | Purple → Orange → Yellow |
| Neon | Dark purple → Pink → Cyan |
| Earth | Brown → Tan → Cream |
| Custom | User-defined gradient (stretch goal) |

### 3. Pattern Presets
Curated parameter combinations with descriptions:

| Name | Model | Parameters | Description |
|------|-------|------------|-------------|
| Mitosis | Gray-Scott | f=0.0367, k=0.0649 | Cell-like division patterns |
| Coral | Gray-Scott | f=0.0545, k=0.062 | Branching coral structures |
| Maze | Gray-Scott | f=0.029, k=0.057 | Labyrinthine pathways |
| Spots | Gray-Scott | f=0.035, k=0.065 | Leopard-like spots |
| Stripes | Gray-Scott | f=0.025, k=0.056 | Zebra-like stripes |
| Worms | Gray-Scott | f=0.054, k=0.063 | Writhing worm patterns |
| Spirals | Brusselator | A=1, B=3 | Rotating spiral waves |
| Oscillation | Brusselator | A=1, B=2.5 | Pulsing regions |
| Clean Spots | Schnakenberg | a=0.1, b=0.9 | Well-defined circular spots |
| Fingerprint | Schnakenberg | a=0.05, b=0.9 | Ridge patterns |

Each preset includes:
- Thumbnail preview
- Pattern name
- Brief scientific description
- "Apply" button

### 4. Parameter Space Diagram
- 2D clickable heatmap (F on x-axis, K on y-axis for Gray-Scott)
- Small preview patterns rendered at grid points
- Current position indicator (crosshair)
- Click anywhere to jump to those parameters
- Drag to scrub through parameter space
- Labeled regions showing pattern types

### 5. Parameter Space Journey
- Animated path through interesting F/K regions
- Smooth interpolation between waypoints
- User controls:
  - Play/pause journey
  - Speed slider
  - Progress bar (scrubble)
- Predefined journey paths:
  - "Grand Tour" - comprehensive exploration
  - "Spots to Stripes" - phase transition
  - "Chaos to Order" - stability journey

### 6. Interactive Brush Tools
- **Paint U**: Add chemical U (substrate)
- **Paint V**: Add chemical V (catalyst)
- **Erase**: Set region to uniform state
- **Perturb**: Add random noise
- Brush settings:
  - Size slider (5px - 100px)
  - Intensity slider (0.1 - 1.0)
  - Soft/hard edge toggle

### 7. Side-by-Side Comparison
- Split view with two independent simulations
- Each side has own:
  - Model selection
  - Parameter controls
  - Color scheme
- Shared:
  - Speed controls
  - Drawing tools (affect both or selected)
- "Sync" button to copy parameters between sides
- "Swap" button to exchange configurations

### 8. Information Panel
Collapsible panel showing:
- Current model name and equations
- Active parameters with values
- Pattern type classification (if recognizable)
- Scientific context:
  - What causes this pattern
  - Where it appears in nature
  - Historical notes (Turing's 1952 paper)

### 9. Export Options
- **Quick Save**: Current resolution PNG
- **High-Resolution Export**:
  - Resolution selector (2x, 4x, 8x current)
  - Format: PNG
  - Renders offscreen at target resolution
  - Progress indicator for large exports
- **Export with Metadata**: Include parameters in filename

---

## UI Layout

### Main Canvas Area
- Full viewport minus controls
- Centered simulation display
- Side-by-side mode splits horizontally

### Top-Right Dropdown Menu
Tabbed interface:

**Tab: Presets**
- Model selector (Gray-Scott / Brusselator / Schnakenberg)
- Scrollable preset gallery with thumbnails
- Preset descriptions on hover/click

**Tab: Parameters**
- Parameter sliders with value displays
- Clickable parameter space diagram
- Journey controls (play, speed, path selector)

**Tab: Tools**
- Brush type selector (Paint U / Paint V / Erase / Perturb)
- Brush size slider
- Brush intensity slider
- Edge type toggle

**Tab: View**
- Color scheme selector
- Resolution selector
- Comparison mode toggle
- Grid overlay toggle (optional)

**Tab: Export**
- Quick save button
- Resolution multiplier selector
- High-res export button
- Progress bar (when exporting)

### Bottom Bar (minimal)
- Play/Pause button
- Speed slider
- Reset / Clear buttons
- Info panel toggle

---

## Technical Specifications

### Performance Targets
- 60 FPS at 512x512 resolution
- 30+ FPS at 1024x1024 resolution
- Responsive interaction (< 16ms input latency)

### WebGL Implementation
- Fragment shaders for reaction-diffusion computation
- Ping-pong framebuffer technique
- Separate render pass for visualization
- Offscreen framebuffer for high-res export

### Browser Support
- Chrome, Firefox, Safari, Edge (modern versions)
- WebGL 2.0 required
- Fallback message for unsupported browsers

### File Structure
Single `index.html` containing:
- Embedded vertex/fragment shaders
- CSS styles
- JavaScript simulation logic
- UI components

---

## Initial State
- Model: Gray-Scott
- Parameters: Coral preset (f=0.0545, k=0.062)
- Color scheme: Ocean
- Resolution: 512x512
- Small random seed pattern in center
- Simulation running

---

## Stretch Goals
- Custom color gradient editor
- Record simulation as video/GIF
- Share configuration via URL parameters
- Touch support for mobile devices
- Multiple seed pattern shapes (circle, square, custom drawing)
- Sound reactivity mode
