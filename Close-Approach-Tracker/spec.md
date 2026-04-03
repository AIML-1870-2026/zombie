# Close Approach Tracker — Specification

## Overview
A single-page web dashboard displaying near-Earth object (NEO) data from NASA and JPL APIs. Features a dark "mission control" aesthetic with four tabs providing real-time tracking, historical data, and impact risk monitoring.

## APIs

### NeoWs (NASA)
- **Endpoint:** `https://api.nasa.gov/neo/rest/v1/feed`
- **Parameters:** `start_date`, `end_date`, `api_key`
- **Auth:** API key required (DEMO_KEY available, personal key recommended)
- **Use:** This Week tab — current 7-day close approaches

### SBDB Close-Approach (JPL)
- **Endpoint:** `https://ssd-api.jpl.nasa.gov/cad.api`
- **Parameters:** `date-min`, `date-max`, `dist-max`, `sort`, `limit`
- **Auth:** None required
- **Use:** Close Approaches tab — historical/future queries

### Sentry (JPL)
- **Endpoint:** `https://ssd-api.jpl.nasa.gov/sentry.api`
- **Parameters:** `all` (returns full list)
- **Auth:** None required
- **Use:** Impact Watch tab — collision risk monitoring

## Tab Structure

### 1. Dashboard (Home)
- **Key Metrics Cards:**
  - Total objects this week
  - Closest approach this week (distance + name)
  - Potentially hazardous objects this week
  - Active Sentry-tracked objects
- **Highlights Section:**
  - Next 3 upcoming close approaches
  - Top 3 highest-risk Sentry objects (by Palermo scale)
- **Auto-refresh:** Every 5 minutes

### 2. This Week
- **Source:** NeoWs API
- **Display:** Card grid of all close approaches in current 7-day window
- **Card Data:**
  - Object name/designation
  - Estimated diameter (min-max in meters)
  - Size comparison (car, bus, house, stadium, etc.)
  - Close approach date/time
  - Miss distance (lunar distances + km)
  - Relative velocity (km/s)
  - Hazardous badge (if applicable)
- **Features:**
  - Sort by: date, distance, size, velocity
  - Filter: hazardous only toggle
  - Click card for expanded details

### 3. Close Approaches
- **Source:** SBDB Close-Approach API
- **Default View:** Next 30 days, within 0.05 AU
- **Controls:**
  - Date range picker (past/future)
  - Max distance slider (in lunar distances)
  - Minimum diameter filter
  - Results limit (25/50/100)
- **Table Display:**
  - Object designation
  - Close approach date
  - Distance (LD and km)
  - Velocity (km/s)
  - Estimated diameter (if available)
- **Features:**
  - Sortable columns
  - Pagination or infinite scroll

### 4. Impact Watch
- **Source:** Sentry API
- **Display:** Table of all tracked objects with impact probability
- **Columns:**
  - Object designation
  - Potential impact date range
  - Impact probability
  - Torino scale (0-10, color coded)
  - Palermo scale (logarithmic risk)
  - Estimated diameter
  - Number of potential impacts
- **Features:**
  - Sort by any column
  - Torino scale explanation tooltip
  - Color coding: green (0), yellow (1), orange (2-4), red (5+)

## UI Design

### Color Palette
- **Background:** #0a0e17 (deep space)
- **Surface:** #131a2b (cards, panels)
- **Border:** #1e2a42 (subtle dividers)
- **Primary:** #4a9eff (NASA blue)
- **Success:** #10b981 (safe/green)
- **Warning:** #f59e0b (caution/yellow)
- **Danger:** #ef4444 (hazardous/red)
- **Text Primary:** #e2e8f0
- **Text Secondary:** #94a3b8

### Typography
- **Headings:** System sans-serif (clean, modern)
- **Data/Numbers:** Monospace (technical feel)

### Layout
- **Header:** Fixed top bar with logo/title, tab navigation, settings icon
- **Settings Dropdown:** Top-right corner (API key input, refresh toggle, theme)
- **Main Content:** Full-width container with responsive grid
- **Footer:** Data attribution (NASA, JPL) and last updated timestamp

### Components
- **Metric Cards:** Large number, label, icon, subtle glow effect
- **Data Cards:** Rounded corners, subtle border, hover lift effect
- **Tables:** Striped rows, sticky header, sortable columns
- **Badges:** Pill-shaped, color-coded (hazardous, Torino scale)
- **Loading:** Skeleton placeholders, spinner for actions
- **Errors:** Inline error messages with retry button

## Size Comparisons
Convert diameter to relatable objects:
- < 1m: Basketball
- 1-2m: Person
- 2-5m: Car
- 5-15m: Bus
- 15-50m: House
- 50-100m: Football field
- 100-300m: Stadium
- 300-1000m: Skyscraper
- > 1000m: Mountain

## Distance Units
- **Primary:** Lunar Distances (LD) — 1 LD = 384,400 km
- **Secondary:** Kilometers (formatted with commas)
- Earth radius reference where helpful

## Error Handling
- API rate limit: Show cached data with warning banner
- Network error: Retry button with error message
- Empty results: Friendly "no data" state with suggestions

## Performance
- Cache API responses in sessionStorage
- Debounce filter inputs
- Lazy load tab content on first visit
- Show loading skeletons during fetch

## Responsive Behavior
- Desktop: Multi-column card grid, full tables
- Tablet: 2-column grid, horizontal scroll tables
- Mobile: Single column, stacked layout, collapsible filters

## Settings Menu
- API Key input (stored in localStorage)
- Auto-refresh toggle (5 min interval)
- Distance unit preference (LD/km)
- Compact view toggle

## File Structure
Single `index.html` file containing:
- Embedded CSS in `<style>` tag
- Embedded JavaScript in `<script>` tag
- No external dependencies (vanilla JS)
