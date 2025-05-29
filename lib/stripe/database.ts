import {
  PrismaClient,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";
import Stripe from "stripe";
import { PLAN_CREDITS, PlanName } from "./constants";

const prisma = new PrismaClient();

/**
 * メールアドレスでユーザーを取得
 */
export async function getUserByEmail(email: string) {
  const user = await prisma.users.findUnique({ where: { email } });
  return user;
}

/**
 * サブスクリプション情報のupsert
 */
export async function upsertSubscription(
  userId: string,
  subscription: Stripe.Subscription,
  planName: PlanName,
  monthlyCredits: number
): Promise<boolean> {
  try {
    // 型安全を保ちつつ、実際の値を使う
    const currentPeriodEnd = (subscription as any).current_period_end;

    await prisma.subscriptions.upsert({
      where: {
        userid: userId,
      },
      update: {
        userid: userId,
        stripecustomerid: String(subscription.customer),
        plan: planName as SubscriptionPlan,
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        monthlyCredits,
        nextCreditGrantAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        expiresat: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
      },
      create: {
        userid: userId,
        stripecustomerid: String(subscription.customer),
        stripesubscriptionid: subscription.id,
        plan: planName as SubscriptionPlan,
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        monthlyCredits,
        nextCreditGrantAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        expiresat: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
      },
    });
    return true;
  } catch (error: any) {
    console.error("Subscription upsert error:", error?.message, error);
    return false;
  }
}

/**
 * クレジット付与
 */
export async function grantCredits(
  user: any,
  monthlyCredits: number
): Promise<boolean> {
  try {
    await prisma.users.update({
      where: { id: user.id },
      data: {
        credits: monthlyCredits,
        totalCredits: (user.totalCredits || 0) + monthlyCredits,
        lastCreditGrant: new Date(),
        creditGrantFrequency: "MONTHLY",
        maxCredits: monthlyCredits,
      },
    });
    return true;
  } catch (error: any) {
    console.error("GrantCredits upsert error:", {
      message: error?.message,
      stack: error?.stack,
      error,
    });
    return false;
  }
}

/**
 * クレジット上限だけ更新（プラン変更時）
 */
export async function updateMaxCredits(
  userId: string,
  monthlyCredits: number
): Promise<boolean> {
  try {
    await prisma.users.update({
      where: { id: userId },
      data: {
        maxCredits: monthlyCredits,
        creditGrantFrequency: "MONTHLY",
      },
    });
    return true;
  } catch (error) {
    console.error("Max credit update error:", error);
    return false;
  }
}

/**
 * サブスクキャンセル時のユーザー更新
 */
export async function downgradeToFree(userId: string): Promise<boolean> {
  try {
    await prisma.users.update({
      where: { id: userId },
      data: {
        maxCredits: PLAN_CREDITS.FREE,
        creditGrantFrequency: "MONTHLY",
      },
    });
    return true;
  } catch (error) {
    console.error("Downgrade error:", error);
    return false;
  }
}

/**
 * サブスクリプションをキャンセル状態に更新
 */
export async function cancelSubscription(userId: string): Promise<boolean> {
  try {
    await prisma.subscriptions.update({
      where: {
        userid: userId,
      },
      data: {
        status: "CANCELED",
        expiresat: new Date().toISOString(),
      },
    });
    return true;
  } catch (error) {
    console.error("Subscription update error:", error);
    return false;
  }
}
