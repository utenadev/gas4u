# GAS4U 詳細設計

## アーキテクチャ

### ハイレベル構造
Manifest V3 で構築された Chrome 拡張機能です。

- **ポップアップ/サイドパネル**: アクティブなプロジェクトの状態へのクイックアクセス、AI チャットインターフェース。
- **エディタページ**: コーディング専用のフルタブまたはオーバーレイインターフェース。
- **バックグラウンド Service Worker**: Gemini API および Google Apps Script API (clasp ロジック経由) との通信を処理。
- **ストレージ層**: Chrome Storage / IndexedDB のラッパー。

## コンポーネント設計

### 1. AI モジュール
- **クライアント**: Gemini API のラッパー。
- **プロンプトエンジニアリング**: コンテキストを認識したコード生成のためのシステム指示 (GAS 固有のライブラリを認識)。
- **フロー**:
    1. ユーザーリクエスト -> 2. コンテキスト取得 (現在のファイル、プロジェクト) -> 3. Gemini API -> 4. レスポンス解析 -> 5. 差分表示 -> 6. 適用。

### 2. エディタモジュール
- **エンジン**: JS/GAS のサポートに優れた Monaco Editor (VS Code エンジン) を推奨。
- **統合**:
    - GAS の型/自動補完のためのカスタムプロバイダー。
    - AI 提案のためのインライン差分表示。

### 3. 同期モジュール (Clasp アダプター)
- **場所**: `./clasp` 統合。
- **機能**:
    - `pull()`: script.google.com から取得。
    - `push()`: script.google.com へアップロード。
- **認証**: GAS API に必要な Google OAuth トークンを処理。

### 4. UI/UX フロー
- **セットアップ**: ユーザーが Gemini API キーを入力 -> 検証 -> 保存。
- **プロジェクト初期化**: 既存の GAS プロジェクトを選択または新規作成 -> ローカルにクローン。
- **開発**:
    - ユーザーが入力または AI に依頼。
    - AI が変更を提案 -> 差分ビューを表示。
    - ユーザーが承認 -> エディタ内のコードを更新。
- **デプロイ**: ユーザーが Push をクリック -> GAS に同期。

## データスキーマ (ローカル)

### `settings`
```json
{
  "geminiApiKey": "...",
  "theme": "dark|light"
}
```

### `projects`
```json
[
  {
    "id": "uuid",
    "name": "My Script",
    "scriptId": "1B7...",
    "lastSynced": "timestamp"
  }

## 技術スタックと開発環境

### 推奨スタック
- **フレームワーク**: React (UI構築のため)
- **ビルドツール**: Vite (高速なビルドとHMR)
- **言語**: TypeScript (型安全性のため)
- **エディタコンポーネント**: `@monaco-editor/react` (VS Codeライクな体験)
- **CSS**: Tailwind CSS (迅速なスタイリング)

### ソースコード構成案
```text
root/
├── src/
│   ├── manifest.json      # Manifest V3 定義
│   ├── background/        # Service Worker (API通信, Clasp連携)
│   │   └── index.ts
│   ├── popup/             # ポップアップUI (簡易操作)
│   │   ├── index.html
│   │   └── App.tsx
│   ├── editor/            # メインエディタ画面 (フルページ/タブ)
│   │   ├── index.html
│   │   └── App.tsx
│   ├── lib/               # 共有ロジック
│   │   ├── gemini/        # Gemini API クライアント
│   │   ├── clasp/         # Clasp 互換ロジック
│   │   └── storage/       # 保存処理ラッパー
│   └── components/        # 共通UIコンポーネント
├── dist/                  # ビルド成果物 (Chromeに読み込ませる)
├── vite.config.ts         # ビルド設定
└── package.json
```

## デバッグと開発戦略

### Chrome拡張のデバッグ
1.  **UI (Popup/Editor)**:
    - 通常のWeb開発と同様に、右クリック ->「検証」でDevToolsを使用。
    - React DevTools も利用可能。
2.  **Background Script (Service Worker)**:
    - `chrome://extensions` ページから該当拡張機能の "Service Worker" リンクをクリックしてDevToolsを開く。
    - `console.log` はここのコンソールに出力される。
    - **注意**: Service Worker はアイドル時に停止するため、状態はメモリではなく `chrome.storage` に永続化する必要がある。

### 開発効率化 (Hot Reload)
- Vite のプラグイン (例: `@crxjs/vite-plugin`) を使用することで、コード変更時に自動的に拡張機能をリロードさせる。
- これにより、手動で「拡張機能を再読み込み」する手間を省く。

### Clasp連携のテスト
- 実際の Google API を叩く部分はモック化しにくいが、ロジック部分は単体テスト (Vitest) でカバーする。
- 実際の API 通信は、開発者自身の API Key / OAuth トークンを用いて手動テストを行うフローを確立する。

### Antigravity (AI) による検証戦略
Antigravity のブラウザ操作機能では、開発中の未パッケージ化された拡張機能を直接読み込んでテストすることが困難です。そのため、以下の構成を採用します。

1.  **UIのWebプレビュー化**:
    - `popup` や `editor` の画面を、Chrome拡張としてだけでなく、通常のWebページとしても表示できるようにする。
    - Vite の開発サーバーで `http://localhost:5173/popup` のようにアクセス可能にする。
2.  **Chrome API のモック**:
    - 通常のブラウザ環境では `chrome.runtime` や `chrome.storage` が存在しないため、開発モード用のモック層 (`mock/chrome.ts`) を用意する。
    - これにより、Antigravity がブラウザでアクセスして UI の描画や挙動を検証できるようにする。
