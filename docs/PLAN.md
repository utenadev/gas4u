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

---

# Cleanup Plan (refactor/cleanup-files2)

## 目標
- プロジェクトルートおよび `docs/` 内の整理を行い、開発に関連の薄くなったドキュメントや一時ファイルを `t/` (temporary) ディレクトリへ退避させる。

## 対象ファイル
- `docs/llm/` (ディレクトリ)
- `docs/COMMAND_MEMO.md`
- `docs/idea.md`
- `docs/tasks.md`
- `docs/IMPLEMENTATION_GUIDE.md`
- `build_log.txt`, `build_log_2.txt`

## 手順
1. `t/` ディレクトリの作成（`.gitignore` 済み）。
2. 対象ファイルを `t/` へ移動。
3. 文書構造のクリーンアップ確認。

---

# Taskfile Integration Plan (feat/add-taskfile)

## 目標
- 開発ワークフローを統一・効率化するために `go-task` (`Taskfile.yml`) を導入する。
- 合わせて、品質管理ツール (Lint, Format, Test) を整備する。

## 導入パッケージ
- **Linter**: `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- **Formatter**: `prettier`, `eslint-config-prettier`
- **Testing**: `vitest`

## 作業手順
1. 必要なnpmパッケージのインストール。
2. 設定ファイルの作成 (`.eslintrc.cjs`, `.prettierrc`, `vitest.config.ts`)。
3. `Taskfile.yml` の作成。
4. `package.json` の `scripts` 調整（必要であれば）。

## ステートマシン図作成
- GAS4Uプロジェクトのステートマシンを分析・文書化
- `docs/StateMachineDiagrams.md` に以下の内容を追記：
  - メインエディタコンポーネントの状態遷移
  - ポップアップ設定コンポーネントの状態管理
  - プロンプト入力コンポーネントのUI状態
  - 非同期処理の一般的な状態遷移パターン
  - 差分表示モードの状態管理
  - ASCIIアートとMermaid記法の両方で表現
  - Mermaidの利点と使用方法の記載
