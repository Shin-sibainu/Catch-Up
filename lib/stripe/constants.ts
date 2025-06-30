// プランごとの月間クレジット数を定義
export const PLAN_CREDITS = {
  FREE: 5,
  BASIC: 30,
  PRO: 80,
  ENTERPRISE: 200,
} as const;

// Price IDとプラン名のマッピング
export const PRICE_ID_TO_PLAN: Record<string, keyof typeof PLAN_CREDITS> = {
  // 本番用Price ID
  price_1RbxVKL1rauPNMhiuqVWzVZJ: "BASIC", // ベーシック
  price_1RbxbSL1rauPNMhibz8VUcba: "PRO", // スタンダード
  price_1RbxbfL1rauPNMhigryMoVBJ: "ENTERPRISE", // プロフェッショナル
};

export type PlanName = keyof typeof PLAN_CREDITS;
