import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic title and description params
    const title = searchParams.get("title") || "Abhilash Kalathil Ramesh";
    const subtitle = searchParams.get("subtitle") || "Executive Director, Kairali Ayurvedic Group";
    const section = searchParams.get("section") || "Verification Ledger";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#F4F2E9", // Cream ground
            padding: "80px",
            border: "24px solid #7A5F28", // Zari / Gold framed border
            boxSizing: "border-box",
          }}
        >
          {/* Header block */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "serif",
                fontSize: "30px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#7A5F28", // Zari / Gold color
                marginBottom: "12px",
              }}
            >
              Abhilash Kalathil Ramesh
            </span>
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#4C5A50", // Ink Muted color
              }}
            >
              {subtitle}
            </span>
          </div>

          {/* Large dynamic page or essay title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontFamily: "serif",
                fontSize: "60px",
                fontStyle: "italic",
                fontWeight: "normal",
                color: "#1A2B22", // Ink color
                margin: 0,
                lineHeight: "1.2",
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer block */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(26, 43, 34, 0.15)",
              paddingTop: "24px",
            }}
          >
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#4C5A50",
              }}
            >
              abhilashkr.com
            </span>
            <span
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#7A5F28",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {`${section} // EST. 1908`}
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(`OG image generation failed: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
