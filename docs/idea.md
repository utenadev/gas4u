#### idea
gasを作成するための chrome拡張とその開発に用いるツール群

##### chrome拡張
この機能は chrome拡張で実装される
AI機能: Gemini Flash or Proを API経由で使い、コード生成～コード補助やデバッグを行う
Gemini API管理: gasプロジェクト, API Key などを local DBにて管理する
diff と承認: AIのソースを差分で表示してユーザーが判断し反映を承認出来る
gasの以下の機能
- 編集:  ES6以降のgasで動作するjavascriptの編集に適したI/F
- ソース管理: clasp相当のソースのやり取りをgasプロジェクト⇔本拡張で行う
- clasp実装のライブラリあり → ./clasp

antigravity の機能であるブラウザコントロールで chrome拡張の開発を効率的に行いたい
