import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://zenn.dev/api/articles', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TechTrends/1.0;)'
      },
      next: {
        revalidate: 300 // 5分ごとに再検証
      }
    });

    if (!response.ok) {
      throw new Error(`Zenn API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Zenn API:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}