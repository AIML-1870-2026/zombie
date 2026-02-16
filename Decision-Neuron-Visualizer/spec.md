# Decision Neuron Visualizer

## Overview
A visual tool demonstrating how a single neuron makes binary decisions using weighted inputs, bias, and sigmoid activation. Includes interactive training mode with a 2D decision boundary visualization.

---

## Core Features

### Multi-Scenario System
The neuron is a general-purpose decision machine that can model any binary decision.

#### Preset Scenarios
| Scenario | Emoji | Decision | Celebration |
|----------|-------|----------|-------------|
| Tech Upgrade | 💻 | Buy new computer? | "Time to upgrade!" |
| Choose a College | 🎓 | Enroll at this school? | "Congratulations, future student!" |
| Adopt a Pet | 🐕 | Adopt this pet? | "Welcome to the family!" |
| Road Trip | 🚗 | Take the road trip? | "Adventure awaits!" |

#### Create Your Own Scenario
Users can create custom scenarios with:
- Custom title and emoji
- Custom input labels (5 inputs)
- Custom weights for each input
- Custom "Yes" and "No" labels
- Custom celebration text

#### Scenario Structure
```javascript
{
  id: 'tech-upgrade',
  emoji: '💻',
  title: 'Tech Upgrade',
  yesLabel: 'Buy',
  noLabel: "Don't Buy",
  outputLabel: 'Buy New\nComputer',
  celebration: 'Time to upgrade!',
  inputs: [
    { label: 'Cost', weight: -0.7, description: '0=cheap, 1=expensive' },
    { label: 'Capability', weight: 0.6, description: '0=weak, 1=powerful' },
    // ... more inputs
  ]
}
```

#### Applying a Scenario
When a scenario is selected:
1. Update all input labels in the network diagram
2. Update slider labels in controls
3. Update axis dropdown options
4. Update output neuron label
5. Reset weights to scenario defaults
6. Update Yes/No toggle labels
7. Clear training points
8. Show celebration text when output ≥ threshold

---

### Decision Domain
- **"Yes" (1)**: Positive decision (output ≥ 0.5 probability)
- **"No" (0)**: Negative decision (output < 0.5 probability)

### Default Scenario: Tech Upgrade
| Input | Range | Weight | Sign | Description |
|-------|-------|--------|------|-------------|
| Cost | 0-1 | -0.7 | − | Price of new computer (0 = cheap, 1 = expensive) |
| Capability | 0-1 | +0.6 | + | New computer's power (0 = weak, 1 = powerful) |
| Current Capability | 0-1 | -0.3 | − | Existing computer's power (0 = weak, 1 = powerful) |
| Age (New) | 0-1 | -0.3 | − | Age of new computer stock (0 = brand new, 1 = old stock) |
| Current Age | 0-1 | +0.4 | + | Age of current computer (0 = new, 1 = old) |

**Weight Sign Meaning**:
- **Positive (+)**: Higher input value → more likely to say "yes"
- **Negative (−)**: Higher input value → more likely to say "no"

### Bias
- **Range**: -2 to +2
- **Initial Value**: 0.5
- **Interpretation**: Shifts the decision threshold
  - Positive bias → more inclined to say "yes"
  - Negative bias → more inclined to say "no"

### Activation Function Showdown
Compare different activation functions to understand how neurons make decisions.

#### Available Functions
| Function | Formula | Output Range | Era |
|----------|---------|--------------|-----|
| Sigmoid | σ(z) = 1 / (1 + e^(-z)) | 0 to 1 | Classic |
| Step | f(z) = z ≥ 0 ? 1 : 0 | 0 or 1 | 1958 Perceptron |
| ReLU | f(z) = max(0, z) | 0 to ∞ | Modern Deep Learning |

#### UI Components
- **Function Selector**: Radio buttons or dropdown to choose activation function
- **Function Curve Plot**: Shows the activation function curve with:
  - Current z value marked on x-axis
  - Current output marked on y-axis
  - Moving dot that tracks along the curve
- **Math Display**: Shows formula and current calculation
- **Comparison Mode**: Toggle to overlay all three curves on the same plot

#### Behavior Changes
- Output neuron color updates based on selected function
- Decision boundary heatmap adapts to function output
- For ReLU: threshold at 0.5 for decision (normalized display)

---

### Two-Neuron Chain
The smallest glimpse of a neural network — one neuron's output feeds into another.

#### Architecture
```
Neuron 1 (Hidden):
  Inputs: Original 5 inputs (Cost, Capability, etc.)
  Output: a₁ = activation(z₁)

Neuron 2 (Output):
  Inputs: a₁ (from Neuron 1) + 2 new inputs
  - Budget Available (0-1)
  - Partner Approval (0-1)
  Output: Final decision
```

#### UI Components
- **Chain Mode Toggle**: Switch between single neuron and two-neuron chain
- **Chain Weight Slider**: Adjustable weight for the connection between neurons
- **Additional Input Sliders**: Budget Available, Partner Approval
- **Neuron 2 Bias Slider**: Separate bias for the second neuron

#### Visual Elements
- Neuron 1 shown on left (hidden layer)
- Animated synapse connection to Neuron 2
- Neuron 2 shown on right with additional inputs
- Color-coded connection showing chain weight

#### Math Display (Chain Mode)
```
Neuron 1: z₁ = Σ(x·w₁) + b₁ → a₁ = σ(z₁)
Neuron 2: z₂ = a₁·w_chain + x₆·w₆ + x₇·w₇ + b₂ → output = σ(z₂)
```

---

## Decision Boundary Panel

### 2D Scatter Plot
- **Purpose**: Visualize how two selected inputs affect the decision
- **X-Axis**: User-selectable input (default: Cost)
- **Y-Axis**: User-selectable input (default: Capability)
- **Other inputs**: Held constant at their slider values

### Visual Elements
| Element | Description |
|---------|-------------|
| Decision Line | Linear boundary where probability = 0.5 |
| "Yes" Region | Shaded green area (probability ≥ 0.5) |
| "No" Region | Shaded red area (probability < 0.5) |
| Data Points | Circles placed by user during training |
| Point Colors | Green = labeled "yes", Red = labeled "no" |

### Axis Selection
- Dropdown or toggle to choose which inputs map to X and Y
- Remaining inputs use current slider values as constants

---

## Training Mode (Step-by-Step)

### Adding Data Points
- Click anywhere on the 2D plot to place a point
- Toggle or two-button system to set label:
  - **"Yes" mode**: Next click adds a green point (label = 1)
  - **"No" mode**: Next click adds a red point (label = 0)

### Training Controls
| Button | Action |
|--------|--------|
| **Step** | Advance one training iteration with animation |
| **Train** | Run multiple steps automatically (e.g., 10-100 iterations) |
| **Reset** | Clear all points and reset weights to initial values |

### Training Algorithm
- **Method**: Gradient descent on binary cross-entropy loss
- **Learning Rate**: Configurable (default: 0.1)
- **Per Step**:
  1. Compute prediction for each point
  2. Calculate gradient for weights and bias
  3. Update weights and bias
  4. Animate decision line movement

### Training Display
| Metric | Description |
|--------|-------------|
| Current Weights | Show all 5 weights with live updates |
| Current Bias | Show bias value with live updates |
| Step Counter | Number of training iterations completed |
| Accuracy | Percentage of correctly classified points |
| Loss | Current cross-entropy loss value |

---

## Visualization

### Neural Network Diagram
- **Left side**: 5 input neurons (stacked vertically)
- **Right side**: 1 output neuron (centered)
- **Connections**: Lines colored by weight sign (green +, red −)
- **Line thickness**: Represents weight magnitude

### Node Design
- Circular nodes with labels
- Input nodes show current value
- Output node shows probability percentage
- Glow intensity reflects activation level

---

## Controls

### Location
- Dropdown menu in top-right corner (per UI standards)

### Input Sliders
| Slider | Range | Default |
|--------|-------|---------|
| Cost | 0 - 1 | 0.5 |
| Capability | 0 - 1 | 0.5 |
| Current Capability | 0 - 1 | 0.5 |
| Age (New) | 0 - 1 | 0.5 |
| Current Age | 0 - 1 | 0.5 |
| Bias | -2 - 2 | 0.5 |

### Training Controls
- Learning rate slider (0.01 - 1.0)
- Axis selection dropdowns (X and Y)
- Label mode toggle (Yes/No)

---

## UI/UX Requirements

### Visual Feedback
- Highlight active training point during step
- Pulse animation on weight updates
- Smooth color transitions in decision regions

### Animations
- Decision line smoothly animates to new position
- Points fade in when added
- Weights/bias values animate when changing

### Responsiveness
- **Desktop**: Side-by-side layout (network diagram + decision boundary)
- **Tablet**: Stacked layout with full-width panels
- **Mobile**: Single column, collapsible sections
- Touch-friendly controls and point placement

---

### Sensitivity Analysis
See how much each input actually matters to the neuron's decision.

#### Line Chart
- **Purpose**: Visualize input influence by sweeping each input 0→1
- **X-Axis**: Input value (0 to 1)
- **Y-Axis**: Neuron output probability (0 to 1)
- **Curves**: One line per input, each showing output as that input varies
- **Other inputs**: Held constant at current slider values

#### Visual Elements
| Element | Description |
|---------|-------------|
| Input Curves | Colored lines for each input (5 lines) |
| Slope Direction | Negative weights slope down, positive slope up |
| Current Markers | Vertical lines + dots showing current slider position on each curve |
| Legend | Input names with matching colors |

#### Optional Bar Chart
- Toggle to show sensitivity ranking
- Bars represent absolute weight magnitude (influence)
- Sorted by influence (most influential at top)
- Color-coded positive (green) vs negative (red) weights

---

## Technical Details

### Stack
- Single `index.html` file
- Inline CSS and JavaScript
- Canvas for visualizations

### Performance
- Efficient redraw on slider changes
- Debounced training animation
- RequestAnimationFrame for smooth visuals

---

## Implementation Phases

### Phase 1 ✓
- [x] Basic neural network visualization
- [x] Input sliders with real-time updates
- [x] Connection lines with weight colors

### Phase 2 ✓
- [x] Sigmoid activation function
- [x] 2D decision boundary panel
- [x] Axis selection for X/Y inputs
- [x] Decision line visualization

### Phase 3 ✓
- [x] Click to add training points
- [x] Yes/No labeling system
- [x] Step button with single iteration
- [x] Weight/bias display panel

### Phase 4 ✓
- [x] Train button (multiple iterations)
- [x] Reset functionality
- [x] Accuracy and loss metrics
- [x] Mobile-responsive layout

### Phase 5 ✓
- [x] Multi-scenario system
- [x] Preset scenarios (Tech, College, Pet, Road Trip)
- [x] Create Your Own Scenario (inline editing)
- [x] Dynamic UI updates on scenario change
- [x] Celebration text display

### Phase 6 ✓
- [x] Enhanced decision boundary heatmap (blue → white → magenta)
- [x] Gold contour line at decision threshold
- [x] Crosshair dot tracking current slider position
- [x] Axis selection dropdowns

### Phase 7 - Activation Function Showdown ✓
- [x] Activation function selector (Sigmoid, Step, ReLU)
- [x] Function curve plot with moving marker
- [x] Math formula display for each function
- [x] Comparison mode overlay

### Phase 8 - Two-Neuron Chain ✓
- [x] Chain mode toggle
- [x] Second neuron with additional inputs (Budget, Approval)
- [x] Animated chain synapse visualization
- [x] Expanded math display for both neurons

### Phase 9
- [ ] Smooth animations throughout
- [ ] Performance optimization

### Phase 10 - Sensitivity Analysis ✓
- [x] Line chart sweeping each input 0→1
- [x] Vertical markers at current slider values
- [x] Optional bar chart ranking inputs by influence
