# Step 3 Implementation Plan - Core Libraries & Basic UI

## 目標
- **FR-004: Gemini API管理** の実装
  - APIキーをChromeの`storage.local`に安全に保存する仕組み。
  - ポップアップ画面でAPIキーを設定できるUI。
- **FR-001: AIコード生成** のコアクライアント実装
  - Gemini APIを呼び出すクライアントクラスの移植と調整。

## 実装詳細

### 1. Storage Manager (`src/lib/storage/`)
- `types.ts`: 保存するデータ型定義（`AppSettings`など）。
- `manager.ts`: `chrome.storage.local` のラッパー。`getApiKey`, `setApiKey` などのヘルパーメソッドを提供。

### 2. Gemini Client (`src/lib/gemini/`)
- `types.ts`: APIレスポンスやリクエストの型定義。
- `client.ts`: `@google/generative-ai` のラッパークラス。
  - コンストラクタでAPIキーを受け取る。
  - `generateCode(prompt, currentCode)` メソッド。
  - レガシーコード (`legacy/lib/gemini.ts`) をベースにするが、エラーハンドリングを強化。

### 3. Popup UI (`src/popup/`)
- `index.tsx` / `App.tsx` (or similar):
  - Tailwind CSSを使用したモダンなUI。
  - APIキー入力フォーム。
  - 保存成功時のフィードバック（トースト通知など）。

## 検証
- `npm run build` が通ること。
- Chrome拡張として読み込み、ポップアップでAPIキーが保存・読み出しできること（手動確認）。
