export interface Course {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export const courses: Course[] = [
  {
    id: "dev-course-5",
    title: "【ShinCode Pro】AI駆動開発マスターコース",
    description:
      "本アプリ「Catch Up」を0から100までAIで開発している講座になります。6週間かけてAI駆動開発で作成しています。アイデア出しから要件定義、設計や開発、ローンチと集客戦略まで学べる講座です。国内では数少ないAI駆動Web開発となっています。",
    url: "https://code-s-school-5bc2.thinkific.com/bundles/ai-driven-master-course",
    thumbnail: "/images/courses/ai-driven-master-course-thumbnails.png",
  },
  {
    id: "dev-course-1",
    title:
      "【AI駆動開発入門】Cursor × Bolt new × ClaudeでフルスタックWebアプリケーションを構築しよう",
    description:
      "AIだけWebアプリ開発する手法「Vibe Coding」を徹底解説します。本講座ではXクローン開発を通じて、非エンジニアの方でもWebアプリ開発ができるような講座となっています。個人開発や自社サービスを作りたい！という方は必見の内容です。。",
    url: "https://www.udemy.com/course/ai-driven-webdev-tutorial-with-cursor-claude-boltnew/?couponCode=312124025026E8034733",
    thumbnail: "/images/courses/ai-driven-tutorial.png",
  },
  {
    id: "dev-course-2",
    title:
      "画像生成AI SaaSを作りながらNext.js App RouterとStripeサブスク決済機能が学べる実践開発講座",
    description:
      "Next.js App Router/Stripe/Clerk/Prisma/Stable Difussion APIを使ってAI SaaSを開発します。個人開発では必須のStripe決済機能実装とClerk認証まで学べます。",
    url: "https://www.udemy.com/course/ai-saas-nextjs-app-router-with-stripe/?couponCode=A98108054E0F720932E7",
    thumbnail: "/images/courses/ai-saas-with-nextjs-and-stripe.png",
  },
  {
    id: "dev-course-3",
    title:
      "実例で学ぶNext.js App Routerの基礎とベストプラクティス完全マスター講座",
    description:
      "Next.js AppRouter開発における基礎とベストプラクティスを網羅的に学べる講座です。ルーティング/コンポーネント/データフェッチ/キャッシュ/レンダリング/メタデータ/ミドルウェアまでこの講座1つで完全マスターできます。",
    url: "https://www.udemy.com/course/nextjs-app-router-basic-and-best-practice/?couponCode=E70FB08D750BAD1063E2",
    thumbnail: "/images/courses/nextjs-best-practice-for-udemy-mod.png",
  },
  {
    id: "dev-course-4",
    title:
      "【最先端】Next.js15マスター講座 - ServerActions/新登場HooksをSNS開発で理解しよう -",
    description:
      "Next.js15をSNSを開発で学ぶ講座です。useOptimistic/useFormState/ServerActionsを学ぶことができます。認証はClerkを採用しておりWebhooksを使ってSupabaseとの連携まで行います",
    url: "https://www.udemy.com/course/nextjs15-newhooks-with-sns-dev/?couponCode=393DB5488195D49A9141",
    thumbnail: "/images/courses/nextjs15-new-hooks-shincode-camp.png",
  },
  {
    id: "dev-course-4",
    title:
      "Next.js × shadcn/ui × Supabaseで本格的なWebアプリ開発を学ぶフルスタック講座",
    description:
      "世界トップクラスのエンジニア「shadcn」のプロジェクトからモダンな技術スタックを通して、Webアプリ開発を学ぶ講座です。API Routeを使ったAPI開発やNextAuth.jsを使ったユーザー認証まで幅開く解説しています。",
    url: "https://www.udemy.com/course/nextjs-shadcn-fullstack-webapp-dev/?couponCode=83791B1FC10701AC3864",
    thumbnail: "/images/courses/stripe-with-creating-saas-mod.png",
  },
];

// react test : https://www.udemy.com/course/react-frontend-test-tutorial/?couponCode=1C820DF289C058203F5F
// notionblog : https://www.udemy.com/course/notion-nextjs-blog-dev/?couponCode=C57C1C4E21E29DC2BDD5
// tailwindcss : https://www.udemy.com/course/tailwindcss-for-beginner/?couponCode=6F2556DD96416E5DCD15
