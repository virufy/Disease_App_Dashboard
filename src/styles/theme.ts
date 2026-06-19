// theme.ts

import { DefaultTheme } from "styled-components";

export const classicTheme: DefaultTheme  = {
  name: "classic",
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#4ECDC4',
    danger: '#FF6B6B',
    warning: '#FFC107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    background: '#f5f5f5',
    text: '#333333',
    textLight: '#666666',
    textSoft: '#666666',
    border: '#dddddd',
    shadow: 'rgba(0, 0, 0, 0.1)',
    card: '#ffffff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
};

export const stripeTheme: DefaultTheme  = {
  name: "stripe",
  colors: {
    primary: '#635BFF',     // Stripe purple-blue
    secondary: '#F9FAFB',   // soft gray background
    success: '#2ECC71',
    danger: '#E74C3C',
    warning: '#F1C40F',
    info: '#3498DB',
    light: '#F4F7FB',
    dark: '#1B1B1D',
    white: '#FFFFFF',
    background: '#F8FAFD',  // main app background
    card: '#FFFFFF',        // cards background
    text: '#111827',        // main text
    textLight: '#6F7A94',
    textSoft: '#6F7A94',    // secondary text
    border: '#E5E7EB',
    shadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  spacing: {
    xs: '6px',
    sm: '12px',
    md: '18px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '18px',
    xl: '24px',
  },
  fontSize: {
    xs: '13px',
    sm: '15px',
    md: '17px',
    lg: '20px',
    xl: '24px',
    xxl: '32px',
  },
};

export const themes = {
  classic: classicTheme,
  stripe: stripeTheme,
};

export type ThemeType = typeof classicTheme;

// ─── Clinical Teal design tokens ──────────────────────────────────────────────
// Single source of truth for the dashboard's look. Import `tokens` into style
// files instead of hardcoding hex values.
//
// Rules of the system:
//  • `brand`  → the ONLY interactive/brand colour (teal).
//  • `slate`  → all structural neutrals (text, borders, surfaces).
//  • `data`   → semantic red/amber/green, used ONLY to convey data meaning
//               (sick rate, map clusters) — never as decoration.
export const tokens = {
  color: {
    // Brand (teal)
    brand: "#0F766E", // teal-700 — primary
    brandHover: "#0D9488", // teal-600 — hover
    brandSoft: "#CCFBF1", // teal-100 — subtle fills
    brandGradient: "linear-gradient(135deg, #0F766E, #0D9488)",
    brandOnDark: "#2DD4BF", // teal-400 — accents on dark surfaces (sidebar)
    brandOnDarkSoft: "rgba(45, 212, 191, 0.12)",

    // Neutrals (slate scale)
    heading: "#0F172A", // slate-900
    body: "#475569", // slate-600
    muted: "#64748B", // slate-500
    faint: "#94A3B8", // slate-400
    border: "#E2E8F0", // slate-200
    borderSoft: "rgba(15, 23, 42, 0.06)",
    surface: "#FFFFFF",
    surfaceAlt: "#F8FAFC", // slate-50
    canvas: "#0B1220", // dark frame behind the map
    white: "#FFFFFF",

    // Semantic — DATA ONLY
    danger: "#DC2626",
    dangerSoft: "#FEE2E2",
    warning: "#F59E0B",
    success: "#16A34A",
    successSoft: "#DCFCE7",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    pill: "999px",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  font: {
    xs: "11px",
    sm: "13px",
    md: "15px",
    lg: "18px",
    xl: "22px",
    xxl: "28px",
  },
  // One soft shadow language (replaces ad-hoc triple-stacked shadows)
  shadow: {
    sm: "0 1px 3px rgba(15, 23, 42, 0.08)",
    md: "0 4px 16px rgba(15, 23, 42, 0.08)",
    lg: "0 12px 32px rgba(15, 23, 42, 0.12)",
    focus: "0 0 0 3px rgba(13, 148, 136, 0.25)",
  },
} as const;

export type Tokens = typeof tokens;