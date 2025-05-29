import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from "@/lib/stripe/handlers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
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
