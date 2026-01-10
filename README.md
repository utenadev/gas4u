# GAS4U - Google Apps Script Development Assistant

<p align="center">
  <img src="public/icons/icon128.png" alt="GAS4U Logo" width="128" height="128" />
</p>

AI搭載のChrome拡張機能で、Google Apps Script（GAS）開発を革新的に効率化します。
モダンなエディタ、AIによるコード生成、そしてシームレスなGASプロジェクト連携を提供します。

## 🚀 主な機能

- **✨ AI コード生成**: Gemini APIを活用し、自然言語でGASコードを生成・修正・リファクタリング。
- **📝 Monaco Editor**: VS Codeライクな高機能エディタで、シンタックスハイライトや快適な編集体験を提供。
- **🔄 GASプロジェクト連携**: Script IDを入力するだけで、既存のGASプロジェクトを直接ロード・編集・保存可能。
- **👀 差分確認 (Diff View)**: AIが提案した変更を、適用前に見やすい差分ビューで確認・承認。
- **🔐 セキュアな管理**: APIキーなどの重要情報はローカルストレージで安全に管理。
- **🎨 Premium UI**: Tailwind CSSによる洗練されたモダンで使いやすいインターフェース。

## 📦 技術スタック

- **Core**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite + @crxjs/vite-plugin
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **AI**: Gemini API (`@google/generative-ai`)
- **Platform**: Chrome Extension Manifest V3

## 🛠️ インストールと開発

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール手順

```bash
# クローン
git clone <repository-url>
cd gas4u

# 依存関係のインストール
npm install
```

### Chrome拡張機能のビルド

```bash
npm run build
```
ビルド成果物は `dist/` ディレクトリに出力されます。

### Chromeへの読み込み
1. Chrome で `chrome://extensions/` を開く。
2. 右上の「デベロッパーモード」を有効にする。
3. 「パッケージ化されていない拡張機能を読み込む」をクリック。
4. プロジェクト内の `dist/` ディレクトリを選択。

## 📖 使い方

### 1. 初期設定 (API Key)
1. 拡張機能のアイコンをクリックしてポップアップを開く。
2. [Google AI Studio](https://aistudio.google.com/) で取得した **Gemini API Key** を入力して保存。

### 2. GASプロジェクトの編集
1. `editor.html` (または拡張機能メニューの "Open Editor") を開く。
2. 編集したいGASプロジェクトの **Script ID** を入力して `Load` をクリック。
   - ※ 初回はGoogleアカウントの認証が求められます。
3. コードが表示されたら、Monaco Editorで自由に編集。

### 3. AIによるコード生成
1. エディタ下部のプロンプト入力欄に、やりたいことを入力（例: "スプレッドシートのデータをJSONで返すAPIを作って"）。
2. `Generate` をクリック。
3. AIが生成したコードとの差分が表示されるので、内容を確認して `Accept` で適用。

### 4. 保存
1. `Save to GAS` ボタンをクリックして、変更をGASプロジェクトに反映。

## 📁 プロジェクト構造

```
gas4u/
├── src/
│   ├── background/      # Service Worker (認証等)
│   ├── components/      # UIコンポーネント (DiffViewer, PromptInput等)
│   ├── editor/          # メインエディタ画面 (Monaco Editor統合)
│   ├── lib/             # コアロジック
│   │   ├── clasp/       # GAS API連携 (ClaspManager)
│   │   ├── gemini/      # AI連携 (GeminiClient)
│   │   └── storage/     # 状態管理
│   ├── popup/           # 設定ポップアップ
│   └── types/           # 型定義
├── public/              # 静的アセット (アイコン等)
└── docs/                # ドキュメント
```

## 🎯 開発状況

- [x] プロジェクト基盤構築 (Vite, React, TS)
- [x] UI実装 (Premium Design, Tailwind CSS)
- [x] Gemini API連携 (コード生成)
- [x] GASプロジェクト連携 (Load/Save via GAS API)
- [x] 差分表示 (Diff View) 実装
- [x] エディタ機能 (Monaco Editor)
- [ ] テストコード生成機能
- [ ] 複数ファイル同時編集のサポート強化

## 📄 ライセンス

MIT
