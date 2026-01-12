# AIエージェント共通情報

このドキュメントは、GAS4Uプロジェクトで使用するAIエージェント（Claude、Gemini等）に共通する情報をまとめています。

## プロジェクト概要

**GAS4U**はGoogle Apps Script (GAS) の開発を支援するChrome拡張機能です。Gemini AIを活用したコード生成、説明、リファクタリング機能を提供し、Monaco Editorベースのコードエディタを統合しています。

### 主な機能
- **AIコード生成**: Gemini APIを使用したコード生成と説明
- **Monaco Editor統合**: VS Code風のリッチなコード環境
- **プロジェクト管理**: GASプロジェクトの直接管理
- **Webプレビュー**: 開発中のUIを標準ブラウザでプレビュー可能
- **Clasp相当機能**: ローカル環境とGAS間のコード同期（pull/push）

### 技術スタック
- **フロントエンド**: React、TypeScript、Tailwind CSS
- **ビルドシステム**: Vite、CRXJS Plugin（Chrome拡張機能用）
- **エディタ**: Monaco Editor (`@monaco-editor/react`)
- **AI**: Google Generative AI SDK (`@google/generative-ai`)
- **プラットフォーム**: Chrome拡張機能 Manifest V3

## ディレクトリ構成

### 主要ディレクトリ
- `src/`: メインソースコード
  - `background/`: 拡張機能のサービスワーカー
  - `popup/`: 拡張機能ポップアップUI
  - `editor/`: メインエディタインターフェース
  - `lib/`: 共有ライブラリ（Geminiクライアント、ストレージマネージャ、Claspロジック）
  - `components/`: 再利用可能なReactコンポーネント
- `docs/`: ドキュメントファイル
- `clasp/`: Claspロジックのカスタム実装

### 設定ファイル
- `package.json` - プロジェクト依存関係とスクリプト
- `tsconfig.json` - TypeScript設定
- `vite.config.ts` - Viteビルド設定
- `vitest.config.ts` - テスト設定
- `eslint.config.js` - ESLintルール
- `.prettierrc` - コードフォーマット設定
- `Taskfile.yml` - 開発タスク自動化

## 重要なファイル

### コアコンポーネント
- `src/background/index.ts` - サービスワーカー実装
- `src/popup/App.tsx` - 設定ポップアップ
- `src/editor/index.tsx` - メインエディタコンポーネント
- `src/lib/gemini/client.ts` - AIクライアント
- `src/lib/clasp/manager.ts` - GASプロジェクト管理

### ユーザーインターフェース
- `src/components/DiffViewer.tsx` - コード差分ビューア
- `src/components/PromptInput.tsx` - AIプロンプト入力インターフェース

### 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# 拡張機能をビルド
npm run build

# すべての品質チェック実行
npm run check

# ビルド済み拡張機能をプレビュー
npm run preview

# テスト実行
npm run test

# テストを監視モードで実行
npx vitest

# テストカバレッジ取得
npx vitest run --coverage
```

## Chrome拡張機能開発

### Chromeへの読み込み手順
1. 拡張機能をビルド: `npm run build`
2. Chrome拡張機能ページを開く: `chrome://extensions/`
3. 「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. `dist/` ディレクトリを選択

### デバッグ方法
- ポップアップとコンテンツスクリプト: Chrome DevTools使用
- バックグラウンドサービスワーカー: 「検証」ビューでログ確認
- コンテンツスクリプト: ページDevToolsでデバッグ

## 開発ガイドライン

### コードスタイル
- TypeScript strictモードを使用
- ESLint設定（React + TypeScriptルール）に従う
- Prettierで一貫したフォーマットを維持
- フックを使用した関数コンポーネントを優先

### テスト戦略
- VitestとJSDOM環境を使用
- Chrome APIは拡張機能固有機能向けにモック化
- ユニットテストと統合テストの両方を実装

### Chrome拡張機能のベストプラクティス
- Chromeストレージを使用したAPIキーの安全な保存
- 適切なマニフェストパーミッション設定
- 拡張機能ライフサイクルイベントの適切な処理
- DOM操作にはコンテンツスクリプトを使用

## AI機能実装

### Gemini統合
- APIキーはChromeストレージに保存
- コード生成、説明、リファクタリングを実装
- APIエラーを適切にハンドリング
- レートリミットを考慮

### コード生成フロー
1. ユーザーがエディタでプロンプト入力
2. Gemini APIがコード提案を生成
3. Diffビューアで変更を表示
4. ユーザーが変更を承認/拒否
5. Monaco Editorにコードを適用

### ストレージ管理
- 安全なAPIキー保存
- ユーザー設定と環境設定
- プロジェクト状態管理
- 拡張機能固有のデータ永続化

## 言語ポリシー
- **ユーザーとのコミュニケーション**: 日本語
- **コードコメント**: 英語
- **コミットメッセージ**: 英語
- **ドキュメント**: docs/以下の *.md は、既に日本語のものは継続して日本語で記述

## 作業フロー
詳細は各エージェント固有のドキュメントを参照:
- **CLAUDE.md**: Claude向けの役割と指示
- **GEMINI.md**: Gemini向けの役割と指示