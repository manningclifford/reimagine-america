import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #0a0f1e 0%, #0f1f3d 60%, #0a1628 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Star grid background */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexWrap: "wrap", gap: 32, padding: 24, opacity: 0.08 }}>
          {Array(120).fill("★").map((s, i) => (
            <span key={i} style={{ color: "#fff", fontSize: 14 }}>{s}</span>
          ))}
        </div>

        {/* Border */}
        <div style={{ position: "absolute", inset: 16, border: "1px solid #1e2d4a", borderRadius: 20 }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 1, padding: "0 80px", textAlign: "center" }}>
          <div style={{ fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: "#4b6fa8", fontWeight: 600 }}>
            ★ &nbsp; R E D R A W &nbsp; A M E R I C A &nbsp; ★
          </div>
          <div style={{ fontSize: 80, fontWeight: 900, color: "#ffffff", lineHeight: 1.05 }}>
            What if the USA<br />was redrawn?
          </div>
          <div style={{ fontSize: 24, color: "#64748b", marginTop: 8 }}>
            Reimagine borders. Build nations. See the stats.
          </div>
          <div style={{ marginTop: 16, fontSize: 18, color: "#4b6fa8", letterSpacing: "0.1em" }}>
            usa.clifford.works
          </div>
        </div>
      </div>
    ),
    size
  );
}
