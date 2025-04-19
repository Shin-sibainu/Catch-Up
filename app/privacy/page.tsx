import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー - Catch Up",
  description: "Catch Upのプライバシーポリシーをご確認ください。",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

      <div className="prose prose-sm max-w-none">
        <p className="mb-8">
          当社は、お客様の個人情報保護の重要性について認識し、個人情報の保護に関する法律（以下「個人情報保護法」といいます）を遵守すると共に、以下のプライバシーポリシー（以下「本ポリシー」といいます）に従い、適切な取扱い及び保護に努めます。
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第1条（個人情報の定義）
          </h2>
          <p>
            本ポリシーにおいて「個人情報」とは、個人情報保護法第2条第1項に定義される「個人情報」を指し、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、メールアドレス等の記述等により特定の個人を識別できる情報を指します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第2条（個人情報の収集方法）
          </h2>
          <p>
            当社は、ユーザーが利用登録をする際に、氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされた取引の状況や内容、ユーザーの閲覧履歴、検索履歴などの情報を、当社のサービスを提供するために収集することがあります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第3条（個人情報を収集・利用する目的）
          </h2>
          <p>当社が個人情報を収集・利用する目的は、以下のとおりです。</p>
          <ol className="list-decimal pl-6 mb-4">
            <li>当社サービスの提供・運営のため</li>
            <li>
              ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）
            </li>
            <li>
              ユーザーに対して、サービスの更新情報、メンテナンス情報、重要なお知らせなど必要な情報を提供するため
            </li>
            <li>
              利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
            </li>
            <li>
              ユーザーにとって有益だと思われる当社のサービス、セミナー、イベント等のご案内を行うため
            </li>
            <li>上記の利用目的に付随する目的</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第4条（個人情報の第三者提供）
          </h2>
          <p>
            当社は、次に掲げる場合を除いて、予めユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>法令に基づく場合</li>
            <li>
              人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
            </li>
            <li>
              公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
            </li>
            <li>
              国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
            </li>
            <li>
              予め次の事項を告知あるいは公表し、かつ当社が個人情報保護委員会に届出をしたとき
              <ol className="list-decimal pl-6 mb-4">
                <li>利用目的に第三者への提供を含むこと</li>
                <li>第三者に提供されるデータの項目</li>
                <li>第三者への提供の手段または方法</li>
                <li>
                  本人の求めに応じて個人情報の第三者への提供を停止すること
                </li>
                <li>本人の求めを受け付ける方法</li>
              </ol>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第5条（個人情報の開示・訂正・利用停止等）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              当社は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
              <ol className="list-decimal pl-6 mb-4">
                <li>
                  本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合
                </li>
                <li>
                  当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合
                </li>
                <li>その他法令に違反することとなる場合</li>
              </ol>
            </li>
            <li>
              前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
            </li>
            <li>
              当社は、ユーザーから、個人情報の訂正、追加、削除または利用停止を求められた場合には、本人であることを確認の上、遅滞なく必要な調査を行い、その結果に基づき、個人情報の内容の訂正、追加、削除または利用停止を行い、その旨をユーザーに通知します。
            </li>
            <li>
              当社は、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第6条（個人情報の利用制限）
          </h2>
          <p>
            当社は、個人情報保護法その他の法令により許容される場合を除き、本人の同意を得ず、利用目的の達成に必要な範囲を超えて個人情報を取り扱いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第7条（Cookie等の使用）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              当サービスは、ユーザーのアクセス情報を収集するためにCookie等を使用することがあります。これらは匿名で収集されるもので、個人を特定するものではありません。
            </li>
            <li>
              ユーザーはブラウザの設定からCookieを無効にすることができますが、その場合、当サービスの一部の機能が利用できなくなる可能性があります。
            </li>
            <li>
              当社は、Cookie情報等の匿名データを統計的な分析に利用し、サービスの改善や新機能の開発に役立てることがあります。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第8条（アクセス解析ツール）
          </h2>
          <p>
            当サービスでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することができます。Googleアナリティクスの利用規約およびプライバシーポリシーに関する詳細は、Google
            アナリティクスのサイトをご覧ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第9条（プライバシーポリシーの変更）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              本ポリシーの内容は、法令変更その他の事由により、必要に応じて変更されることがあります。
            </li>
            <li>
              当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">第10条（お問い合わせ）</h2>
          <p>
            本ポリシーに関するお問い合わせは、
            <a
              href="https://x.com/Shin_Engineer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              開発者のX（Twitter）
            </a>
            までご連絡ください。
          </p>
        </section>

        <div className="mt-12 text-right">
          <p>制定日：2025年4月19日</p>
        </div>
      </div>
    </div>
  );
}
