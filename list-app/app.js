//ごり押しだけど、app.jsを更新させたらUserName消える

// 必要なモジュールを読み込む
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");

// Expressアプリケーションを作成
const app = express();

// データベース接続情報 (MySQL2)
const connection = mysql.createConnection({
  host: "localhost",
  user: "kusamori",
  password: "kusaw0k0sh!tem0r!", // ローカル環境のMySQLパスワード
  database: "splatoon_winning_rate_db",
});

// 接続を開く
connection.connect((err) => {
  if (err) {
    console.error("データベースへの接続に失敗しました:", err);
    return;
  }
  console.log("データベースに接続しました");
});

// ポート番号の設定!（環境変数から取得することが推奨されますが、デフォルトで3000を使用）
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

app.get("/area_bankara", (req, res) => {
  res.render("area_bankara.ejs");
});
app.get("/yagura_bankara", (req, res) => {
  res.render("yagura_bankara.ejs");
});
app.get("/hoko_bankara", (req, res) => {
  res.render("hoko_bankara.ejs");
});
app.get("/asari_bankara", (req, res) => {
  res.render("asari_bankara.ejs");
});

//データベースにデータを入れる
app.post("/save-game-record", (req, res) => {
  const {
    userName_input,
    rule_input,
    winNumber_input,
    lossNumber_input,
    datetime_input,
  } = req.body;

  // SQLクエリの準備
  const query =
    "INSERT INTO game_records (user_id, rule, win_number, loss_number, datetime) VALUES (?, ?, ?, ?, ?)";

  // データベースへの挿入
  connection.query(
    query,
    [
      userName_input,
      rule_input,
      winNumber_input,
      lossNumber_input,
      datetime_input,
    ],
    (err, results) => {
      if (err) {
        console.error("データの挿入に失敗しました:", err);
        return res.status(500).send("データの挿入に失敗しました");
      }
      res.status(200).send("データが正常に挿入されました");
    }
  );
});

// ログイン後のリダイレクト処理
app.post("/login", (req, res) => {
  req.session.userName = req.body.userName;
  const redirectTo = req.session.redirectTo || "/";
  req.session.redirectTo = null;
  res.redirect(redirectTo);
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
