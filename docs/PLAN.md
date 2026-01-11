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

## AIエージェントファイルの最適化
- **目的**: 複数AI-Agentでの効率的な開発を実現するため、情報の重複を解消
- **作業内容**:
  1. CLAUDE.md と GEMINI.md から汎用・共通項の内容を抽出
  2. 共通内容を新しい `docs/AGENTS.md` に統合
  3. CLAUDE.md と GEMINI.md を各Agent固有内容だけに編集
  4. 各ファイルに「AGENTS.mdを参照」の記述を追加
- **期待効果**:
  - 情報の一元管理によるメンテナンスコスト削減
  - 各Agent固有の指示が明確化
  - プロジェクト情報の一貫性向上
- **実装詳細**:
  - AGENTS.md: プロジェクト概要、技術スタック、ディレクトリ構成、重要なファイル
  - CLAUDE.md: Claude固有の役割、優先事項、注意事項
  - GEMINI.md: Gemini固有の役割、優先事項、注意事項

---

# Code Review Plan (code-review/src-modules)

## 目標
src/ 以下の機能単位でソースコードレビューを実施し、品質改善提案を行う。

## レビュー対象モジュール

### 1. background/ - Service Worker
- **対象ファイル**: `src/background/index.ts`
- **現状**: 空ファイル
- **レビュー項目**: 実装計画の確認

### 2. popup/ - 設定ポップアップUI
- **対象ファイル**: `src/popup/App.tsx`, `src/popup/index.tsx`
- **レビュー項目**:
  - コンポーネント構造
  - 状態管理（useState, useEffect）
  - エラーハンドリング
  - テストカバレッジ
  - アクセシビリティ

### 3. editor/ - メインエディタ
- **対象ファイル**: `src/editor/index.tsx`
- **レビュー項目**:
  - 状態管理の複雑度
  - 非同期処理のエラーハンドリング
  - コンポーネントサイズ（分割可能性）
  - Monaco Editor統合のベストプラクティス

### 4. components/ - UIコンポーネント
- **対象ファイル**: `src/components/PromptInput.tsx`, `src/components/DiffViewer.tsx`
- **レビュー項目**:
  - Propsの型定義
  - 再利用性
  - テストカバレッジ

### 5. lib/gemini/ - AIクライアント
- **対象ファイル**: `src/lib/gemini/client.ts`, `src/lib/gemini/types.ts`
- **レビュー項目**:
  - APIエラーハンドリング
  - レートリミット考慮
  - セキュリティ（APIキー管理）
  - テストカバレッジ
  - プロンプト設計

### 6. lib/storage/ - ストレージ管理
- **対象ファイル**: `src/lib/storage/manager.ts`, `src/lib/storage/types.ts`, `src/lib/storage/manager.test.ts`
- **レビュー項目**:
  - Chrome Storage APIの適切な使用
  - エラーハンドリング
  - テストカバレッジ（モックの適切性）
  - 型安全性

### 7. lib/clasp/ - GASプロジェクト管理
- **対象ファイル**: `src/lib/clasp/manager.ts`, `src/lib/clasp/api.ts`, `src/lib/clasp/types.ts`
- **レビュー項目**:
  - GAS API統合
  - 認証フロー（OAuth2）
  - エラーハンドリング（401/403対応）
  - 同時編集時の競合解決
  - テストカバレッジ

### 8. types/ - 型定義
- **対象ファイル**: `src/types/index.d.ts`
- **現状**: 空ファイル
- **レビュー項目**: 必要性確認

## レビュー基準

| 基準 | 説明 |
|------|------|
| Clean Code | 命名規則、可読性、複雑度 |
| Type Safety | TypeScriptの適切な使用、型定義の完全性 |
| Error Handling | エラーメッセージの明確性、エラー回復戦略 |
| Testing | ユニットテストのカバレッジ、モックの適切性 |
| Performance | 非同期処理の最適化、不要な再レンダリング回避 |
| Security | 機密情報の適切な処理、XSS/注入攻撃対策 |
| Accessibility | ARIA属性、キーボードナビゲーション |
| Maintainability | コードのモジュール化、DRY原則遵守 |

## 実施手順
1. 各モジュールのコードをレビュー
2. 課題・改善点を特定
3. 優先度（High/Medium/Low）を設定
4. docs/WorkingLog.md にレビュー結果を記録
5. 必要に応じて改善タスクを作成

---

# Phase 1-A Implementation Plan (improve/test-coverage)

## 目標
コードレビューで特定されたHigh Priority課題のうち、テストカバレッジ向上に取り組む。

## 対象モジュール
1. `src/popup/App.tsx` - ポップアップコンポーネントのテスト
2. `src/components/PromptInput.tsx` - プロンプト入力コンポーネントのテスト
3. `src/components/DiffViewer.tsx` - 差分表示コンポーネントのテスト
4. `src/lib/gemini/client.ts` - GeminiClientのテスト
5. `src/lib/storage/manager.ts` - StorageManagerのテスト実装
6. `src/lib/clasp/manager.ts` - ClaspManagerのテスト
7. `src/lib/clasp/api.ts` - GASClientのテスト

## 実装手順
1. 各モジュールのテストファイルを作成・更新
2. Vitestテスト環境の設定（Chrome APIモック）
3. テストを実行し、カバレッジを確認
4. `task check` による品質チェック
5. docs/WorkingLog.md に作業結果を記録
6. commit & push
7. PR作成

## 検証
- 各モジュールの主要機能がテストされていること
- テストカバレッジが向上していること
- `npm run test` がすべてパスすること

---

# Phase 1-B Implementation Plan (improve/implementation)

## 目標
コードレビューで特定されたHigh Priority課題のうち、実装改善に取り組む。

## 対象課題
1. **GeminiClient - レート制限追加**
   - リクエストキューの実装
   - 同時リクエストの防止
   - レートリミットエラーのハンドリング

2. **GASClient - トークンリフレッシュ実装**
   - 401エラー時の自動トークンリフレッシュ
   - `chrome.identity.removeAuthToken` 呼び出し
   - 再試行ロジックの実装

3. **EditorApp - コンポーネント分割**
   - `<ProjectHeader />` コンポーネント抽出
   - `<EditorContainer />` コンポーネント抽出
   - カスタムフック `useEditorState()` 実装
   - カスタムフック `useProjectOperations()` 実装

## 実装手順
1. GeminiClientにレート制限機能を追加
2. GASClientにトークンリフレッシュ機能を追加
3. EditorAppを小コンポーネントに分割
4. 各機能のテストを追加
5. `task check` による品質チェック
6. docs/WorkingLog.md に作業結果を記録
7. commit & push
8. PR作成

## 検証
- レート制限が正しく機能すること
- トークンリフレッシュが正しく機能すること
- EditorAppが小さなコンポーネントに分割されていること
- すべてのテストがパスすること
