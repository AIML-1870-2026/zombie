# Stellar Web

## Overview
A 3D visualization of floating nodes in space that dynamically form edges when within proximity of each other. Nodes drift freely without physical forces—edges are purely visual connections based on distance.

## Core Features

### 3D Node System
- Nodes float in a bounded 3D space
- No physics/forces between nodes (no attraction, repulsion, or collision)
- Nodes move with gentle, randomized drift velocities
- Nodes wrap or bounce at boundaries

### Dynamic Edge Formation
- Edges appear between nodes when distance ≤ connectivity radius
- Edges disappear when nodes drift apart
- No forces applied—edges are purely visual indicators of proximity

### Perspective Rendering
- Camera positioned to view the 3D space
- User-controllable camera distance (can move into the web)
- Closer nodes appear larger (z-depth scaling)
- Farther nodes appear smaller and potentially dimmer
- Creates depth illusion on 2D canvas

## User Controls (Top-Right Dropdown Menu)

### Pause Animation
A checkbox at the top of the settings panel that stops all node movement when checked. Nodes freeze in place while paused but camera controls, settings, and statistics remain fully functional.

### Node Settings (Nested Dropdown)
| Control | Type | Range | Default |
|---------|------|-------|---------|
| Node Count | Slider | 10-500 | 50 |
| Node Size | Slider | 2-20px | 8px |
| Node Opacity | Slider | 0.1-1.0 | 0.9 |
| Node Glow | Slider | 0.0-2.0 | 1.0 |
| Randomize | Button | - | - |
| Reset | Button | - | - |

Note: Changing node count adds/removes nodes incrementally (preserves existing nodes). Use "Randomize" to re-randomize all node positions.

### Edge Settings (Nested Dropdown)
| Control | Type | Range | Default |
|---------|------|-------|---------|
| Edge Thickness | Slider | 0.5-5px | 1.5px |
| Edge Opacity | Slider | 0.1-1.0 | 0.5 |
| Connectivity Radius | Slider | 50-300 | 150 |
| Reset | Button | - | - |

### Space Settings (Nested Dropdown)
| Control | Type | Range | Default |
|---------|------|-------|---------|
| Space Width (X) | Slider | 400-2000 | 1200 |
| Space Height (Y) | Slider | 400-2000 | 900 |
| Space Depth (Z) | Slider | 400-2000 | 1200 |
| Reset | Button | - | - |

Note: Changing space dimensions scales existing node positions proportionally (squash/stretch) rather than re-randomizing.

### Camera Controls (Nested Dropdown)
| Control | Type | Range | Default |
|---------|------|-------|---------|
| Camera Distance | Slider | -800 to 800 | -600 |
| Pan X | Slider | -500 to 500 | 0 |
| Pan Y | Slider | -500 to 500 | 0 |
| Rotate X | Slider | -180 to 180 | 0 |
| Rotate Y | Slider | -180 to 180 | 0 |
| FOV | Slider | 200 to 1000 | 500 |
| Reset | Button | - | - |

Note: Camera controls transform node positions before projection (not the camera itself) to avoid edge cases. Rotation controls loop when reaching boundaries (-180° ↔ 180°).

### Reset All
A "Reset All" button at the bottom of the settings panel resets all settings to their default values and re-randomizes nodes.

## Network Statistics Panel (Collapsible Dropdown)

### Basic Metrics (Always Calculated)
- **Total Edges**: Current number of active connections
- **Avg Connections**: Average edges per node
- **Network Density**: Ratio of actual edges to maximum possible edges
  - Formula: `2E / (N * (N-1))` where E = edges, N = nodes
- **Isolated Nodes**: Count of nodes with zero connections
- **Max Connections**: Highest connection count (hub node)
- **Min Connections**: Lowest non-zero connection count

### Expensive Calculations (Toggle Checkbox)
When "Enable Expensive Calculations" checkbox is active:
- **Connected Components**: Number of separate node clusters/islands
- **Largest Component**: Size of the biggest connected group
- **Clustering Coefficient**: Average measure of how interconnected neighbors are (0-1)
- **Median Connections**: Middle value of connection counts
- **Connection Std Dev**: Standard deviation of connection distribution

Note: Expensive calculations may impact performance with high node counts (300+).

## Visual Style
- Dark background (space theme)
- Nodes: Glowing circular points (white or soft color)
- Edges: Semi-transparent lines connecting nodes
- Smooth, ambient animation

## Technical Approach
- Single HTML file with embedded CSS/JS
- HTML5 Canvas for rendering
- RequestAnimationFrame for smooth animation loop
- 3D coordinates projected to 2D with perspective division

### Advanced Camera Projection
The camera system uses three techniques to allow smooth close-range viewing:

1. **Spherical Near-Clip**: Instead of clipping based on z-depth alone, nodes are clipped based on 3D distance from the camera. This creates a spherical "bubble" around the camera rather than a flat plane, preventing nodes from popping in/out at the edges when the camera is close.

2. **Proximity Fade**: Nodes approaching the camera gradually fade out rather than abruptly disappearing. This creates smooth visual transitions as nodes enter and exit the near-clip zone.

3. **Reference Distance Scaling**: Node size is calculated using a separate scale base from the FOV, allowing nodes to grow larger than base size when close. At the reference distance (100 units), nodes appear at base size. Closer nodes scale up significantly, further nodes scale down.

## Boundaries
- 3D space dimensions: 1200 x 900 x 1200 (user-adjustable)
- Nodes stay within bounds (bounce behavior)
- Spherical near-clip prevents projection artifacts for nearby nodes
- Nodes behind camera are clipped (not rendered) to prevent projection errors
