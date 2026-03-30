# Weather Dashboard

## Overview
A clean, responsive weather dashboard that fetches weather data from OpenWeatherMap's free tier APIs and displays current conditions, air quality, and a 5-day forecast.

## Features

### Core Functionality
- **City Search with Suggestions**: Autocomplete dropdown using Geocoding API as user types
- **Temperature Unit Toggle**: Switch between Celsius (°C) and Fahrenheit (°F)
- **Wind/Visibility Unit Toggle**: Switch between m/s, km/h, and mph (visibility auto-matches: km for metric, miles for imperial)
- **Theme Override**: Manual theme selection or auto-detect from weather
- **Persistent Preferences**: All settings saved in localStorage

### Current Weather Data
- City name with country badge
- Coordinates (latitude/longitude)
- Current temperature with weather icon
- Weather description
- Feels like temperature
- Humidity percentage
- Wind speed with direction (N, NE, E, etc.)
- Atmospheric pressure (hPa)
- Visibility (km)
- Cloud coverage (%)
- Sunrise and sunset times

### Air Quality Index (AQI)
- AQI level (1-5 scale): Good, Fair, Moderate, Poor, Very Poor
- Color-coded visual indicator with progress bar
- Detailed pollutant breakdown:
  - PM2.5 (fine particulate matter)
  - PM10 (coarse particulate matter)
  - O₃ (ozone)
  - NO₂ (nitrogen dioxide)
  - SO₂ (sulfur dioxide)
  - CO (carbon monoxide)

### 5-Day Forecast
- Daily weather icons
- High/low temperatures for each day
- Horizontal scrollable layout on mobile

### UI/UX
- City autocomplete suggestions with state/country info
- Placeholder state with example cities to try
- Centered card layout with clear visual hierarchy
- **Options bar** with visible toggles for:
  - Temperature unit (°C/°F)
  - Wind unit (m/s, km/h, mph)
  - Theme swatches (Auto + 5 manual themes)
- Dynamic background gradient based on weather conditions (or manual override):
  - Clear: warm oranges/yellows
  - Clouds: grays/slate
  - Rain/Drizzle: blues/navy
  - Thunderstorm: dark grays
  - Snow: light grays/teals
  - Mist/Fog/Haze: purple/gray
- Clear error messaging for invalid cities
- Responsive design for mobile devices

## Technical Details

### Free Tier APIs Used
| API | Endpoint | Purpose |
|-----|----------|---------|
| Current Weather | `/data/2.5/weather` | Real-time conditions |
| 5-Day Forecast | `/data/2.5/forecast` | 3-hour intervals for 5 days |
| Air Pollution | `/data/2.5/air_pollution` | AQI and pollutant data |
| Geocoding | `/geo/1.0/direct` | City search suggestions |

### API Limits (Free Tier)
- 60 calls/minute
- 1,000,000 calls/month
- No credit card required

### Stack
- Single HTML file with embedded CSS and JavaScript
- Vanilla JavaScript (no frameworks)
- Fetch API for HTTP requests
- CSS variables for theming
- Debounced input for city suggestions (300ms)
- Responsive design (mobile-friendly)

## User Flow
1. User arrives at dashboard with placeholder text and example cities
2. As user types, city suggestions appear from Geocoding API
3. User selects a city or presses Enter to search
4. Dashboard displays:
   - Current weather with all available metrics
   - Air quality with pollutant breakdown
   - 5-day forecast with daily highs/lows
5. Background color adjusts to match weather conditions (or user's theme choice)
6. User can adjust preferences via options bar:
   - Temperature: °C or °F
   - Wind/Visibility: m/s (km), km/h (km), or mph (miles)
   - Theme: Auto or manual override (Clear, Cloudy, Rain, Snow, Storm)
7. All preferences persist across sessions via localStorage

## Data Sources
- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Free tier documentation: [Pricing](https://openweathermap.org/price)
