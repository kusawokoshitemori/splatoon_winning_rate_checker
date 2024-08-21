// 必要なモジュールを読み込む
const express = require("express");
const path = require("path");
const session = require("express-session");

// Expressアプリケーションを作成
const app = express();

// ポート番号の設定（環境変数から取得することが推奨されますが、デフォルトで3000を使用）
const port = process.env.PORT || 3000;

// 生成した秘密鍵をここに設定
const secretKey =
  "5e884898da28047151d0e56f8dc6294773603d0d9d80a3ad6a248f2e1c8e9c7a";

app.use(
  session({
    secret: secretKey, // ここに生成した秘密鍵を設定
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPSを使用しないローカル環境ではfalseに設定
  })
);

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
  if (!req.session.userName) {
    req.session.redirectAfterLogin = "area_input";
    res.render("UserName_input.ejs");
  } else {
    res.render("area_input.ejs");
  }
});

app.get("/hoko_input", (req, res) => {
  if (!req.session.userName) {
    req.session.redirectAfterLogin = "hoko_input";
    res.render("UserName_input.ejs");
  } else {
    res.render("hoko_input.ejs");
  }
});
app.get("/yagura_input", (req, res) => {
  res.render("yagura_input.ejs");
});
app.get("/asari_input", (req, res) => {
  res.render("asari_input.ejs");
});

app.use(express.urlencoded({ extended: true }));
//リダイレクトしてくれるやつ
app.post("/set_user_name", (req, res) => {
  const userName = req.body.userName;
  if (userName) {
    req.session.userName = userName;
    const redirectPath = req.session.redirectAfterLogin || "/";
    res.redirect(redirectPath);
  } else {
    res.redirect("/area_input"); // エラーハンドリング
  }
});

//一回エリアのバンカラから名前入力画面に移動できるようにする
app.get("/area_bankara", (req, res) => {
  res.render("area_memo.ejs");
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
