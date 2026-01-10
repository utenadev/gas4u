# BLUEPRINT: GAS4U

## 1. 技術スタック (Chrome Extension with GAS Integration)
- **Frontend Framework**: `React` (with TypeScript) - UIコンポーネントの構築
- **UI Library**: `Tailwind CSS` (with `clsx` and `tailwind-merge`) - スタイリング
- **Editor Component**: `@monaco-editor/react` - 高機能コードエディタ
- **Build Tool**: `Vite` (with `@crxjs/vite-plugin`) - 開発サーバーとビルド
- **Language**: `TypeScript` - 型安全な開発
- **AI Integration**: `@google/generative-ai` - Gemini APIとの連携
- **Extension API**: Chrome Extension Manifest V3 - 拡張機能の基盤

## 2. アーキテクチャ

### 2.1 ディレクトリ構成
```
gas4u/
├── src/
│   ├── background/          # Background Service Worker
│   │   └── index.ts         # サービスワーカーのエントリーポイント
│   ├── popup/               # ポップアップUI
│   │   ├── index.html
│   │   └── index.tsx        # Reactアプリケーション
│   ├── editor/              # エディタコンポーネント
│   ├── lib/                 # 共通ライブラリ
│   │   ├── gemini/          # Gemini APIクライアント
│   │   ├── storage/         # ローカルストレージラッパー
│   │   └── clasp/           # GASプロジェクト管理ロジック
│   ├── types/               # TypeScript型定義
│   └── manifest.json        # Chrome拡張マニフェスト
├── clasp/                   # 独自clasp実装
│   ├── Clasp.js             # GAS APIとの通信、プロジェクト管理
│   └── interfaces.js        # 型定義
├── docs/                    # ドキュメント
│   ├── SPEC.md              # 要件定義書
│   ├── BLUEPRINT.md         # 技術設計書
│   ├── SPEC.sample.md       # サンプル要件定義書
│   └── BLUEPRINT.sample.md  # サンプル技術設計書
├── dist/                    # ビルド出力
├── node_modules/            # npm依存パッケージ
├── package.json             # プロジェクトメタデータと依存関係
├── tsconfig.json            # TypeScript設定
├── vite.config.ts           # Viteビルド設定
├── tailwind.config.js       # Tailwind CSS設定
└── postcss.config.js        # PostCSS設定
```

## 3. コンポーネント定義 (Component Definitions)

本システムでは、以下の役割を持つ「コンポーネント」を定義し、機能を分離します。

### 3.1 Gemini API Client (The AI Interface)
- **役割**: Gemini APIとの通信を担当し、AIによるコード生成や補完機能を提供する。
- **機能**:
    - APIキー管理
    - モデル選択 (Gemini Flash/Pro)
    - プロンプト処理
    - 生成されたコードの返却

### 3.2 Clasp Manager (The Project Sync)
- **役割**: GASプロジェクトとローカルのソースコードを同期するclasp相当の機能。
- **機能**:
    - プロジェクトのプル（GASからローカルへ）
    - プロジェクトのプッシュ（ローカルからGASへ）
    - 認証管理（アクセストークンの取得・更新）

### 3.3 Storage Manager (The Data Keeper)
- **役割**: ローカルストレージを管理し、APIキー、プロジェクト設定、認証情報を安全に保存する。
- **機能**:
    - 設定の保存と読み込み
    - 機密情報の暗号化（基本的な保護）
    - データの一貫性維持

### 3.4 Editor Component (The Code Interface)
- **役割**: ユーザーがコードを編集するためのインターフェース。
- **機能**:
    - Monaco Editorの統合
    - GAS用のシンタックスハイライト
    - コード補完機能

## 4. データフロー (Main Operations)

### 4.1 GASプロジェクトの編集フロー
1. **User**: Chrome拡張のポップアップを開く。
2. **Storage Manager**: プロジェクト設定と認証情報を読み込む。
3. **Clasp Manager**: GASプロジェクトからファイルをプルする。
4. **Editor Component**: 取得したコードをMonaco Editorで表示。
5. **User**: コードを編集する。
6. **Clasp Manager**: 編集したコードをGASプロジェクトにプッシュする。

### 4.2 AIコード生成フロー
1. **User**: AIによるコード生成を要求。
2. **Gemini API Client**: ユーザーの指示と現在のコードをコンテキストとして送信。
3. **Gemini API**: 新しいコードを生成。
4. **Editor Component**: 生成されたコードを差分表示。
5. **User**: 生成されたコードを承認または修正。
6. **Clasp Manager**: 承認されたコードをGASプロジェクトにプッシュ。

## 5. 将来の拡張
- **テスト生成**: SPECに基づいてGASプロジェクトのテストコードを自動生成。
- **デバッグ支援**: AIを使用したエラーログ解析と修正提案。
- **バージョン管理**: Git相当の機能でコード変更履歴を管理。
- **チーム連携**: 複数ユーザーでのプロジェクト共同作業機能。