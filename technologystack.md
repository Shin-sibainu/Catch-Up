# 技術スタック

## フロントエンド

### コアテクノロジー

- **Next.js** (v13.5.1) - React フレームワーク
- **React** (v18.2.0) - UI ライブラリ
- **TypeScript** (v5.2.2) - 型付き JavaScript

### UI コンポーネント

- **Radix UI** - アクセシブルなヘッドレス UI コンポーネント
  - Accordion, Alert Dialog, Avatar, Tabs など多数のコンポーネントを使用
- **Lucide React** (v0.446.0) - アイコンライブラリ
- **Tailwind CSS** (v3.3.3) - ユーティリティファースト CSS フレームワーク
  - tailwind-merge - クラス名の最適化
  - tailwindcss-animate - アニメーション機能

### 状態管理・データフェッチ

- **SWR** (v2.2.5) - データフェッチとキャッシュ
- **React Query** (v3.39.3) - サーバー状態管理
- **React Hook Form** (v7.53.0) - フォーム管理
- **Zod** (v3.23.8) - スキーマ検証

### 認証

- **Clerk** (v4.31.7) - 認証・ユーザー管理

## バックエンド

### データベース

- **Prisma** (v5.11.0) - TypeSafe ORM
  - @prisma/client - データベースクライアント

## ユーティリティ

### 日付処理

- **date-fns** (v3.6.0) - 日付操作ライブラリ

### UI 拡張

- **cmdk** (v1.0.0) - コマンドパレット
- **embla-carousel-react** (v8.3.0) - カルーセル
- **react-day-picker** (v8.10.1) - 日付ピッカー
- **recharts** (v2.12.7) - チャート作成
- **sonner** (v1.5.0) - トースト通知
- **vaul** (v0.9.9) - モーダル・ドロワー

## 開発ツール

- **ESLint** (v8.49.0) - コード品質管理
- **Autoprefixer** (v10.4.15) - CSS ベンダープレフィックス自動付与
- **PostCSS** (v8.4.30) - CSS トランスフォーメーション

## 特徴

- Server Components 対応
- Incremental Static Regeneration (ISR)の実装
- レスポンシブデザイン
- アクセシビリティ対応
- 型安全性の確保
