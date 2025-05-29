"use server";

import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// プランごとのクレジット数とプラン名
const PLAN_INFO: Record<string, { credits: number; plan: string }> = {
  price_1RQHe4PtbLMlHPtdHnf70fhX: { credits: 30, plan: "BASIC" },
  price_1RQHeIPtbLMlHPtd46n9Ad2I: { credits: 80, plan: "PRO" },
  price_1RQHeYPtbLMlHPtdVCZWuI9C: { credits: 200, plan: "ENTERPRISE" },
};

export async function createCheckoutSession(priceId: string) {
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
