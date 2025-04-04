import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CatchUp - エンジニアの技術情報キャッチアップ";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(45deg, #0f172a, #1e293b)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* グリッドパターン - 縦線 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, transparent 39px, #3EA8FF40 40px)",
            backgroundSize: "40px 40px",
            opacity: 0.8,
          }}
        />

        {/* グリッドパターン - 横線 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "linear-gradient(0deg, transparent 39px, #3EA8FF40 40px)",
            backgroundSize: "40px 40px",
            opacity: 0.8,
          }}
        />

        {/* グラデーションオーバーレイ */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 20% 20%, #3EA8FF40, transparent 40%)",
          }}
        />

        {/* メインコンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            position: "relative",
            padding: "48px",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "108px",
              fontWeight: "900",
              color: "white",
              gap: "8px",
              letterSpacing: "-0.02em",
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
            }}
          >
            <span
              style={{
                color: "#3EA8FF",
                textShadow: "0 0 20px rgba(62, 168, 255, 0.3)",
              }}
            >
              Catch
            </span>
            <span
              style={{
                color: "#55C500",
                textShadow: "0 0 20px rgba(85, 197, 0, 0.3)",
              }}
            >
              Up
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              color: "white",
              textAlign: "center",
              gap: "12px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
            }}
          >
            <div>エンジニアのための</div>
            <div>技術情報キャッチアップ</div>
          </div>

          {/* サービスロゴ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "32px",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "20px 40px",
                borderRadius: "20px",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span
                style={{
                  color: "#3EA8FF",
                  fontSize: "40px",
                  fontWeight: "900",
                  textShadow: "0 0 10px rgba(62, 168, 255, 0.3)",
                }}
              >
                Zenn
              </span>
              <span
                style={{
                  color: "#55C500",
                  fontSize: "40px",
                  fontWeight: "900",
                  textShadow: "0 0 10px rgba(85, 197, 0, 0.3)",
                }}
              >
                Qiita
              </span>
              <span
                style={{
                  color: "#FF6600",
                  fontSize: "40px",
                  fontWeight: "900",
                  textShadow: "0 0 10px rgba(255, 102, 0, 0.3)",
                }}
              >
                HackerNews
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
