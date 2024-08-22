//ごり押しだけど、app.jsを更新させたらUserName消える

// 必要なモジュールを読み込む
const express = require("express");
const session = require("express-session");
const path = require("path");

// Expressアプリケーションを作成
const app = express();

// ポート番号の設定（環境変数から取得することが推奨されますが、デフォルトで3000を使用）
const port = process.env.PORT || 3000;

// EJSのビューエンジンを設定
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ミドルウェア設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/save-username", (req, res) => {
  const userName = req.body.userName;
  if (userName) {
    req.session.userName = userName;

    // セッションに保存されていたリダイレクト先を取得
    const redirectTo = req.session.redirectTo || "/";

    // リダイレクト先をJSONとして返す
    res.status(200).json({ redirectTo });
  } else {
    res.status(400).send("ユーザーネームが提供されていません");
  }
});

// リダイレクト用ミドルウェア
function checkUserName(req, res, next) {
  if (!req.session.userName) {
    // 現在のURLをセッションに保存
    req.session.redirectTo = req.originalUrl;
    // ログインページにリダイレクト
    res.redirect("/UserName_input");
  } else {
    next();
  }
}

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

// ユーザー名入力画面
app.get("/UserName_input", (req, res) => {
  res.render("UserName_input.ejs");
});

app.get("/area_input", checkUserName, (req, res) => {
  res.render("area_input.ejs", {
    userName: req.session.userName,
    redirectTo: "/area_input",
  });
});
app.get("/yagura_input", checkUserName, (req, res) => {
  res.render("yagura_input.ejs", {
    userName: req.session.userName,
    redirectTo: "/yagura_input",
  });
});
app.get("/hoko_input", checkUserName, (req, res) => {
  res.render("hoko_input.ejs", {
    userName: req.session.userName,
    redirectTo: "/hoko_input",
  });
});
app.get("/asari_input", checkUserName, (req, res) => {
  res.render("asari_input.ejs", {
    userName: req.session.userName,
    redirectTo: "/asari_input",
  });
});

// ログイン後のリダイレクト処理
app.post("/login", (req, res) => {
  req.session.userName = req.body.userName;
  const redirectTo = req.session.redirectTo || "/";
  req.session.redirectTo = null;
  res.redirect(redirectTo);
});

// エリアのバンカラから名前入力画面に移動できるようにする
app.get("/area_bankara", (req, res) => {
  res.render("UserName_input.ejs");
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
