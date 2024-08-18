// 必要なモジュールを読み込む
const express = require("express");
const path = require("path");

// Expressアプリケーションを作成
const app = express();

// ポート番号の設定（環境変数から取得することが推奨されますが、デフォルトで3000を使用）
const port = process.env.PORT || 3000;

// EJSのビューエンジンを設定
app.set("view engine", "ejs");

// ビューのフォルダを指定
app.set("views", path.join(__dirname, "views"));

// 静的ファイルを提供するミドルウェア
app.use(express.static(path.join(__dirname, "public")));

// ルートの設定
app.get("/", (req, res) => {
  res.render("top.ejs");
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
