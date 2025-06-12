import { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - Catch Up",
  description: "Catch Upの特定商取引法に基づく表記をご確認ください。",
};

export default function CommercialLawPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">特定商取引法に基づく表記</h1>

      <div className="prose prose-sm max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">販売業者</h2>
          <p>Catch Up運営事務局</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">運営責任者</h2>
          <p>代表者名</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">所在地</h2>
          <p>
            〒000-0000
            <br />
            東京都○○区○○○○
            <br />
            ※お客様からのお問い合わせは、下記のお問い合わせ先までお願いいたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">お問い合わせ先</h2>
          <p>
            メールアドレス: support@catch-up.example.com
            <br />
            ※お問い合わせは上記メールアドレスまでお願いいたします。
            <br />
            ※営業時間: 平日 10:00〜18:00（土日祝日を除く）
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">商品・サービスの種類</h2>
          <p>
            技術情報キュレーションサービス「Catch Up」の有料プラン提供
            <br />
            ・月額サブスクリプションサービス
            <br />
            ・デジタルコンテンツの提供
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">商品・サービスの価格</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">月額プラン</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>ベーシックプラン: 月額 980円（税込）</li>
              <li>プレミアムプラン: 月額 1,980円（税込）</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              ※価格は予告なく変更される場合があります。
              <br />
              ※最新の価格は料金ページでご確認ください。
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">支払方法</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              クレジットカード決済（Visa、Mastercard、American Express、JCB）
            </li>
            <li>デビットカード決済</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            ※決済処理はStripe Inc.により安全に処理されます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">支払時期</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>月額プラン: 毎月の契約更新日に自動決済</li>
            <li>初回決済: サブスクリプション開始時に即時決済</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            商品・サービスの提供時期
          </h2>
          <p>
            決済完了後、即座にサービスをご利用いただけます。
            <br />
            月額プランは契約期間中、継続してサービスを提供いたします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            返品・交換・キャンセルについて
          </h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">
              デジタルコンテンツの性質上の制限
            </h3>
            <p className="mb-4">
              本サービスはデジタルコンテンツの提供であり、商品の性質上、原則として返品・返金はお受けできません。
            </p>

            <h3 className="text-lg font-medium mb-2">
              サブスクリプションのキャンセル
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>サブスクリプションはいつでもキャンセル可能です</li>
              <li>キャンセル後は次回更新日以降、課金が停止されます</li>
              <li>
                キャンセル後も現在の契約期間終了まではサービスをご利用いただけます
              </li>
            </ul>

            <h3 className="text-lg font-medium mb-2">例外的な返金対応</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>システム障害により長期間サービスが利用できなかった場合</li>
              <li>
                当社の責に帰すべき事由により、サービスが提供できなかった場合
              </li>
              <li>重複決済などの決済エラーが発生した場合</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">動作環境</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">推奨ブラウザ</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Google Chrome（最新版）</li>
              <li>Mozilla Firefox（最新版）</li>
              <li>Safari（最新版）</li>
              <li>Microsoft Edge（最新版）</li>
            </ul>

            <h3 className="text-lg font-medium mb-2">その他の要件</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>インターネット接続環境</li>
              <li>JavaScript有効化</li>
              <li>Cookie有効化</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">その他の条件</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>本サービスの利用には、利用規約への同意が必要です</li>
            <li>未成年者の利用には保護者の同意が必要です</li>
            <li>サービス内容は予告なく変更される場合があります</li>
            <li>
              システムメンテナンス等により、一時的にサービスが利用できない場合があります
            </li>
          </ul>
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

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">表示義務等に関する事項</h2>
          <p className="text-sm text-muted-foreground">
            本表記は、特定商取引に関する法律（特定商取引法）第11条（通信販売についての広告）、
            第12条（誇大広告等の禁止）、第13条（未承諾者に対する電子メール広告の提供の禁止等）
            に基づいて表示しています。
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
