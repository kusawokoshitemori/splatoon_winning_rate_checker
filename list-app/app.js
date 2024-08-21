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

app.get("/area", (req, res) => {
  res.render("area.ejs");
});
app.get("/yagura", (req, res) => {
  res.render("yagura.ejs");
});
app.get("/hoko", (req, res) => {
  res.render("hoko.ejs");
});
app.get("/asari", (req, res) => {
  res.render("asari.ejs");
});

app.get("/area_input", (req, res) => {
  res.render("area_input.ejs");
});
app.get("/yagura_input", (req, res) => {
  res.render("yagura_input.ejs");
});
app.get("/hoko_input", (req, res) => {
  res.render("hoko_input.ejs");
});
app.get("/asari_input", (req, res) => {
  res.render("asari_input.ejs");
});

//一回エリアのバンカラから名前入力画面に移動できるようにする
app.get("/area_bankara", (req, res) => {
  res.render("area_memo.ejs");
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
