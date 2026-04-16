import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    background-color: #0b1220;
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      system-ui, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'cv11', 'ss01';
  }

  #root {
    display: flex;
    min-height: 100vh;
    width: 100%;
  }

  /* Leaflet attribution – subtle on light map */
  .leaflet-control-attribution {
    background: rgba(255, 255, 255, 0.8) !important;
    color: rgba(75, 85, 99, 0.8) !important;
    font-size: 9px !important;
    backdrop-filter: blur(4px);
    border-radius: 4px 0 0 0 !important;
  }

  .leaflet-control-attribution a {
    color: rgba(37, 99, 235, 0.7) !important;
  }

  /* Leaflet zoom controls – clean on light map */
  .leaflet-bar a {
    background: rgba(255, 255, 255, 0.92) !important;
    color: #374151 !important;
    border-color: rgba(0, 0, 0, 0.12) !important;
    backdrop-filter: blur(8px);
  }

  .leaflet-bar a:hover {
    background: rgba(239, 246, 255, 0.98) !important;
    color: #1d4ed8 !important;
  }

  /* Leaflet popup – Inter font, rounded, no harsh shadow */
  .leaflet-popup-content-wrapper {
    border-radius: 12px !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.14) !important;
    font-family: 'Inter', -apple-system, sans-serif !important;
    padding: 0 !important;
  }
  .leaflet-popup-content {
    margin: 0 !important;
  }
  .leaflet-popup-tip-container {
    display: none;
  }
`;
