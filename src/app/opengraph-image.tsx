import { ImageResponse } from "next/og";
import { portfolio } from "@/lib/portfolio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated share card, built from portfolio.json so it can never go stale. */
export default function OpengraphImage() {
  const { personal } = portfolio;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F1F2EE", color: "#121826", padding: 72 }}>
        <div style={{ display: "flex", width: 28, height: 28, background: "#F2561D", transform: "rotate(45deg)" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 800, lineHeight: 1, letterSpacing: -4 }}>{personal.heroName.join(" ")}</div>
          <div style={{ display: "flex", fontSize: 44, marginTop: 20, fontWeight: 700 }}>{personal.title}</div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 14, color: "#586174" }}>{personal.tagline.join(" ")}</div>
        </div>
      </div>
    ),
    size,
  );
}
