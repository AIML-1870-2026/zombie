# RGB Color Studio

An interactive web application for exploring RGB color mixing through particle simulation and generating harmonious color palettes.

## Features

### Tab 1: Particle Explorer

An optimized particle system demonstrating additive RGB color mixing.

#### Particle System
- **Default particles**: 50,000 (adjustable 10,000 - 250,000)
- **Distribution**: Equal split between red, green, and blue
- **FPS counter**: Displays current frame rate in top-left corner
- **Particle size**: Small, simple squares for performance
- **Rendering**: ImageData pixel manipulation with Float32Array typed arrays for positions/velocities

#### Controls
- **R Slider** (0-255): Controls brightness of red particles
- **G Slider** (0-255): Controls brightness of green particles
- **B Slider** (0-255): Controls brightness of blue particles
- **Zoom Slider**: Smooth zoom from 1x to 8x to see blended color
- **Particle Slider** (10k-250k): Adjusts total particle count, default 50k

#### Rendering
- Additive blending (`globalCompositeOperation: 'lighter'`) so overlapping colors mix
- Each color uses a separate RGB channel, so full brightness particles blend naturally
- R(255,0,0) + G(0,255,0) = Yellow(255,255,0), all three = White(255,255,255)

#### Behavior
- Particles drift randomly across the canvas
- Screen wrapping (particles exiting one edge reappear on opposite edge)
- No particle-to-particle interactions
- Continuous animation loop

### Tab 2: Palette Generator

A tool for generating harmonious color palettes based on color theory.

#### Color Selection Methods
- **Color Wheel**: Click to select hue, drag for saturation/lightness
- **RGB Sliders**: Individual sliders for R, G, B values (0-255)
- **Hex Input**: Text field for direct hex code entry (#RRGGBB)

All methods stay synchronized — changing one updates the others.

#### Palette Types
- **Complementary**: Base color + opposite on color wheel
- **Analogous**: Base color + adjacent colors (30° apart)
- **Triadic**: Three colors evenly spaced (120° apart)
- **Tetradic (Square)**: Four colors evenly spaced (90° apart)
- **Split-Complementary**: Base + two colors adjacent to complement
- **Monochromatic**: Shades and tints of base color

#### Palette Size
- Adjustable range: 2-10 colors
- Slider or number input to set size
- Palette recalculates when size changes

#### Export Options
- **Copy Hex**: Copies all colors as hex codes (e.g., #FF5733, #33FF57, ...)
- **Copy RGB**: Copies all colors as RGB values (e.g., rgb(255, 87, 51), ...)

### Accessibility Tools

Each tool is contained in a clear block with a name and helpful hint.

#### Contrast Checker
- Native color pickers for text and background colors
- Live WCAG contrast ratio calculation
- Pass/fail badges for:
  - **AA Normal Text**: 4.5:1 minimum
  - **AA Large Text**: 3:1 minimum
  - **AAA Normal Text**: 7:1 minimum
  - **AAA Large Text**: 4.5:1 minimum
- Live text preview showing the color combination

#### Color Blindness View
- **Global simulation**: Changes ALL colors on screen (color wheel, palette, preview)
- Supported types:
  - **Normal Vision**: Default view
  - **Protanopia**: Red-blind (~1% of males)
  - **Deuteranopia**: Green-blind (~1% of males)
  - **Tritanopia**: Blue-blind (~0.003% of population)
- Click tabs to switch between views
- Hex values always show true colors (what will be exported)

#### Auto-Contrast
- Toggle to automatically adjust palette colors for readability
- Ensures all colors meet WCAG AA standard (4.5:1 contrast) against the background
- Ensures palette colors remain perceptually distinct from each other
- Uses weighted color difference algorithm to prevent colors from converging
- Select background color to check contrast against
- Adjusts lightness of colors while preserving hue

## Layout & UI

### Navigation
- Tab bar at top to switch between "Particle Explorer" and "Palette Generator"
- Active tab clearly indicated

### Theme
- Dark theme throughout
- Dark background (#0a0a0a or similar)
- Light text for contrast
- Accent colors for interactive elements

### Controls Placement
- Settings and controls in dropdown menu (top-right corner)
- Keeps main canvas/content area uncluttered

### Responsive Design
- Palette generator scrolls on smaller screens
- Color wheel and palette resize on narrow viewports
- Optimized for both desktop and tablet sizes

## Technical Requirements

### Performance
- Target 60fps for particle animation
- Use requestAnimationFrame for render loop
- Minimize object creation in animation loop
- Consider particle pooling if needed

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support required

### File Structure
- Single `index.html` file (inline CSS and JS)
- Can be separated later via "separate the code" command

## Color Calculations

### RGB to HSL Conversion
Required for palette generation algorithms.

### Palette Algorithms
- Complementary: H + 180°
- Analogous: H ± 30° (adjustable based on palette size)
- Triadic: H + 120°, H + 240°
- Tetradic: H + 90°, H + 180°, H + 270°
- Split-complementary: H + 150°, H + 210°
- Monochromatic: Vary L (lightness) while keeping H and S constant
