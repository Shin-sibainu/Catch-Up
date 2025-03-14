"use client";

import PageHeader from "@/components/common/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Help() {
  const faqs = [
    {
      question: "Tech Trendsとは何ですか？",
      answer: "Tech Trendsは、エンジニアのための技術記事キュレーションサービスです。Zenn、Qiita、Hacker Newsなど、複数のプラットフォームの記事を一箇所で効率的にチェックできます。"
    },
    {
      question: "無料で利用できますか？",
      answer: "はい、基本的な機能は無料でご利用いただけます。より高度な機能をご利用になりたい場合は、有料プランへのアップグレードをご検討ください。"
    },
    {
      question: "記事の更新頻度はどのくらいですか？",
      answer: "各プラットフォームの記事は、ほぼリアルタイムで更新されます。トレンド情報は10分ごとに更新され、最新の情報を常に提供しています。"
    },
    {
      question: "ブックマークした記事はどこで確認できますか？",
      answer: "ログイン後、「Bookmarks」タブからブックマークした記事の一覧を確認できます。記事は永続的に保存され、いつでも参照可能です。"
    },
    {
      question: "通知設定はカスタマイズできますか？",
      answer: "Proプラン以上をご利用の場合、キーワードや著者ごとに通知設定をカスタマイズできます。メールやブラウザ通知から、お好みの通知方法を選択できます。"
    }
  ];

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <PageHeader 
        title="ヘルプセンター" 
        description="よくある質問と回答をご紹介します"
      />
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}