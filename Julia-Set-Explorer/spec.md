# Julia Set Explorer

## Overview
An interactive fractal visualization tool for exploring Julia sets, the Mandelbrot set, and the Burning Ship fractal. Features real-time rendering, parameter animation, educational tools, and a split-view mode showing the deep connection between Mandelbrot and Julia sets.

---

## Mathematical Background

### Julia Set
For a complex number c, the Julia set is the boundary of points z₀ in the complex plane where the iteration:
```
zₙ₊₁ = zₙ² + c
```
remains bounded. Each value of c produces a unique Julia set.

### Mandelbrot Set
The Mandelbrot set is the set of complex numbers c for which the iteration starting at z₀ = 0:
```
zₙ₊₁ = zₙ² + c
```
remains bounded. Each point in the Mandelbrot set corresponds to a connected Julia set.

### Burning Ship Fractal
A variation using absolute values:
```
zₙ₊₁ = (|Re(zₙ)| + i|Im(zₙ)|)² + c
```
Produces ship-like structures with a different aesthetic.

---

## Features

### 1. Real-Time Fractal Rendering
- WebGL fragment shader for GPU-accelerated computation
- Configurable maximum iterations (50-2000)
- Smooth coloring using escape-time algorithm with continuous potential
- Anti-aliasing option (2x2, 4x4 supersampling)

### 2. Fractal Types
| Type | Description |
|------|-------------|
| Julia Set | Explore z² + c for fixed c values |
| Mandelbrot Set | The "map" of all Julia sets |
| Burning Ship | Absolute value variant |

### 3. Navigation Controls
- **Mouse wheel**: Zoom in/out centered on cursor
- **Click + drag**: Pan the view
- **Double-click**: Center and zoom on point
- **Reset button**: Return to default view
- Smooth animated transitions between zoom levels

### 4. Color Schemes
Selectable via dropdown:
| Name | Description |
|------|-------------|
| Classic | Blue-black with gold highlights |
| Fire | Black → Red → Orange → Yellow → White |
| Electric | Deep purple → Blue → Cyan → White |
| Monochrome | Black → White gradient |
| Rainbow | Full spectrum HSL cycling |
| Twilight | Purple → Pink → Orange |
| Ocean | Deep blue → Teal → Aqua |
| Custom | User-defined gradient |

### 5. Julia Set Presets
Famous Julia sets with curated c values:

| Name | c Value | Description |
|------|---------|-------------|
| Dendrite | c = i | Tree-like branching structure |
| Douady Rabbit | c = -0.123 + 0.745i | Three-lobed "rabbit" shape |
| San Marco | c = -0.75 | Dragon-like connected set |
| Siegel Disk | c = -0.391 - 0.587i | Contains a Siegel disk |
| Spiral | c = 0.285 + 0.01i | Infinite spiral arms |
| Starfish | c = -0.4 + 0.6i | Five-armed star shape |
| Lightning | c = -0.7 + 0.27015i | Electric discharge pattern |
| Galaxy | c = 0.355 + 0.355i | Spiral galaxy structure |

Each preset includes:
- Thumbnail preview
- Name and c value display
- Brief description
- "Apply" button

### 6. Parameter Controls
Real-time sliders that update the fractal as you drag:
- **Real(c)**: -2.0 to 2.0
- **Imag(c)**: -2.0 to 2.0
- **Max Iterations**: 50 to 2000
- **Escape Radius**: 2 to 100
- **Zoom Level**: Display only (controlled by mouse)

### 7. Parameter Morphing Animation
Smooth animation through c-parameter space:
- Predefined journey paths:
  - "Grand Tour" - visits all preset Julia sets
  - "Spiral Journey" - circular path through c-space
  - "Mandelbrot Edge" - follows the Mandelbrot boundary
- User controls:
  - Play/pause button
  - Speed slider
  - Scrubable progress bar
  - Loop toggle

### 8. Split View: Mandelbrot-Julia Connection
Side-by-side display showing the fundamental connection:
- **Left panel**: Mandelbrot set with crosshair cursor
- **Right panel**: Julia set for the selected c value
- Click anywhere on Mandelbrot to instantly see corresponding Julia set
- Drag on Mandelbrot for real-time Julia set morphing
- Sync zoom levels option
- Each panel has independent zoom/pan

### 9. Custom Color Gradient Editor
Interactive gradient designer:
- Add/remove color stops (2-8 stops)
- Drag stops to reposition
- Color picker for each stop
- Preview strip showing gradient
- Save/load custom gradients (localStorage)
- Import/export gradient as JSON

### 10. Educational Mode: Iteration Visualizer
Visualize the escape behavior of individual points:
- Click any point to see its iteration path
- Display options:
  - **Animated**: Watch z travel step by step
  - **Static lines**: Show complete orbit path
  - **Both**: Animated with trail
- Show iteration count for clicked point
- Color-coded path (early iterations → late iterations)
- Escape indicator when point leaves bounds
- Toggle to show/hide iteration overlay

### 11. Information Panel
Collapsible panel showing:
- Current fractal type and formula
- Active c value (for Julia sets)
- Current zoom level and center coordinates
- Number of iterations at center point
- Mathematical context:
  - What makes this point special
  - Connection to Mandelbrot set
  - Historical notes (Gaston Julia, Benoit Mandelbrot)

### 12. Export Options
- **Quick Save**: Current resolution PNG
- **High-Resolution Export**:
  - Resolution multiplier (2x, 4x, 8x)
  - Progress indicator
  - Format: PNG
- **Export with Metadata**: Embed c value and settings in filename
- **Copy coordinates**: Copy current view parameters to clipboard

---

## UI Layout

### Main Canvas Area
- Full viewport minus controls
- Single fractal view (default) or split view (comparison mode)
- Crosshair cursor showing current position
- Coordinates display in corner (optional)

### Top-Right Dropdown Menu
Tabbed interface matching Turing Pattern Explorer style:

**Tab: Presets**
- Fractal type selector (Julia / Mandelbrot / Burning Ship)
- Scrollable preset gallery with thumbnails
- Preset descriptions on hover

**Tab: Parameters**
- c value sliders (Real and Imaginary)
- Max iterations slider
- Escape radius slider
- Journey controls (play, speed, path selector)

**Tab: View**
- Color scheme selector
- Custom gradient editor button
- Anti-aliasing toggle
- Split view toggle
- Coordinate display toggle

**Tab: Education**
- Iteration visualizer toggle
- Display mode (animated/static/both)
- Animation speed slider
- Clear paths button

**Tab: Export**
- Quick save button
- Resolution multiplier selector
- High-res export button
- Progress bar (when exporting)
- Copy coordinates button

### Bottom Bar (minimal)
- Zoom level display
- Current c value display
- Reset view button
- Info panel toggle

---

## Technical Specifications

### Performance Targets
- 60 FPS for viewport up to 1080p at 500 iterations
- Smooth zoom/pan with no visible lag
- Real-time parameter updates
- Progressive rendering for high iteration counts

### WebGL Implementation
- Fragment shader for fractal computation
- Continuous potential for smooth coloring
- Perturbation theory for deep zooms (stretch goal)
- Double-precision emulation for extreme zoom levels

### Browser Support
- Chrome, Firefox, Safari, Edge (modern versions)
- WebGL 1.0 minimum (WebGL 2.0 preferred)
- Fallback message for unsupported browsers

### File Structure
Single `index.html` containing:
- Embedded vertex/fragment shaders
- CSS styles
- JavaScript rendering logic
- UI components

---

## Initial State
- Fractal type: Julia Set
- c value: Douady Rabbit preset (-0.123 + 0.745i)
- Color scheme: Classic
- Max iterations: 500
- View: Centered at origin, zoom showing full set
- Split view: Off

---

## Stretch Goals
- Deep zoom with perturbation theory
- 3D Julia set visualization
- Video/GIF export of parameter journeys
- Share configuration via URL parameters
- Touch support for mobile devices
- WebGPU renderer for improved performance
- Orbit trap coloring methods
- Newton fractal mode
