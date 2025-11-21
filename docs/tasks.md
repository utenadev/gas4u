# タスク

- [x] 要件定義書の作成 (docs/llm/requirement.md) <!-- id: 0 -->
- [x] 詳細設計書の作成 (docs/llm/design.md) <!-- id: 1 -->
- [x] タスクのレビューと詳細化 <!-- id: 2 -->

## フェーズ 1: プロジェクト基盤構築
- [x] Vite + React + TypeScript プロジェクトの初期化
- [x] ディレクトリ構成の作成 (`src/background`, `src/popup`, `src/editor`, `src/lib`)
- [x] Manifest V3 (`manifest.json`) の設定
- [x] Tailwind CSS の導入と設定
- [x] ビルド設定 (`vite.config.ts`) の調整 (CRXJS plugin 等)

## フェーズ 2: UI 実装とプレビュー環境
- [x] 共通コンポーネントの作成 (Button, Input, Layout)
- [x] Popup 画面の実装 (プロジェクト一覧表示)
- [x] Editor 画面の実装 (Monaco Editor 導入)
- [x] Web プレビュー環境の構築 (Chrome API モック作成)
- [x] ルーティング設定 (Webプレビュー用)

## フェーズ 3: コアロジック実装
- [x] Gemini API クライアントの実装 (`lib/gemini`)
- [x] ローカルストレージラッパーの実装 (`lib/storage`)
- [x] Clasp 互換ロジックの実装 (`lib/clasp`)
- [x] Background Service Worker の実装

## フェーズ 4: 統合と検証
- [x] AI コード生成フローの統合
- [ ] 差分表示 (Diff View) の実装
- [ ] エンドツーエンド動作確認 (Webプレビュー & 実機)
