"use server";

import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

// 環境変数の存在チェック
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set");
}

// Stripeインスタンスの初期化（環境変数が存在する場合のみ）
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// プランごとのクレジット数とプラン名
const TEST_PLAN_INFO: Record<string, { credits: number; plan: string }> = {
  price_1RQHe4PtbLMlHPtdHnf70fhX: { credits: 30, plan: "BASIC" },
  price_1RQHeIPtbLMlHPtd46n9Ad2I: { credits: 80, plan: "PRO" },
  price_1RQHeYPtbLMlHPtdVCZWuI9C: { credits: 200, plan: "ENTERPRISE" },
};

const PROD_PLAN_INFO: Record<string, { credits: number; plan: string }> = {
  price_1RbxVKL1rauPNMhiuqVWzVZJ: { credits: 30, plan: "BASIC" },
  price_1RbxbSL1rauPNMhibz8VUcba: { credits: 80, plan: "PRO" },
  price_1RbxbfL1rauPNMhigryMoVBJ: { credits: 200, plan: "ENTERPRISE" },
};

// 環境に応じてプラン情報を切り替え
// 開発時も本番priceIdを使用（テスト用priceIdが無効のため）
const PLAN_INFO = PROD_PLAN_INFO;
// const PLAN_INFO =
//   process.env.NODE_ENV === "production" ? PROD_PLAN_INFO : TEST_PLAN_INFO;

export async function createCheckoutSession(priceId: string) {
  // Stripeが初期化されていない場合はエラーを返す
  if (!stripe) {
    return {
      error: "Stripe設定が不完全です。管理者にお問い合わせください。",
    };
  }

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  if (!email) {
    return {
      error: "メールアドレスが取得できませんでした。ログインしてください。",
    };
  }

  try {
    // プラン情報を取得
    const planInfo = PLAN_INFO[priceId] ?? { credits: 30, plan: "BASIC" };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId, // 渡されたPrice IDを使用
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/?success=1&credits=${planInfo.credits}&plan=${planInfo.plan}`,
      cancel_url: "http://localhost:3000/pricing",
    });
    return { url: session.url };
  } catch (error: any) {
    return { error: error.message };
  }
}
