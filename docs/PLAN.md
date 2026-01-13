# Step 5 Implementation Plan - GAS Integration (Clasp features) [Completed]

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

# Cleanup Plan (refactor/cleanup-files2) [Completed]

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

# Taskfile Integration Plan (feat/add-taskfile) [Completed]

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

# Code Review Plan (code-review/src-modules) [Completed]

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

# Phase 1-A Implementation Plan (improve/test-coverage) [Completed]

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

# Phase 1-B Implementation Plan (improve/implementation) [Completed]

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
   - カスタムフック `useGeminiIntegration()` 実装

## 実装手順
1. GeminiClientにレート制限機能を追加
2. GASClientにトークンリフレッシュ機能を追加
3. EditorAppを小コンポーネントに分割
   - `ProjectHeader.tsx`: プロジェクトID入力欄とLoad/Saveボタンを担当
   - `EditorContainer.tsx`: Monaco Editor本体を担当
   - `useEditorState.ts`: エディターの状態管理（コード、カーソル位置、テーマ等）
   - `useProjectOperations.ts`: プロジェクト操作（load/save）のロジック
   - `useGeminiIntegration.ts`: Gemini AIとの連携ロジック
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

---

# Phase 1: Restore Environment (chore/restore-env) [Completed]

## 目標
`node_modules` が欠落している状態から、開発環境を復旧させる。

## 作業手順
1. ブランチ `chore/restore-env` 作成
2. `npm install` 実行
3. `task check` (または `npm test`) でツールチェーンが動作することを確認（テスト自体の成否は問わない）
4. 作業ログ記録

## 検証
- `npm run dev` や `npm test` コマンドが実行可能になること。

---

# Phase 2: Test Infrastructure (chore/test-infrastructure) [Completed]

## 目標
テスト環境を整備し、`npm test` がエラーなく実行できるようにする（テスト自体の失敗は許容するが、実行時エラーは解消する）。特に、Chrome API Mock の不足と Monaco Editor の互換性問題を解決する。

## 作業手順
1. ブランチ `chore/test-infrastructure` 作成
2. `src/test/setup.ts` の Chrome API Mock を拡充（storage, runtime等）
3. `src/test/mocks/monaco.tsx` を作成し、Monaco Editor をダミーコンポーネントに置換
4. `src/test/setup.ts` で Monaco Mock を適用
5. `npm test` を実行し、実行時エラー（TypeError等）が解消されるか確認
6. 作業ログ記録

## 検証
- `npm test` 実行時に "Chrome is not defined" や Monaco 関連のレンダリングエラーが発生しないこと。

---

# Phase 3: Implement Missing Tests (feat/phase3-tests) [Completed]

## 目標
`WorkingLog.md` (Phase 1-A) で言及されていた未実装のテストを追加し、プロジェクトの信頼性を担保する。

## 作業手順
1. ブランチ `feat/phase3-tests` 作成
2. `src/lib/storage/manager.ts` のテスト実装 (`src/lib/storage/manager.test.ts`)
   - APIキーの保存・取得・削除
   - エラーハンドリング
3. `src/lib/gemini/client.ts` のテスト実装 (`src/lib/gemini/client.test.ts`)
   - API呼び出しのMock化
   - レート制限の動作確認
4. `src/components/DiffViewer.tsx` のテスト実装 (`src/components/DiffViewer.test.tsx`)
   - Mockコンポーネントがレンダリングされることの確認
5. `npm test` (または `npx vitest run`) で全テストが通過することを確認
6. 作業ログ記録

## 検証
- すべてのテストファイルがパスすること。
- テストカバレッジが向上していること（オプション）。

---

# Code Review Refactoring Plan (refactor/code-review-20250112) [Completed]

## 目標
2026-01-12に実施したコードレビューで特定された課題に対し、優先度の高い改善項目を実装する。

## 対象課題

### High Priority

#### 1. GeminiClient - explainCodeにレート制限追加
- **ファイル**: `src/lib/gemini/client.ts`
- **課題**: `generateCode` はレート制限ありだが、`explainCode` は直接API呼び出し
- **修正**: `explainCode` も同一の `requestQueue` に追加

#### 2. useProjectOperations - alert()削除
- **ファイル**: `src/hooks/useProjectOperations.ts`
- **課題**: Reactアンチパターンの `alert()` 使用
- **修正**: 戻り値で成功/失敗を返し、コンポーネント側でUI表示

#### 3. EditorApp - useEffect依存配列修正
- **ファイル**: `src/editor/index.tsx`
- **課題**: `geminiActions` を依存配列に含めているが、関数オブジェクトなので無限ループのリスク
- **修正**: 空配列 `[]` に変更

### Medium Priority

#### 4. EditorApp - エラークリア統一
- **ファイル**: `src/editor/index.tsx`
- **課題**: `projectActions.setError(null)` しか呼んでいない
- **修正**: `clearAllErrors` 関数を作成し、全エラーをクリア

#### 5. EditorApp - StorageManager使用
- **ファイル**: `src/editor/index.tsx`
- **課題**: `chrome.storage.sync.get` を直接呼んでいる
- **修正**: `StorageManager.getSettings()` を使用

#### 6. PopupApp - setTimeoutクリーンアップ
- **ファイル**: `src/popup/App.tsx`
- **課題**: `setTimeout` のクリーンアップがない
- **修正**: `useEffect` でクリーンアップ追加

#### 7. GASClient - 型定義移動
- **ファイル**: `src/lib/clasp/api.ts`
- **課題**: Chrome型定義がファイル内にある
- **修正**: `types.ts` に移動

#### 8. GeminiClient - currentCode型定義追加
- **ファイル**: `src/lib/gemini/types.ts`
- **課題**: `currentCode` パラメータが型定義にない
- **修正**: 型定義に追加

#### 9. useGeminiIntegration - エラー状態設定
- **ファイル**: `src/hooks/useGeminiIntegration.ts`
- **課題**: `result.error` がある場合、`state.error` に設定していない
- **修正**: エラー状態を設定

#### 10. 共通Spinnerコンポーネント作成
- **ファイル**: `src/components/` 新規
- **課題**: 複数箇所で同じSVGスピナーを記述
- **修正**: `<Spinner />` コンポーネント作成

#### 11. テスト追加
- **ファイル**: `src/components/PromptInput.test.tsx`, `src/components/ProjectHeader.test.tsx`, `src/components/EditorContainer.test.tsx`
- **課題**: テストが存在しない
- **修正**: 各コンポーネントのテスト追加

### Low Priority

#### 12-17. 各種改善
- REQUEST_COOLDOWN_MS設定可能化
- リトライ定数抽出
- useEditorStateのinitialCode仕様ドキュメント化
- テーマ管理統一
- PopupAppのステータス型改善
- フォーマット修正

## 実装手順
1. High Priorityの修正を順に実装
2. Medium Priorityの修正を実装
3. `task check` で品質確認
4. 必要に応じてLow Priorityを実施
5. 全テストがパスすることを確認

## 検証
- `task check` がAll OKであること
- 全てのテストがパスすること
- 既存機能に破壊的変更がないこと

---

# Test Coverage Improvement Plan (feat/test-coverage-improvement) [Completed]

## 目標
PLAN.md の Phase 1-A / Code Review Plan で未実装だったコンポーネントテストを追加し、テストカバレッジを向上させる。

## 対象モジュール

### 1. Lint 警告修正
- **ファイル**: `src/lib/gemini/client.test.ts`
- **課題**: Biome lint が function expression を arrow function に変更可能と警告
- **修正**: biome-ignore コメントを追加して constructor の function expression を明示的に許可

### 2. PromptInput コンポーネントテスト
- **ファイル**: `src/components/PromptInput.test.tsx` (新規)
- **対象**: `src/components/PromptInput.tsx`
- **テスト項目**:
  - 基本的なレンダリング（input, button）
  - onSubmit コールバックの動作
  - 空プロンプトでの送信防止
  - ローディング状態の表示
  - ボタンの disabled 状態
  - カスタムプレースホルダー
  - 送信後の入力クリア

### 3. ProjectHeader コンポーネントテスト
- **ファイル**: `src/components/ProjectHeader.test.tsx` (新規)
- **対象**: `src/components/ProjectHeader.tsx`
- **テスト項目**:
  - 基本的なレンダリング
  - Script ID 入力
  - Load/Save ボタン
  - ローディング状態
  - エラー状態

### 4. EditorContainer コンポーネントテスト
- **ファイル**: `src/components/EditorContainer.test.tsx` (新規)
- **対象**: `src/components/EditorContainer.tsx`
- **テスト項目**:
  - Monaco Mock のレンダリング
  - onChange コールバック
  - コード表示
  - テーマ適用

## 実装手順
1. Lint 警告を修正
2. 各コンポーネントのテストファイルを作成
3. `task check` で品質確認
4. 全テストがパスすることを確認
5. docs/WorkingLog.md に作業結果を記録

## 検証
- `task check` が All OK であること
- 全テスト（既存33件 + 新規テスト）がパスすること
- Biome lint に警告がないこと

---

# Future Tasks (未実装/検討中の機能)

## 概要
コア機能はほぼ実装完了。GCP設定、OAuth設定等の本番環境設定は未実施。
以下は実作業のテスト段階での対応候補。

## 優先度順タスク候補

### 1. テストカバレッジさらなる向上
**目的**: コア機能のテストカバレッジを100%に近づける

**対象モジュール**:
- `src/popup/App.tsx` - ポップアップアプリのテスト
- `src/editor/index.tsx` - エディタメイン画面のテスト
- `src/hooks/useEditorState.ts` - エディタ状態管理フックのテスト
- `src/hooks/useGeminiIntegration.ts` - Gemini連携フックのテスト
- `src/hooks/useProjectOperations.ts` - プロジェクト操作フックのテスト

### 2. 新機能・改善

#### AIチャットインターフェース
- **現状**: プロンプト入力のみ
- **改善**: 対話形式のチャットUI拡張
  - 会話履歴の表示
  - コンテキスト維持
  - 複数回のやり取りサポート

#### 差分ビュー機能強化
- **現状**: 全-or-nothing の適用
- **改善**: 行ごとの承認/却下
  - 変更の一部適用
  - 複数の変更を個別に承認

#### コード履歴機能
- **目的**: 変更履歴の保存とロールバック
- **実装**:
  - ローカルストレージへの履歴保存
  - タイムスタンプ付き変更記録
  - 以前のバージョンとの差分表示
  - ロールバック機能

### 3. 品質・パフォーマンス

#### React.memo 適用
- **目的**: 不要な再レンダリングの抑制
- **対象**:
  - `ProjectHeader`
  - `EditorContainer`
  - `DiffViewer`
  - `PromptInput`

#### コード分割
- **目的**: 初期ロード時間の短縮
- **手法**: React.lazy / Suspense
- **対象**:
  - Monaco Editor
  - DiffViewer
  - AI関連モジュール

#### アクセシビリティ向上
- **キーボードナビゲーション**: Tabインデックス最適化
- **ARIA改善**: ラベル、説明の追加
- **フォーカス管理**: モーダル、ダイアログのフォーカストラップ

### 4. E2E テスト導入
- **ツール**: Playwright
- **対象**:
  - Chrome拡張機能の基本操作
  - プロジェクトの読み込み/保存フロー
  - AIコード生成フロー

### 5. ドキュメント・リリース
- **ユーザーマニュアル**: インストールから使用方法まで
- **Chrome Web Store 素材**: スクリーンショット、説明文
- **リリースノート**: バージョンごとの変更点

## 備考
- GCP設定、OAuth設定等の本番環境設定は未実施
- 実作業のテスト段階のため、上記機能は検討段階

