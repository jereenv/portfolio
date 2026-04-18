import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jereen Valsson — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(139,92,246,0.35), transparent 60%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.25), transparent 60%)",
          color: "white",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#22c55e",
            }}
          />
          Currently @ Grafana Labs · San Francisco
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            backgroundImage:
              "linear-gradient(135deg, #ffffff 30%, #c4b5fd 70%, #f0abfc)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          Jereen Valsson
        </div>
        <div
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.75)",
            marginTop: 28,
            maxWidth: 900,
            lineHeight: 1.3,
            display: "flex",
          }}
        >
          Good backends are invisible. I make them fast too. Mostly Go,
          Python, and AWS.
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 48,
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span>jereenvalsson.com</span>
          <span>·</span>
          <span>github.com/jereenv</span>
          <span>·</span>
          <span>linkedin.com/in/jereenvalsson</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
