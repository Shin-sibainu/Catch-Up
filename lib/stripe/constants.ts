// プランごとの月間クレジット数を定義
export const PLAN_CREDITS = {
  FREE: 5,
  BASIC: 30,
  PRO: 80,
  ENTERPRISE: 200,
} as const;

// Price IDとプラン名のマッピング
export const PRICE_ID_TO_PLAN: Record<string, keyof typeof PLAN_CREDITS> = {
  // ここに実際のPrice IDを記載してください
  price_1RQHe4PtbLMlHPtdHnf70fhX: "BASIC", // ベーシック
  price_1RQHeIPtbLMlHPtd46n9Ad2I: "PRO", // スタンダード
  price_1RQHeYPtbLMlHPtdVCZWuI9C: "ENTERPRISE", // プロフェッショナル
};

export type PlanName = keyof typeof PLAN_CREDITS;
