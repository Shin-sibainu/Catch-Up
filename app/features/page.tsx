"use client";

import PageHeader from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, BookOpen, Globe, MonitorSmartphone, Bot, Sparkles, Bell, Bookmark } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Globe,
      title: "複数プラットフォームの統合",
      description: "Zenn、Qiita、Hacker Newsの最新記事を一箇所で効率的にチェック"
    },
    {
      icon: Bot,
      title: "AIによる記事推薦",
      description: "あなたの興味に合わせて、最適な技術記事をレコメンド"
    },
    {
      icon: Sparkles,
      title: "トレンド分析",
      description: "注目を集めている技術トピックをリアルタイムで可視化"
    },
    {
      icon: Bell,
      title: "カスタム通知",
      description: "気になるキーワードや著者の新着記事を即座に通知"
    },
    {
      icon: Bookmark,
      title: "スマートブックマーク",
      description: "気になる記事を保存し、後で効率的に振り返り"
    }
  ];

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="機能紹介" 
        description="Tech Trendsの主な機能をご紹介します"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="flex flex-col">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}