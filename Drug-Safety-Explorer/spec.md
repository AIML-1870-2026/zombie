# Drug Safety Explorer - Specification

## Overview
An interactive web tool for exploring and comparing drug safety information using the OpenFDA API. Users can investigate two drugs side-by-side, viewing adverse event reports, warnings, interactions, and recall history.

## Core Concept
**Primary Interface:** Side-by-side drug comparison with tabbed data categories
**Default State:** Pre-loaded with Warfarin + Ibuprofen (well-documented interaction pair)
**Data Sources:** OpenFDA API (no key required)

---

## Features

### 1. Drug Search
- Two search inputs at the top (Drug A and Drug B)
- Autocomplete suggestions from `/drug/label.json` endpoint
- Debounced search (300ms) to avoid API spam
- Clear button to reset each drug
- Swap button to switch Drug A and Drug B positions

### 2. Data Tabs

#### Tab: Overview
- Brand name(s) and generic name
- Manufacturer
- Drug class / pharmacologic category
- Active ingredients
- Route of administration
- Source: `/drug/label.json`

#### Tab: Adverse Events
- Top 15 reported adverse events (bar chart visualization)
- Total report count
- Severity breakdown if available
- Clear note: "Report counts reflect submissions to FDA, not confirmed causation"
- Source: `/drug/event.json` (FAERS)

#### Tab: Warnings & Interactions
- Boxed warnings (if any) - highlighted prominently
- Drug interactions section
- Contraindications
- Warnings and precautions
- Source: `/drug/label.json`

#### Tab: Recalls
- Timeline of recalls (if any)
- Each recall shows:
  - Date
  - Reason
  - Classification (I, II, III) with color coding
  - Distribution scope
- Source: `/drug/enforcement.json`

### 3. Co-Administration Analysis
- Below the comparison, show FAERS reports where BOTH drugs appear together
- Display top adverse events from these co-administration reports
- Prominent warning about correlation ≠ causation

### 4. Visual Design

#### Layout
- Header with title and settings dropdown (top-right)
- Two-column comparison (responsive: stacks on mobile)
- Shared tab bar that switches content for both drugs simultaneously
- Footer with disclaimers and attribution

#### Color Scheme
- Clean, medical/professional aesthetic
- Primary: Deep blue (#1a365d)
- Accent: Teal (#0d9488)
- Warning: Amber (#f59e0b)
- Danger: Red (#dc2626)
- Background: Light gray (#f8fafc)

#### Recall Severity Colors
- Class I (most serious): Red background
- Class II (moderate): Orange background
- Class III (minor): Yellow background

#### Charts
- Horizontal bar charts for adverse events
- Simple, clear labels
- Drug A and Drug B use distinct colors for easy comparison

### 5. Loading & Error States
- Skeleton loaders while fetching data
- "No data available" states with helpful messaging
- "Drug not found" error with suggestions
- API error handling with retry option

### 6. Settings Menu (Top-Right Dropdown)
- Toggle: Show/hide report counts on charts
- Toggle: Dark mode (optional enhancement)
- Button: Reset to default drugs
- Link: About this tool (opens modal with data explanation)

### 7. Help Buttons & Educational Popups
Contextual info buttons (ⓘ) throughout the interface that open modals explaining data in plain language.

#### Help Topics:
- **How to Interpret Adverse Event Data** - Explains FAERS voluntary reporting, correlation ≠ causation, and reporting bias (popular drugs get more reports)
- **Understanding Recall Classifications** - Class I (serious health consequences/death), Class II (temporary/reversible), Class III (unlikely to cause harm) with examples
- **Known Dangerous Drug Pairs** - Classic examples: Warfarin + NSAIDs (bleeding), MAOIs + serotonergics (serotonin syndrome), Methotrexate + NSAIDs (toxicity)
- **What Drug Labels Tell You** - FDA-approved prescribing information, the authoritative source
- **Why Some Drugs Have More Reports** - Reporting bias explanation
- **About This Tool** - General overview and when to consult healthcare professionals

#### Design:
- Small, unobtrusive ⓘ icons next to section headers
- "How to Read This Data" button in header for general overview
- Smooth modal animations with backdrop blur
- Dismiss via: click outside, Escape key, or close button

### 8. Visual Storytelling

#### Adverse Events Timeline
- Line/area chart showing when adverse events were reported over time
- Uses `/drug/event.json` with `count=receivedate` parameter
- Helps identify patterns (e.g., spikes after drug approval, recent concerns)

#### Severity Breakdown
- Pie/donut chart distinguishing serious vs non-serious outcomes
- Serious outcomes: hospitalization, disability, death, life-threatening
- Uses `serious` field from FAERS data

#### Enhanced Frequency Chart
- Horizontal bar chart with gradient fills
- Hover tooltips with exact counts and percentages
- Side-by-side comparison bars when viewing two drugs

### 9. Drug Class Exploration
New mode allowing users to explore entire drug classes rather than individual drugs.

#### Drug Classes Available:
- SSRIs (Selective Serotonin Reuptake Inhibitors) - antidepressants
- Statins - cholesterol medications
- ACE Inhibitors - blood pressure
- NSAIDs - pain/anti-inflammatory
- Benzodiazepines - anxiety/sedation
- Proton Pump Inhibitors - acid reflux
- Beta Blockers - heart/blood pressure

#### Features:
- Dropdown to select drug class
- Shows all drugs in that class
- Comparative bar chart showing adverse event profiles across the class
- Recall history comparison within the class
- Highlights drugs with notably different safety profiles

#### API Implementation:
- Query `/drug/label.json` using `openfda.pharm_class_epc` field
- Example: `search=openfda.pharm_class_epc:"HMG-CoA+Reductase+Inhibitor"` for statins

---

## Technical Implementation

### API Endpoints Used
1. `/drug/label.json` - Drug labeling, warnings, interactions
2. `/drug/event.json` - FAERS adverse event reports
3. `/drug/enforcement.json` - Recall data

### API Query Examples
```
// Search for drug labels
https://api.fda.gov/drug/label.json?search=openfda.brand_name:"warfarin"&limit=5

// Get adverse events for a drug
https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"warfarin"&count=patient.reaction.reactionmeddrapt.exact

// Get recalls
https://api.fda.gov/drug/enforcement.json?search=product_description:"warfarin"&limit=10

// Co-administration (both drugs in same report)
https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"warfarin"+AND+patient.drug.medicinalproduct:"ibuprofen"&count=patient.reaction.reactionmeddrapt.exact
```

### Rate Limiting
- Max 240 requests/minute without API key
- Implement request caching for repeated searches
- Debounce user input

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely client-side

---

## Required Disclaimers

### Main Disclaimer (Prominent placement)
> **Educational Use Only**
> This tool is for informational and educational purposes only. It is not intended to provide medical advice, diagnosis, or treatment recommendations. Always consult a qualified healthcare provider before making decisions about medications.

### FAERS Data Disclaimer (On Adverse Events tab)
> Adverse event reports are voluntarily submitted to the FDA. A report linking a drug to an adverse event does not prove the drug caused the event. Report counts cannot be used to estimate how common an event actually is.

### FDA Attribution (Footer)
> This product uses publicly available data from the U.S. Food and Drug Administration (FDA). FDA is not responsible for the product and does not endorse or recommend this or any other product.

---

## File Structure
```
Drug-Safety-Explorer/
├── spec.md
└── index.html (single file with embedded CSS/JS)
```

---

## Edge Cases to Handle
- Drug with no FAERS reports → Show message, not error
- Drug not found in label database → Suggest checking spelling
- Drug with no recalls → Show "No recalls found" (positive framing)
- API timeout/error → Retry button with error message
- Very long drug names → Truncate with tooltip
- Mobile viewport → Stack columns vertically

---

## Success Criteria
1. User can search and compare any two drugs
2. Data loads within reasonable time (<3 seconds typical)
3. Visualizations clearly communicate relative adverse event frequencies
4. Warnings and interactions are prominently displayed
5. All required disclaimers are visible
6. Tool works without any backend server
