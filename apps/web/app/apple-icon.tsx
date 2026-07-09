import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0B",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            background: "#F59E0B",
            borderRadius: 16,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
