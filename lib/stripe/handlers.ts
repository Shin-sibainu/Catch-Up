import Stripe from "stripe";
import { NextResponse } from "next/server";
import {
  getUserByEmail,
  upsertSubscription,
  grantCredits,
  updateMaxCredits,
  downgradeToFree,
  cancelSubscription,
} from "./database";
import { getPlanInfoFromSubscription, getCustomerEmail } from "./utils";

/**
 * サブスクリプション作成時のハンドラー
 */
export async function handleSubscriptionCreated(
  stripe: Stripe,
  subscription: Stripe.Subscription
): Promise<NextResponse> {
  const email = await getCustomerEmail(stripe, subscription.customer as string);

  if (!email) {
    console.error("Customer email not found");
    return NextResponse.json(
      { error: "Customer email not found" },
      { status: 400 }
    );
  }

  const { planName, monthlyCredits } =
    getPlanInfoFromSubscription(subscription);

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      console.error("User not found:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subSuccess = await upsertSubscription(
      user.id,
      subscription,
      planName,
      monthlyCredits
    );
    if (!subSuccess) {
      console.error("Subscription update failed");
      return NextResponse.json(
        { error: "Subscription update failed" },
        { status: 500 }
      );
    }

    const creditSuccess = await grantCredits(user, monthlyCredits);
    if (!creditSuccess) {
      console.error("Credit update failed");
      return NextResponse.json(
        { error: "Credit update failed" },
        { status: 500 }
      );
    }

    console.log(`サブスクリプション作成: ${email}, プラン: ${planName}`);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing subscription creation:", {
      message: error?.message,
      stack: error?.stack,
      error,
    });
    return NextResponse.json(
      { error: "Internal server error", detail: error?.message },
      { status: 500 }
    );
  }
}

/**
 * サブスクリプション更新時のハンドラー
 */
export async function handleSubscriptionUpdated(
  stripe: Stripe,
  subscription: Stripe.Subscription
): Promise<NextResponse> {
  const email = await getCustomerEmail(stripe, subscription.customer as string);

  if (!email) {
    console.error("Customer email not found");
    return NextResponse.json(
      { error: "Customer email not found" },
      { status: 400 }
    );
  }

  const { planName, monthlyCredits } =
    getPlanInfoFromSubscription(subscription);

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      console.error("User not found:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subSuccess = await upsertSubscription(
      user.id,
      subscription,
      planName,
      monthlyCredits
    );
    if (!subSuccess) {
      console.error("Subscription update failed");
      return NextResponse.json(
        { error: "Subscription update failed" },
        { status: 500 }
      );
    }

    if (subscription.status === "active") {
      const creditSuccess = await updateMaxCredits(user.id, monthlyCredits);
      if (!creditSuccess) {
        console.error("Credit update failed");
        return NextResponse.json(
          { error: "Credit update failed" },
          { status: 500 }
        );
      }
    }

    console.log(
      `サブスクリプション更新: ${email}, プラン: ${planName}, ステータス: ${subscription.status}`
    );
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing subscription update:", {
      message: error?.message,
      stack: error?.stack,
      error,
    });
    return NextResponse.json(
      { error: "Internal server error", detail: error?.message },
      { status: 500 }
    );
  }
}

/**
 * サブスクリプション削除時のハンドラー
 */
export async function handleSubscriptionDeleted(
  stripe: Stripe,
  subscription: Stripe.Subscription
): Promise<NextResponse> {
  const email = await getCustomerEmail(stripe, subscription.customer as string);

  if (!email) {
    console.error("Customer email not found");
    return NextResponse.json(
      { error: "Customer email not found" },
      { status: 400 }
    );
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      console.error("User not found:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cancelSuccess = await cancelSubscription(user.id);
    if (!cancelSuccess) {
      console.error("Subscription cancellation failed");
      return NextResponse.json(
        { error: "Subscription update failed" },
        { status: 500 }
      );
    }

    const downgradeSuccess = await downgradeToFree(user.id);
    if (!downgradeSuccess) {
      console.error("User downgrade failed");
      return NextResponse.json(
        { error: "User update failed" },
        { status: 500 }
      );
    }

    console.log(`サブスクリプションキャンセル: ${email}`);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing subscription deletion:", {
      message: error?.message,
      stack: error?.stack,
      error,
    });
    return NextResponse.json(
      { error: "Internal server error", detail: error?.message },
      { status: 500 }
    );
  }
}
