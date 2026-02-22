# Contrast Ratio Calculator

An interactive web tool for testing color contrast accessibility according to WCAG guidelines, with color vision simulation capabilities.

## Features

### 1. Background Color Controls
- Three RGB sliders (0-255 range)
- Three synchronized integer input fields (R, G, B)
- Color preview swatch showing current background color
- Bidirectional sync: slider changes update inputs, input changes update sliders

### 2. Text Color Controls
- Three RGB sliders (0-255 range)
- Three synchronized integer input fields (R, G, B)
- Color preview swatch showing current text color
- Bidirectional sync: slider changes update inputs, input changes update sliders

### 3. Text Size Control
- Slider for font size adjustment (range: 12px - 72px)
- Synchronized integer input field displaying current size
- Real-time preview updates

### 4. Text Display Area
- Editable text area with placeholder: "The quick brown fox jumps over the lazy dog."
- Renders with selected background color, text color, and font size
- Updates in real-time as any control changes

### 5. Contrast Ratio Display
- Shows calculated WCAG contrast ratio in format: `X.XX:1`
- Recalculates automatically on any color change

### 6. Luminosity Displays
- Background luminosity value (0.00 - 1.00)
- Text luminosity value (0.00 - 1.00)
- Helps users understand the contrast calculation

### 7. WCAG Compliance Indicators
- **Normal Text**: Pass/Fail badge
- **Large Text**: Pass/Fail badge
- Color coding: green background for pass, red background for fail
- Text labels included for accessibility (not color-only indication)
- Thresholds update based on selected WCAG level

### 7a. WCAG Level Selector
Dropdown to select compliance level:
- **WCAG AA**: Normal text 4.5:1, Large text 3:1
- **WCAG AAA**: Normal text 7:1, Large text 4.5:1

### 8. Vision Type Simulation
Radio button group to simulate color vision deficiencies:
- Normal vision (default)
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Monochromacy (complete color blindness)

Applies simulation filter to the text display area AND recalculates contrast ratio, luminosity values, and WCAG compliance based on the simulated colors. A notice appears when viewing simulated results.

### 9. Preset Color Schemes
Dropdown menu with preset combinations:

| Preset Name | Background | Text | Purpose |
|-------------|------------|------|---------|
| High Contrast (Black on White) | #FFFFFF | #000000 | Maximum contrast |
| High Contrast (White on Black) | #000000 | #FFFFFF | Maximum contrast inverted |
| Bootstrap Primary | #FFFFFF | #0D6EFD | Common web framework |
| Material Blue | #FFFFFF | #1976D2 | Material Design |
| Subtle Gray | #F5F5F5 | #757575 | Low contrast example |
| Warning: Red on Green | #00FF00 | #FF0000 | Fails for color blindness |
| Warning: Low Contrast | #CCCCCC | #999999 | Fails WCAG |
| Navy on Cream | #FDF6E3 | #002B36 | Solarized-inspired |

---

## Layout

Two-column card-based layout (preview on left, controls on right):

```
┌─────────────────────────────────────────────────────────────┐
│                    Contrast Ratio Calculator                │
├─────────────────────────────┬───────────────────────────────┤
│                             │                               │
│      TEXT DISPLAY AREA      │   BACKGROUND COLOR            │
│   ┌───────────────────────┐ │   [■] R [====] [255]          │
│   │                       │ │       G [====] [255]          │
│   │  [Editable sample     │ │       B [====] [255]          │
│   │   text here...]       │ │                               │
│   │                       │ │   TEXT COLOR                  │
│   └───────────────────────┘ │   [■] R [====] [0  ]          │
│                             │       G [====] [0  ]          │
│   Contrast Ratio: 21.00:1   │       B [====] [0  ]          │
│   (simulated vision notice) │                               │
│                             │   TEXT SIZE                   │
│   Background Lum: 1.00      │   [========] [16px]           │
│   Text Lum: 0.00            │                               │
│                             │   WCAG LEVEL                  │
│   ┌────────┐ ┌────────┐     │   [AA / AAA ▼]                │
│   │ PASS   │ │ PASS   │     │                               │
│   │ Normal │ │ Large  │     │   PRESETS                     │
│   │ ≥4.5:1 │ │ ≥3:1   │     │   [Dropdown ▼]                │
│   └────────┘ └────────┘     │                               │
│                             │   VISION SIMULATION           │
│                             │   ○ Normal  ○ Protanopia      │
│                             │   ○ Deuteranopia ○ Tritanopia │
│                             │   ○ Monochromacy              │
└─────────────────────────────┴───────────────────────────────┘
```

---

## Technical Implementation

### Contrast Ratio Calculation (WCAG 2.1)

1. **Convert RGB to relative luminance:**
   ```
   For each channel (R, G, B):
     sRGB = channel / 255
     if sRGB <= 0.03928:
       linear = sRGB / 12.92
     else:
       linear = ((sRGB + 0.055) / 1.055) ^ 2.4

   Luminance = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear
   ```

2. **Calculate contrast ratio:**
   ```
   L1 = luminance of lighter color
   L2 = luminance of darker color
   Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)
   ```

### Color Vision Simulation

Apply color transformation matrices to simulate vision deficiencies.
Contrast ratio and luminosity are recalculated using the transformed colors.

- **Protanopia**: Red channel perception reduced
  ```
  R' = 0.567*R + 0.433*G + 0*B
  G' = 0.558*R + 0.442*G + 0*B
  B' = 0*R + 0.242*G + 0.758*B
  ```
- **Deuteranopia**: Green channel perception reduced
  ```
  R' = 0.625*R + 0.375*G + 0*B
  G' = 0.7*R + 0.3*G + 0*B
  B' = 0*R + 0.3*G + 0.7*B
  ```
- **Tritanopia**: Blue channel perception reduced
  ```
  R' = 0.95*R + 0.05*G + 0*B
  G' = 0*R + 0.433*G + 0.567*B
  B' = 0*R + 0.475*G + 0.525*B
  ```
- **Monochromacy**: Convert to grayscale using luminance weights
  ```
  Gray = 0.2126*R + 0.7152*G + 0.0722*B
  ```

### Input Validation

- RGB values clamped to 0-255
- Font size clamped to 12-72px
- Invalid input reverts to previous valid value

---

## Default State

- Background: White (#FFFFFF / RGB 255, 255, 255)
- Text: Black (#000000 / RGB 0, 0, 0)
- Font size: 16px
- Vision simulation: Normal
- Sample text: "The quick brown fox jumps over the lazy dog."

---

## File Structure

```
Contrast-Ratio-Calculator/
├── spec.md
└── index.html
```

Single HTML file with embedded CSS and JavaScript.
