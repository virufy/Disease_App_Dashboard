import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./i18n";
// import { AppProvider } from "./ThemeProviderWrapper";

// Legacy-link redirect: /dubai-map and /dubai are no longer canonical.
// (Client-side fallback — the real 301 redirect should also be set at the host.)
(() => {
  const { pathname, search, hash } = window.location;
  if (/\/dubai(-map)?(\/|$)/i.test(pathname)) {
    const next = pathname.replace(/\/dubai(-map)?/i, "/disease-map");
    window.history.replaceState(null, "", next + search + hash);
  }
})();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    {/* <AppProvider> */}
      <App />
    {/* </AppProvider> */}
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
