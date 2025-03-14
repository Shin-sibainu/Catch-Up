"use client";

import PageHeader from "@/components/common/page-header";
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
              <Button className="w-full">選択する</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}