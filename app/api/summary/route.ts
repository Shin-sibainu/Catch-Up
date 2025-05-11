import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No Gemini API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `\n以下のテキストを日本語で、重要なポイントや内容の流れが分かるように、できるだけ詳細に要約してください。\n・要点を漏らさず、内容の構成や流れも分かるようにまとめてください。\n・必要に応じて段落や箇条書きも使ってください。\n・専門用語や固有名詞はそのまま残してください。\n・長くなっても良いので、読み手が内容を把握しやすいようにしてください。\n\n【本文】\n${text}`;
    const result = await model.generateContent(prompt);
    const summary =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
      result.response.text ||
      "";

    return NextResponse.json({ summary });
  } catch (e) {
    return NextResponse.json({ error: "Gemini API error" }, { status: 500 });
  }
}
