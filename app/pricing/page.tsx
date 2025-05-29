"use client";

import PageHeader from "@/components/common/page-header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { createCheckoutSession } from "../actions/stripe";
import { useTransition, useState } from "react";

export default function Pricing() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      name: "ベーシック",
      price: "¥480",
      period: "/月",
      description: "個人向けプラン",
      features: [
        "月30回までの要約（1回あたり最大15ページ）",
        "基本的な要約機能",
        "モバイルアプリアクセス",
      ],
      priceId: "price_1RQHe4PtbLMlHPtdHnf70fhX",
    },
    {
      name: "スタンダード",
      price: "¥980",
      period: "/月",
      description: "ビジネス向けプラン",
      features: [
        "月80回までの要約（1回あたり最大30ページ）",
        "複数形式の出力オプション（箇条書き、段落など）",
        "要約の保存と整理機能",
        "クラウド同期",
      ],
      priceId: "price_1RQHeIPtbLMlHPtd46n9Ad2I",
    },
    {
      name: "プロフェッショナル",
      price: "¥2,480",
      period: "/月",
      description: "ビジネス/研究者向けプラン",
      features: [
        "月200回までの要約（1回あたり最大100ページ）",
        "複数文書の一括要約",
        "PDFマーカー/注釈機能",
        "チーム共有機能",
        "優先サポート",
      ],
      priceId: "price_1RQHeYPtbLMlHPtdVCZWuI9C",
    },
  ];

  const handleCheckout = async (priceId: string) => {
    setError(null);
    startTransition(async () => {
      const res = await createCheckoutSession(priceId);
      if (res?.url) {
        window.location.href = res.url;
      } else {
        setError(res?.error || "決済ページへの遷移に失敗しました");
      }
    });
  };

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title="料金プラン"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "¥0",
      description: "個人での利用に最適",
      features: [
        "すべてのプラットフォームの記事閲覧",
        "基本的なブックマーク機能",
        "1日の記事閲覧制限あり",
      ],
    },
    {
      name: "Pro",
      price: "¥980",
      period: "/月",
      description: "プロフェッショナルな利用に",
      features: [
        "無制限の記事閲覧",
        "高度な検索機能",
        "AIによる記事推薦",
        "カスタム通知設定",
        "APIアクセス",
      ],
    },
    {
      name: "Team",
      price: "¥4,980",
      period: "/月",
      description: "チームでの利用に最適",
      features: [
        "Proプランのすべての機能",
        "最大10名まで利用可能",
        "チーム共有機能",
        "管理ダッシュボード",
        "優先サポート",
      ],
    },
  ];

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="料金プラン" 
        description="あなたのニーズに合わせた最適なプランをお選びください"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}

                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleCheckout(plan.priceId)}
                disabled={isPending}
              >
                {isPending ? "リダイレクト中..." : "選択する"}
              </Button>
              <Button className="w-full">選択する</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </main>
  );
}
    </main>
  );
}
