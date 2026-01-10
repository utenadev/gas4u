# 成功するコマンド実行パターン (Windows + WSL環境 + Mise)

WSL環境で `mise` を使用しているため、`gh` コマンドへのパスが標準のPATHに含まれていない場合があります。
以下の設定で `git push` が正常に動作することを確認しました。

## 1. Git Credential Helper の設定
WSL内の `git` に対して、絶対パスで `gh` を指定した credential helper を設定します。
これにより、`https://github.com/...` へのプッシュ時に自動的に `gh` の認証情報が使用されます。

```bash
# 一度だけ実行すればOK
git config --local credential.helper "!/home/kench/.local/share/mise/installs/gh/2.83.2/gh_2.83.2_linux_amd64/bin/gh auth git-credential"
```

## 2. コマンド実行
通常通り `wsl git push` で動作します。トークンをURLに埋め込む必要はありません。

```powershell
wsl git push origin main
```
