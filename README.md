# GAS4U - Google Apps Script Development Assistant

AI搭載のChrome拡張機能で、Google Apps Script（GAS）開発を効率化します。

## 🚀 主な機能

- **✨ AI コード生成**: Gemini APIを使用したコード生成・解説機能
- **📝 Monaco Editor**: VS Codeと同じエディタで快適なコーディング
- **📁 プロジェクト管理**: GASプロジェクトの一覧表示と管理
- **🔄 Webプレビュー**: ブラウザで拡張機能のUIをプレビュー

## 📦 技術スタック

- **フロントエンド**: React + TypeScript + Tailwind CSS
- **ビルド**: Vite + CRXJS Plugin (Chrome Extension用)
- **エディタ**: Monaco Editor (`@monaco-editor/react`)
- **AI**: Gemini API (`@google/generative-ai`)

## 🛠️ 開発環境のセットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd gas4u

# 依存関係のインストール
npm install
```

### 開発サーバーの起動

```bash
# Webプレビュー用の開発サーバー
npm run dev
```

ブラウザで `http://localhost:5173/` を開くと、開発ダッシュボードが表示されます。

### ビルド

```bash
# Chrome拡張機能としてビルド
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

## 📖 使い方

### Webプレビュー

1. `npm run dev` で開発サーバーを起動
2. `http://localhost:5173/` でダッシュボードにアクセス
3. "Open Popup" または "Open Editor" をクリック

### Chrome拡張機能として使用

1. `npm run build` でビルド
2. Chrome で `chrome://extensions/` を開く
3. 「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. `dist/` ディレクトリを選択

### AIコード生成の使用

1. Editor画面で「✨ AI Generate」ボタンをクリック
2. プロンプトを入力（例: "SpreadSheetのA列の値を全て取得する関数を作成"）
3. 「生成」をクリック

**注意**: 初回使用時は、ブラウザの開発者ツール（F12）のConsoleで以下を実行してAPIキーを設定してください：

```javascript
localStorage.setItem('GEMINI_API_KEY', JSON.stringify('your-gemini-api-key'));
```

## 📁 プロジェクト構造

```
gas4u/
├── src/
│   ├── background/      # Background Service Worker
│   ├── components/      # 共通コンポーネント
│   ├── editor/         # Editor画面
│   ├── lib/            # ライブラリ（AI, Storage, Clasp）
│   ├── mock/           # Chrome API モック
│   ├── popup/          # Popup画面
│   └── types/          # 型定義
├── docs/               # ドキュメント
└── index.html          # Webプレビュー用ダッシュボード
```

## 🎯 現在の開発状況

- ✅ フェーズ1: プロジェクト基盤構築
- ✅ フェーズ2: UI実装とプレビュー環境
- ✅ フェーズ3: コアロジック実装
- 🚧 フェーズ4: 統合と検証（進行中）

詳細は [`docs/tasks.md`](./docs/tasks.md) を参照してください。

## 📝 次のステップ

- [ ] APIキー設定画面の実装
- [ ] Google Apps Script APIとの連携
- [ ] 実際のGASプロジェクトの読み込み・保存機能
- [ ] 差分表示（Diff View）の実装

## 📄 ライセンス

MIT

## 🤝 貢献

プルリクエストを歓迎します！
