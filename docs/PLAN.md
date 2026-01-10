# ディレクトリ構成再構築計画

## 目標
- docs/IMPLEMENTATION_GUIDE.md に基づき、ディレクトリ構成を再構築する。
- 既存の `src` ディレクトリを退避し、新しい構造を作成する。

## 変更内容

### 1. 既存コードのアーカイブ
- 現在の `src/` の内容を `legacy/src_backup_[timestamp]/` に移動（念のため）。
- `legacy/` が既に存在するため、既存の `legacy` はそのままとする。

### 2. 新しいディレクトリ構造の作成 (`src/`)
以下の構造を作成する。ファイルは一旦空、またはスケルトンのみ作成。

```
src/
├── background/
│   └── index.ts
├── popup/
│   ├── index.html
│   └── index.tsx
├── editor/
│   └── index.tsx (仮)
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
│   └── index.d.ts (仮)
└── manifest.json
```

### 3. manifest.json の作成 (Manifest V3)
- 基本的な設定（permissions, background service worker, popup action等）を記述。

## 検証
- `tree` コマンド等でディレクトリ構造が正しいことを確認。
