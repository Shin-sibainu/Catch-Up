import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 - Catch Up",
  description: "Catch Upの利用規約をご確認ください。",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">利用規約</h1>

      <div className="prose prose-sm max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">第1条（目的）</h2>
          <p>
            本利用規約（以下「本規約」といいます）は、当社が提供するZenn、Qiita、HackerNewsの情報をキュレーションするサービス（以下「本サービス」といいます）の利用条件を定めるものです。ユーザーの皆様（以下「ユーザー」といいます）は、本規約に同意の上、本サービスをご利用いただくものとします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">第2条（本規約の適用）</h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              本規約は、本サービスの提供条件および当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
            </li>
            <li>
              当社が本サービス上で掲載する諸規定や追加規約等は、本規約の一部を構成するものとします。
            </li>
            <li>
              本規約の内容と、前項の諸規定または追加規約等の内容が異なる場合には、後者の内容が優先して適用されるものとします。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">第3条（定義）</h2>
          <p>
            本規約において使用する以下の用語は、それぞれ以下の意味を有するものとします。
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              「コンテンツ」とは、文章、画像、動画、プログラム、コード、データその他の情報のことをいいます。
            </li>
            <li>
              「本コンテンツ」とは、本サービスを通じて提供されるコンテンツを指します。
            </li>
            <li>
              「外部サービス」とは、Zenn、Qiita、HackerNews等、本サービスがキュレーションの対象とする他社のサービスを指します。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">第4条（登録）</h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              本サービスの利用を希望する者（以下「登録希望者」といいます）は、本規約に同意し、当社の定める方法で登録の申請を行うことができます。
            </li>
            <li>
              当社は、登録の申請者に対し、登録を拒否する場合があります。登録を拒否した場合、当社はその理由を開示する義務を負いません。
            </li>
            <li>
              登録の申請者が本規約に同意した時点で、登録申請者と当社との間で、本規約を内容とする本サービスの利用契約が成立するものとします。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第5条（アカウント管理）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              ユーザーは、自己の責任において、本サービスのアカウント情報を適切に管理するものとします。
            </li>
            <li>
              ユーザーは、いかなる場合にも、アカウント情報を第三者に譲渡または貸与してはならないものとします。
            </li>
            <li>
              アカウント情報の管理不十分、使用上の過誤、第三者の使用等によって生じた損害に関する責任はユーザーが負うものとし、当社は一切の責任を負いません。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">第6条（禁止事項）</h2>
          <p>
            ユーザーは、本サービスの利用にあたり、以下の行為をしてはならないものとします。
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>
              当社、外部サービス提供者、他のユーザーまたはその他の第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利または利益を侵害する行為
            </li>
            <li>
              本サービスのネットワークまたはシステム等に過度な負荷をかける行為
            </li>
            <li>本サービスの運営を妨害するおそれのある行為</li>
            <li>不正アクセスをし、またはこれを試みる行為</li>
            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
            <li>当社のサーバーに過度の負担をかける行為</li>
            <li>本サービスの正常な運営を妨害する行為</li>
            <li>その他、当社が不適切と判断する行為</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第7条（著作権および引用）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              本サービスで提供される本コンテンツの著作権は、外部サービスの利用規約に従います。
            </li>
            <li>
              本サービスは、外部サービスのコンテンツを適切に引用し、出典を明記します。
            </li>
            <li>
              ユーザーは、外部サービスのコンテンツを利用する際には、それぞれの外部サービスの利用規約を遵守するものとします。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第8条（外部サービスとの関係）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              本サービスは、Zenn、Qiita、HackerNewsなどの外部サービスのAPIを利用してコンテンツを取得・表示していますが、これらの外部サービスとは一切の資本関係、業務提携関係はありません。
            </li>
            <li>
              本サービスで表示されるコンテンツの内容については、それぞれの外部サービスの運営者および投稿者に帰属し、当社はその内容について一切の責任を負いません。
            </li>
            <li>
              外部サービスのAPIの仕様変更やサービス終了等により、本サービスの一部または全部の機能が利用できなくなる場合があります。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第9条（本サービスの変更・中断・終了）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              当社は、当社の都合により、本サービスの内容を変更し、または提供を中断・終了することができます。
            </li>
            <li>
              当社は、本サービスの提供の中断・終了によってユーザーに生じた損害について、一切の責任を負いません。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">第10条（免責事項）</h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              当社は、本サービスに関して、その完全性、正確性、有用性、目的適合性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などがないことを明示的にも黙示的にも保証しておりません。
            </li>
            <li>
              当社は、本サービスに関してユーザーと他のユーザーまたは第三者との間において生じた取引、連絡、紛争等について、一切責任を負いません。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第11条（個人情報の取扱い）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              当社は、本サービスの提供にあたり、適用される個人情報保護法令を遵守します。
            </li>
            <li>
              当社のプライバシーポリシーは、本サービスのウェブサイト上で確認することができます。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">第12条（本規約の変更）</h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>当社は、本規約を変更できるものとします。</li>
            <li>
              当社は、本規約を変更した場合には、ユーザーに当該変更内容を通知するものとし、当該変更内容の通知後、ユーザーが本サービスを利用した場合または当社の定める期間内に登録取消の手続をとらなかった場合には、ユーザーは本規約の変更に同意したものとみなします。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第13条（通知または連絡）
          </h2>
          <p>
            ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第14条（権利義務の譲渡禁止）
          </h2>
          <p>
            ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            第15条（準拠法・裁判管轄）
          </h2>
          <ol className="list-decimal pl-6 mb-4">
            <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
            <li>
              本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
            </li>
          </ol>
        </section>

        <div className="mt-12 text-right">
          <p>制定日：2025年4月19日</p>
        </div>
      </div>
    </div>
  );
}
