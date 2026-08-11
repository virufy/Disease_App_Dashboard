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