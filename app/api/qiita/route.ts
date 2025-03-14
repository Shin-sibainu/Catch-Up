import { NextResponse } from 'next/server';

export const revalidate = 300; // 5分ごとに再検証

export async function GET() {
  try {
    const response = await fetch(
      'https://qiita.com/api/v2/items?per_page=20&query=stocks:>10&sort=stock',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': process.env.QIITA_TOKEN ? `Bearer ${process.env.QIITA_TOKEN}` : ''
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Qiita API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 必要な情報のみを抽出
    const articles = data.map((article: any) => ({
      id: article.id,
      title: article.title,
      url: article.url,
      created_at: article.created_at,
      likes_count: article.likes_count,
      stocks_count: article.stocks_count,
      user: {
        id: article.user.id,
        name: article.user.name
      }
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching from Qiita API:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}