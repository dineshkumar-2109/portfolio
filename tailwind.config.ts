import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F1F2EE",
        panel: "#FAFAF7",
        ink: "#121826",
        muted: "#586174",
        rule: "#D3D7D0",
        blue: "#2340C8",
        signal: "#F2561D",
        "signal-deep": "#B93A0B",
        night: "#0E1424",
        "night-2": "#172036",
        "night-rule": "#2A3654",
        ok: "#3DDC97",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        data: ["var(--font-data)", "ui-monospace", "monospace"],
      },
      maxWidth: { page: "80rem" },
    },
  },
  plugins: [],
};
export default config;
