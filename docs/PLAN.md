# Step 5 Implementation Plan - GAS Integration (Clasp features)

## 目標
- **FR-002: GASプロジェクト管理**
- **FR-003: ソースコード同期**
- Google Apps Script API と連携し、プロジェクトの取得(pull)と更新(push)を実現する。

## 実装詳細

### 1. Manifest Update (`src/manifest.json`)
- `oauth2` セクションの追加。
  - Scope: `https://www.googleapis.com/auth/script.projects`, `https://www.googleapis.com/auth/script.webapp.deploy` など。
- `permissions` に `identity` を追加。
- `host_permissions` に `https://script.googleapis.com/*` を追加。

### 2. Clasp Types (`src/lib/clasp/types.ts`)
- GAS APIのレスポンス型（`File`, `Project`）を定義。
- ローカル独自の型定義。

### 3. GAS API Client (`src/lib/clasp/api.ts`)
- `chrome.identity.getAuthToken` でアクセストークンを取得。
- REST API (`https://script.googleapis.com/v1/projects/...`) を叩くラッパー。
  - `getContent(scriptId)`
  - `updateContent(scriptId, files)`

### 4. Clasp Manager (`src/lib/clasp/manager.ts`)
- UIとAPIの橋渡し。
- エラーハンドリング。

### 5. Editor UI Update (`src/editor/index.tsx`)
- Project ID 入力欄（またはURLから抽出）。
- 「Load Project」「Save Project」ボタンの追加。
- ロード時のコード反映、保存時のコード送信処理。

## 注意事項
- **OAuth Client ID**: 開発中は `key` フィールドが無いとIDが変わり、GCP設定と不整合が起きる。今回はコード上はプレースホルダーにし、ユーザーに後で設定してもらうか、インストラクションを提供する。

## 検証
- Editor画面でScript IDを入力し、ロードできるか。
- 編集して保存できるか。
