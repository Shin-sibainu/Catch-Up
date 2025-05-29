import Stripe from "stripe";
import { PLAN_CREDITS, PRICE_ID_TO_PLAN, PlanName } from "./constants";

/**
 * SubscriptionからプランとクレジットInfo を取得
 */
export function getPlanInfoFromSubscription(
  subscription: Stripe.Subscription
): {
  planName: PlanName;
  monthlyCredits: number;
} {
  const priceId = subscription.items.data[0].price.id;
  const planName = PRICE_ID_TO_PLAN[priceId] || "BASIC";
  const monthlyCredits = PLAN_CREDITS[planName];

  return { planName, monthlyCredits };
}

/**
 * Stripe Customerからemailを取得
 */
export async function getCustomerEmail(
  stripe: Stripe,
  customerId: string
): Promise<string | null> {
  try {
    const customer = (await stripe.customers.retrieve(
      customerId
    )) as Stripe.Customer;
    return customer.email;
  } catch (error) {
    console.error("Failed to retrieve customer:", error);
    return null;
  }
}
