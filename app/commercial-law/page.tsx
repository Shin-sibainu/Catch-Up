import { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - Catch Up",
  description: "Catch Upの特定商取引法に基づく表記をご確認ください。",
};

export default function CommercialLawPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">特定商取引法に基づく表記</h1>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border-collapse border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold min-w-[150px]">
                販売事業者
              </td>
              <td className="px-4 py-3">Catch Up運営事務局※個人事業主</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                運営統括責任者
              </td>
              <td className="px-4 py-3">Catch Up管理者</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                所在地
              </td>
              <td className="px-4 py-3">※請求があったら遅滞なく開示します</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                連絡先
              </td>
              <td className="px-4 py-3">
                メールアドレス：shincodeinc@gmail.com
                <br />
                ※電話番号は請求があったら遅滞なく開示します
                <br />
                営業時間：平日10:00〜18:00（土日祝日・年末年始を除く）
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                販売価格
              </td>
              <td className="px-4 py-3">
                各商品ページに表示される価格に準じます
                <br />
                ※表示価格は全て税込みです
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                商品代金以外の必要料金
              </td>
              <td className="px-4 py-3">決済手数料：無料</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                支払方法
              </td>
              <td className="px-4 py-3">
                クレジットカード決済（Stripe）
                <br />
                対応カード：Visa, Mastercard, American Express, JCB
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                支払時期
              </td>
              <td className="px-4 py-3">
                クレジットカード決済の場合、ご注文時に即時決済されます
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                商品の引渡時期
              </td>
              <td className="px-4 py-3">
                お支払い完了後、即座にサービスをご利用いただけます
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="border-r border-gray-300 bg-gray-50 px-4 py-3 font-semibold">
                返品・キャンセルについて
              </td>
              <td className="px-4 py-3">
                <div className="space-y-2">
                  <div>
                    <strong>＜お客様都合による返金の場合＞</strong>
                    <br />
                    ご購入後14日以内であれば、全額返金に対応いたします。
                    <br />
                    ※返金をご希望の場合は、メールにてご連絡ください
                    <br />
                    ※返金手続きには3-5営業日程度かかる場合があります
                  </div>
                  <div>
                    <strong>＜サービスに不具合があった場合＞</strong>
                    <br />
                    当社の責任において速やかに不具合を修正、もしくは全額返金いたします
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prose prose-sm max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">特記事項</h2>
          <ul className="list-disc pl-6">
            <li>本サービスはデジタルコンテンツの提供です</li>
            <li>
              サービスの性質上、提供開始後の返品には応じかねる場合があります
            </li>
            <li>商品の詳細については、各商品ページをご確認ください</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">プラン詳細</h2>
          <div className="bg-muted p-4 rounded-lg">
            <ul className="list-disc pl-6 space-y-1">
              <li>ベーシックプラン: 30クレジット/月</li>
              <li>プロプラン: 80クレジット/月</li>
              <li>エンタープライズプラン: 200クレジット/月</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              ※最新の価格は料金ページでご確認ください
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">個人情報の取扱い</h2>
          <p>
            お客様の個人情報の取扱いについては、
            <a href="/privacy" className="text-blue-600 hover:underline">
              プライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </section>

        <div className="mt-12 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            最終更新日: 2025年1月{new Date().getDate()}日<br />
            本表記の内容は予告なく変更される場合があります。最新の情報は本ページでご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
}
