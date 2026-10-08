import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiWind, FiDroplet, FiSun, FiCloudRain, FiArrowUpRight, FiDownload, FiMapPin } from 'react-icons/fi';
import Footer from '../components/Footer/Footer';
import './WeatherAppPage.css';

const DEFAULT_WEATHER_DATA = {
  'Lahore': { temp: '28°C', cond: '☀️ Clear Sky', hum: '52%', wind: '14 km/h', uv: '6 (Moderate)', press: '1012 hPa' },
  'London': { temp: '16°C', cond: '🌧️ Light Rain', hum: '78%', wind: '22 km/h', uv: '3 (Low)', press: '1008 hPa' },
  'New York': { temp: '22°C', cond: '⛅ Partly Cloudy', hum: '60%', wind: '18 km/h', uv: '5 (Moderate)', press: '1015 hPa' },
  'Tokyo': { temp: '25°C', cond: '🌤️ Sunny', hum: '55%', wind: '10 km/h', uv: '7 (High)', press: '1018 hPa' },
  'Dubai': { temp: '38°C', cond: '☀️ Hot & Sunny', hum: '35%', wind: '16 km/h', uv: '9 (Very High)', press: '1006 hPa' },
  'San Francisco': { temp: '18°C', cond: '🌫️ Coastal Fog', hum: '72%', wind: '19 km/h', uv: '4 (Moderate)', press: '1016 hPa' }
};

export default function WeatherAppPage() {
  const [cityInput, setCityInput] = useState('Lahore');
  const [activeCity, setActiveCity] = useState('Lahore');
  const [weatherState, setWeatherState] = useState(DEFAULT_WEATHER_DATA['Lahore']);

  useEffect(() => {
    document.title = 'Weather Pulse | Interactive Application | A. AHAD';
    window.scrollTo(0, 0);
  }, []);

  const handleCitySelect = (city) => {
    setCityInput(city);
    setActiveCity(city);
    const data = DEFAULT_WEATHER_DATA[city] || {
      temp: '24°C',
      cond: '🌤️ Mostly Clear',
      hum: '50%',
      wind: '12 km/h',
      uv: '5 (Moderate)',
      press: '1013 hPa'
    };
    setWeatherState(data);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    const matchedKey = Object.keys(DEFAULT_WEATHER_DATA).find(
      (k) => k.toLowerCase() === cityInput.trim().toLowerCase()
    );

    if (matchedKey) {
      handleCitySelect(matchedKey);
    } else {
      // Dynamic fallback for user custom entered city
      setActiveCity(cityInput.trim());
      setWeatherState({
        temp: '23°C',
        cond: '⛅ Partly Cloudy',
        hum: '54%',
        wind: '15 km/h',
        uv: '5 (Moderate)',
        press: '1014 hPa'
      });
    }
  };

  return (
    <div className="weather-page-wrapper">
      {/* Section 1: Hero */}
      <section className="section-container page-hero">
        <div className="hero-tag">INTERACTIVE DEMO & CASE STUDY</div>
        <h1 className="hero-title">WEATHER PULSE APPLICATION</h1>
        <p className="hero-subtext">
          Real-time atmospheric insights, meteorological conditions, and interactive multi-city weather forecasting built with React.
        </p>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/Abdul_Ahad_Resume.pdf"
            download="Abdul_Ahad_Resume.pdf"
            className="btn-cv"
          >
            <FiDownload />
            <span>DOWNLOAD MY CV / RESUME</span>
          </a>
          <Link to="/projects/weather-app" className="btn-secondary">
            <span>VIEW CASE STUDY</span>
            <FiArrowUpRight />
          </Link>
        </div>
      </section>

      {/* Section 2: Interactive Live Widget */}
      <section className="section-container" style={{ paddingTop: 0 }}>
        <div className="demo-widget-card">
          <form className="search-bar-row" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="city-input"
              placeholder="Search city (e.g. Lahore, London, New York, Tokyo, Dubai)..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <FiSearch />
              <span>GET WEATHER</span>
            </button>
          </form>

          {/* Quick Select City Pills */}
          <div className="city-quick-pills">
            {Object.keys(DEFAULT_WEATHER_DATA).map((city) => (
              <span
                key={city}
                className={`quick-pill ${activeCity.toLowerCase() === city.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                📍 {city}
              </span>
            ))}
          </div>

          {/* Weather Display Grid */}
          <div className="weather-display-grid">
            <div className="weather-main-box">
              <div className="city-name">
                <FiMapPin style={{ fontSize: '20px', color: '#0099ff', marginRight: '6px' }} />
                {activeCity}
              </div>
              <div className="condition-label">{weatherState.cond}</div>
              <div className="temp-large">{weatherState.temp}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Feels like {weatherState.temp} · Real-time simulation
              </div>
            </div>

            <div className="weather-metrics-grid">
              <div className="metric-card">
                <label>
                  <FiDroplet style={{ color: '#0099ff' }} />
                  <span>HUMIDITY</span>
                </label>
                <span>{weatherState.hum}</span>
              </div>
              <div className="metric-card">
                <label>
                  <FiWind style={{ color: '#0099ff' }} />
                  <span>WIND SPEED</span>
                </label>
                <span>{weatherState.wind}</span>
              </div>
              <div className="metric-card">
                <label>
                  <FiSun style={{ color: '#ffbd2e' }} />
                  <span>UV INDEX</span>
                </label>
                <span>{weatherState.uv}</span>
              </div>
              <div className="metric-card">
                <label>
                  <FiCloudRain style={{ color: '#0099ff' }} />
                  <span>ATMOSPHERE</span>
                </label>
                <span>{weatherState.press}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: App Capabilities */}
      <section className="section-container">
        <div className="hero-tag">APP CAPABILITIES</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          CORE WEATHER FEATURES
        </h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">LIVE QUERY FEEDS</h3>
            <p className="feature-desc">
              Asynchronous data polling using REST APIs for responsive multi-city meteorological forecasting.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3 className="feature-title">GEOLOCATION MAPPING</h3>
            <p className="feature-desc">
              Structured location auto-lookup allowing instant atmospheric overview for key metropolitan hubs.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">DYNAMIC CLIMATE DATA</h3>
            <p className="feature-desc">
              Calculates humidity percentages, barometric pressure ratings, wind velocities, and solar UV indices.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">HIGH-CONTRAST UI</h3>
            <p className="feature-desc">
              Deep obsidian dark mode interface with neon blue and crimson highlights for optimal visual comfort.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
