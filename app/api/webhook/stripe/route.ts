import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from "@/lib/stripe/handlers";

// 環境変数の存在チェック
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set");
}

if (!endpointSecret) {
  console.warn("STRIPE_WEBHOOK_SECRET is not set");
}

// Stripeインスタンスの初期化（環境変数が存在する場合のみ）
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(req: NextRequest) {
  // 必要な環境変数がない場合はエラーを返す
  if (!stripe || !endpointSecret) {
    console.error("Stripe configuration is incomplete");
    return NextResponse.json(
      { error: "Stripe configuration is incomplete" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // サブスクリプション作成時
  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    return await handleSubscriptionCreated(stripe, subscription);
  }

  // サブスクリプション更新時（プラン変更など）
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    return await handleSubscriptionUpdated(stripe, subscription);
  }

  // サブスクリプション削除時（キャンセル時）
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    return await handleSubscriptionDeleted(stripe, subscription);
  }

  return NextResponse.json({ received: true });
}
