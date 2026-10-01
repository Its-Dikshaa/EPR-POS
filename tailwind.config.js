/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        kc: {
          primary: "#1a2e4a",
          accent: "#0ea5e9",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          purple: "#8b5cf6",
          sidebar: "#0f1f35",
          sidebarHover: "#1e3a5f",
          bg: "#f0f4f8",
          border: "#e2e8f0",
          text: "#1e293b",
          muted: "#64748b",
        }
      }
    }
  },
  plugins: [],
};
