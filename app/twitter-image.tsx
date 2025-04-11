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
          background: "linear-gradient(135deg, #1E1E1E 0%, #2D3748 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 背景エフェクト - グリッドパターン */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(rgba(62, 168, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(62, 168, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: "0.5",
            zIndex: 1,
          }}
        />

        {/* 背景エフェクト - グラデーションオーバーレイ */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(62, 168, 255, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(85, 197, 0, 0.15) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(255, 102, 0, 0.1) 0%, transparent 60%)",
            zIndex: 1,
          }}
        />

        {/* コンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "48px",
            width: "100%",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* ロゴ部分 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))",
            }}
          >
            <div
              style={{
                fontSize: "108px",
                fontWeight: "900",
                color: "white",
                display: "flex",
                gap: "12px",
                letterSpacing: "-0.02em",
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
          </div>

          {/* メインテキスト */}
          <div
            style={{
              fontSize: "48px",
              color: "white",
              textAlign: "center",
              fontWeight: "900",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
              letterSpacing: "-0.02em",
            }}
          >
            <span>エンジニアのための</span>
            <span>技術情報キャッチアップ</span>
          </div>

          {/* サービスロゴ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "20px 40px",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
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
