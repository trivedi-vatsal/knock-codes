import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Knock Codes — Copy-paste access screens for private previews";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#0e1311",
          color: "#edeae0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(237, 234, 224, 0.6)",
            marginBottom: 28,
          }}
        >
          → knock.codes
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
          <span>The&nbsp;</span>
          <span style={{ color: "#dfff67", fontStyle: "italic" }}>access screen</span>
          <span>&nbsp;you</span>
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>copy-paste and ship</div>
        <div style={{ display: "flex", fontSize: 30, color: "rgba(237, 234, 224, 0.7)", marginTop: 36 }}>
          Copy-paste access screens for private previews, staging pages, and client links.
        </div>
      </div>
    ),
    { ...size }
  );
}
