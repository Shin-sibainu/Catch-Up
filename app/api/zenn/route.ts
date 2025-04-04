import { NextResponse } from "next/server";

export const revalidate = 300; // 5分ごとに再検証

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const response = await fetch("https://zenn.dev/api/articles", {
      headers: {
        Accept: "application/json",
        "User-Agent": `Mozilla/5.0 (compatible; CatchUp/1.0; +${siteUrl})`,
      },
      next: {
        revalidate: 300, // 5分ごとに再検証
      },
    });

    if (!response.ok) {
      console.error(`Zenn API error: Status ${response.status}`);
      throw new Error(`Zenn API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from Zenn API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
