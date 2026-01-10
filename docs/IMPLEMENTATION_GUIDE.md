# GAS4U プロジェクト再構築 - 実装指示書

## 概要
SPEC.md と BLUEPRINT.md に基づき、GAS4Uプロジェクトを再構築します。Chrome拡張機能としてのGAS開発支援機能を維持しつつ、アーキテクチャを明確化します。

## 作業手順

### Step 1: 古いコードのアーカイブ
1. 現在の `src/` ディレクトリを `legacy/` ディレクトリに移動
2. `clasp/` ディレクトリは引き続き利用するため、移動しないでください

### Step 2: 新しいディレクトリ構造の作成
以下の構造で新しいソースコードを作成してください：

```
src/
├── background/
│   └── index.ts
├── popup/
│   ├── index.html
│   └── index.tsx
├── editor/
│   └── [Monaco Editor Component]
├── lib/
│   ├── gemini/
│   │   ├── client.ts
│   │   └── types.ts
│   ├── storage/
│   │   ├── manager.ts
│   │   └── types.ts
│   └── clasp/
│       ├── manager.ts
│       ├── api.ts
│       └── types.ts
├── types/
└── manifest.json
```

### Step 3: SPEC.mdに基づく機能実装
以下の機能要件を満たすように実装してください：

- **FR-001: AIコード生成** - Gemini APIを使用したコード生成機能
- **FR-002: GASプロジェクト管理** - プロジェクトの読み込み・編集・保存機能
- **FR-003: ソースコード同期** - GASプロジェクトとのプル/プッシュ機能
- **FR-004: Gemini API管理** - APIキー、プロジェクト情報の管理
- **FR-005: 差分表示と承認** - AI生成コードの差分表示と承認機能
- **FR-006: エディタ機能** - ES6+ JavaScript対応のエディタ

### Step 4: 既存コードの再利用
以下の既存実装を参考・再利用してください：

1. `clasp/Clasp.js` - GAS APIとの通信、プロジェクト管理機能
2. `legacy/src/lib/clasp.ts`, `gemini.ts`, `storage.ts` - 各ロジックの実装
3. `legacy/src/components/` - UIコンポーネント（特にDiffViewer.tsx）

## 技術スタック
- TypeScript (型安全な開発)
- React (UIコンポーネント)
- Monaco Editor (コードエディタ)
- Chrome Extension Manifest V3
- Tailwind CSS (スタイリング)
- Vite (ビルドツール)

## 重要ポイント
1. セキュリティ: APIキーなどの機密情報はローカルストレージに安全に保存
2. ユーザビリティ: 直感的なUIでGAS開発を効率化
3. AI効率: Gemini APIの使用効率を最大化し、トークン使用量を最適化