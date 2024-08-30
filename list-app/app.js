// 必要なモジュールを読み込む
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");

// 環境変数の読み込み
require("dotenv").config();

// Expressアプリケーションを作成
const app = express();

// データベース接続情報 (MySQL2)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
    secret: "aW9unV7RThX6Y5qVnM6LPQ3Hk2FZ9XpK7vQzGdQ4Wk7X8jG6V2TtR1sU4H7Q3M5N",
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
  const userId = req.session.userName;

  // SQLクエリで最新の日付を取得
  const sql = `
    SELECT rule, datetime
    FROM game_records
    WHERE user_id = ?
      AND rule IN ('area_bankara', 'area_x')
    ORDER BY datetime DESC
    LIMIT 1;
  `;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    // 取得したデータから最新の datetime を設定
    let mostRecentDatetime = null;
    if (results.length > 0) {
      mostRecentDatetime = results[0].datetime;

      // 日付を "YYYY/MM/DD HH:MM" 形式にフォーマット
      const year = mostRecentDatetime.getFullYear();
      const month = String(mostRecentDatetime.getMonth() + 1).padStart(2, "0");
      const day = String(mostRecentDatetime.getDate()).padStart(2, "0");
      const hours = String(mostRecentDatetime.getHours()).padStart(2, "0");
      const minutes = String(mostRecentDatetime.getMinutes()).padStart(2, "0");

      mostRecentDatetime = `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    if (mostRecentDatetime === null) {
      mostRecentDatetime = "????/??/?? ??:??";
    }

    res.render("area_input.ejs", {
      userName: userId,
      redirectTo: "/area_input",
      mostRecentDatetime: mostRecentDatetime,
    });
  });
});

app.get("/yagura_input", checkUserName, (req, res) => {
  const userId = req.session.userName;

  // SQLクエリで最新の日付を取得
  const sql = `
    SELECT rule, datetime
    FROM game_records
    WHERE user_id = ?
      AND rule IN ('yagura_bankara', 'yagura_x')
    ORDER BY datetime DESC
    LIMIT 1;
  `;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    // 取得したデータから最新の datetime を設定
    let mostRecentDatetime = null;
    if (results.length > 0) {
      mostRecentDatetime = results[0].datetime;

      // 日付を "YYYY/MM/DD HH:MM" 形式にフォーマット
      const year = mostRecentDatetime.getFullYear();
      const month = String(mostRecentDatetime.getMonth() + 1).padStart(2, "0");
      const day = String(mostRecentDatetime.getDate()).padStart(2, "0");
      const hours = String(mostRecentDatetime.getHours()).padStart(2, "0");
      const minutes = String(mostRecentDatetime.getMinutes()).padStart(2, "0");

      mostRecentDatetime = `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    if (mostRecentDatetime === null) {
      mostRecentDatetime = "????/??/?? ??:??";
    }

    res.render("yagura_input.ejs", {
      userName: userId,
      redirectTo: "/yagura_input",
      mostRecentDatetime: mostRecentDatetime,
    });
  });
});
app.get("/hoko_input", checkUserName, (req, res) => {
  const userId = req.session.userName;

  // SQLクエリで最新の日付を取得
  const sql = `
    SELECT rule, datetime
    FROM game_records
    WHERE user_id = ?
      AND rule IN ('hoko_bankara', 'hoko_x')
    ORDER BY datetime DESC
    LIMIT 1;
  `;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    // 取得したデータから最新の datetime を設定
    let mostRecentDatetime = null;
    if (results.length > 0) {
      mostRecentDatetime = results[0].datetime;

      // 日付を "YYYY/MM/DD HH:MM" 形式にフォーマット
      const year = mostRecentDatetime.getFullYear();
      const month = String(mostRecentDatetime.getMonth() + 1).padStart(2, "0");
      const day = String(mostRecentDatetime.getDate()).padStart(2, "0");
      const hours = String(mostRecentDatetime.getHours()).padStart(2, "0");
      const minutes = String(mostRecentDatetime.getMinutes()).padStart(2, "0");

      mostRecentDatetime = `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    if (mostRecentDatetime === null) {
      mostRecentDatetime = "????/??/?? ??:??";
    }

    res.render("hoko_input.ejs", {
      userName: userId,
      redirectTo: "/hoko_input",
      mostRecentDatetime: mostRecentDatetime,
    });
  });
});
app.get("/asari_input", checkUserName, (req, res) => {
  const userId = req.session.userName;

  // SQLクエリで最新の日付を取得
  const sql = `
    SELECT rule, datetime
    FROM game_records
    WHERE user_id = ?
      AND rule IN ('asari_bankara', 'asari _x')
    ORDER BY datetime DESC
    LIMIT 1;
  `;

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    // 取得したデータから最新の datetime を設定
    let mostRecentDatetime = null;
    if (results.length > 0) {
      mostRecentDatetime = results[0].datetime;

      // 日付を "YYYY/MM/DD HH:MM" 形式にフォーマット
      const year = mostRecentDatetime.getFullYear();
      const month = String(mostRecentDatetime.getMonth() + 1).padStart(2, "0");
      const day = String(mostRecentDatetime.getDate()).padStart(2, "0");
      const hours = String(mostRecentDatetime.getHours()).padStart(2, "0");
      const minutes = String(mostRecentDatetime.getMinutes()).padStart(2, "0");

      mostRecentDatetime = `${year}/${month}/${day} ${hours}:${minutes}`;
    }
    if (mostRecentDatetime === null) {
      mostRecentDatetime = "????/??/?? ??:??";
    }

    res.render("asari_input.ejs", {
      userName: userId,
      redirectTo: "/asari_input",
      mostRecentDatetime: mostRecentDatetime,
    });
  });
});

// 一言コメント
const comments = [
  "味方のカバーを意識しよう",
  "弱い味方が来る確率は3/7",
  "継続は力なり",
  "前出すぎは味方負担",
  "スペシャルを合わさせない意識",
  "負け試合には99.9%反省点がある",
  "天才！秀才！",
  "いないいないばあっ！は面白い",
  "制作者 : 草をこして森",
  "作者はお風呂使い",
  "作者はXP2000超え",
  "味方のやりたいことを理解しよう",
  "味方の上振れを取り逃すな",
  "リッターは常に抜いてくる意識",
  "メインクお風呂、だいたい弱い",
  "お風呂にサーマルは嫌い",
  "試合前にギア確認",
  "チャクチを警戒しよう",
  "裏抜けさせない陣形を",
  "人数有利は前に出よう",
  "前に出ない後衛は味方負担",
  "人数不利は下がるor潜伏or圧掛け",
  "一言コメント書くのに30分かけてる",
  "これ使ってくれるのホント好き",
  "スプラレートってのができたらしいよ",
  "よく頑張ってる。えらい",
  "理不尽な死はだいたい予想できる",
  "相手の気持ちを考えよう",
  "裏取り判断は良かったのか試合後に考えよう",
  "マップをよく見よう",
  "ショクワンダーは張り付きの後のジャンプを狙おう",
  "スプラ界隈は食べ物の名前多い",
  "風呂長時間対面集って需要あるかな？",
  "見えなくても予想はできる",
  "俺のテイオウだけ弱いんだけど...",
  "イライラしたらサーモンランをしよう",
  "カーボン使いだいたいうまい",
  "各武器の初動を理解しよう",
  "初動は味方全員の足並みが揃うチャンス",
  "スタートダッシュの相手は突っ込んでくるので置き打ちしよう",
  "リッターのいた位置にはトラップがある&リッターが見ている",
  "いろんな選択肢を持っておこう",
  "イカロールは減らそう",
  "金プレート出たことない",
  "ガチャで銀なら1回出た",
  "あるある:スプラやらないのにスケジュールを確認",
  "スパジャンはイカ状態の方が早い",
  "豆知識:作者はアサリが嫌い",
  "パントマイムアフレコしてみた",
  "スプラッシュボムはお風呂の天敵",
  "ボム投げマンには常に足元に来てもいいようにしておく",
  "ボム投げマン相手にイカロール、ジャンプを減らす",
  "ジャンプはあまりしない(風呂などを除く)",
  "クラブラのウルショは怖くない",
  "ロンブラ相手は詰める",
  "トライストリンガーはぬれないお風呂",
  "パブロは射程差を生かす",
  "ノバは一瞬のクリアリングを多くする",
  "ダイナモは圧掛けだけして無視、甘えたらキル",
  "バケスロは意外と射程が長い",
  "スペシャルを合わせる意識",
  "打開は塗る場所を考えよう",
  "ボトルプライムは射程がびっくりするほど長い",
  "バケデコのショクワン突撃しか選択肢ない",
  "黒ザップ立ち回り難しすぎ",
  "モップリン段差好みがち",
  "ローラーはインクの端っこにいる",
  "クラブラは距離を取る",
  "作者はゴッドフィールド元63位",
  "作者はチャクチを狩れない",
  "ジャンプ狩りはスパッタリー、ローラー、ワイパーを警戒",
  "2対1は遮蔽意識",
  "ハンコスタンプは前線が下がる",
  "わかば使いはボムキルの後に詰めてくる",
  "二連投の後はインク回復してるから前線を軽く上げれる",
  "作者はスプリンクラー信者",
  "スプリンクラー > ロボム 異論は認めん",
  "前でスペシャルを吐かせる意識",
  "確実に死ぬ場合は帰るor早く死ぬ",
  "ホコは死んだほうがいい場合がある",
  "作者はデスクリアリングが好き",
];
app.get("/area_bankara", checkUserName, (req, res) => {
  const userId = req.session.userName;
  const rule = "area_bankara";

  const randomComment = comments[Math.floor(Math.random() * comments.length)];

  const sql = `
    SELECT win_number, loss_number 
    FROM game_records 
    WHERE user_id = ? AND rule = ?`;

  connection.query(sql, [userId, rule], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    let totalWins = 0;
    let totalLosses = 0;

    results.forEach((row) => {
      totalWins += row.win_number;
      totalLosses += row.loss_number;
    });

    const winRate =
      totalWins + totalLosses > 0
        ? (totalWins / (totalWins + totalLosses)) * 100
        : 0;

    res.render("area_bankara", {
      userId: userId,
      rule: rule,
      totalWins: totalWins,
      totalLosses: totalLosses,
      winRate: winRate.toFixed(2),
      comment: randomComment,
    });
  });
});

app.get("/yagura_bankara", checkUserName, (req, res) => {
  const userId = req.session.userName;
  const rule = "yagura_bankara";

  const randomComment = comments[Math.floor(Math.random() * comments.length)];

  const sql = `
    SELECT win_number, loss_number 
    FROM game_records 
    WHERE user_id = ? AND rule = ?`;

  connection.query(sql, [userId, rule], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    let totalWins = 0;
    let totalLosses = 0;

    results.forEach((row) => {
      totalWins += row.win_number;
      totalLosses += row.loss_number;
    });

    const winRate =
      totalWins + totalLosses > 0
        ? (totalWins / (totalWins + totalLosses)) * 100
        : 0;

    res.render("yagura_bankara", {
      userId: userId,
      rule: rule,
      totalWins: totalWins,
      totalLosses: totalLosses,
      winRate: winRate.toFixed(2),
      comment: randomComment,
    });
  });
});

app.get("/hoko_bankara", checkUserName, (req, res) => {
  const userId = req.session.userName;
  const rule = "hoko_bankara";

  const randomComment = comments[Math.floor(Math.random() * comments.length)];

  const sql = `
    SELECT win_number, loss_number 
    FROM game_records 
    WHERE user_id = ? AND rule = ?`;

  connection.query(sql, [userId, rule], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    let totalWins = 0;
    let totalLosses = 0;

    results.forEach((row) => {
      totalWins += row.win_number;
      totalLosses += row.loss_number;
    });

    const winRate =
      totalWins + totalLosses > 0
        ? (totalWins / (totalWins + totalLosses)) * 100
        : 0;

    res.render("hoko_bankara", {
      userId: userId,
      rule: rule,
      totalWins: totalWins,
      totalLosses: totalLosses,
      winRate: winRate.toFixed(2),
      comment: randomComment,
    });
  });
});

app.get("/asari_bankara", checkUserName, (req, res) => {
  const userId = req.session.userName;
  const rule = "asari_bankara";

  const randomComment = comments[Math.floor(Math.random() * comments.length)];

  const sql = `
    SELECT win_number, loss_number 
    FROM game_records 
    WHERE user_id = ? AND rule = ?`;

  connection.query(sql, [userId, rule], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    let totalWins = 0;
    let totalLosses = 0;

    results.forEach((row) => {
      totalWins += row.win_number;
      totalLosses += row.loss_number;
    });

    const winRate =
      totalWins + totalLosses > 0
        ? (totalWins / (totalWins + totalLosses)) * 100
        : 0;

    res.render("asari_bankara", {
      userId: userId,
      rule: rule,
      totalWins: totalWins,
      totalLosses: totalLosses,
      winRate: winRate.toFixed(2),
      comment: randomComment,
    });
  });
});

app.get("/area_X", checkUserName, (req, res) => {
  const userId = req.session.userName;
  const rule = "area_X";

  const randomComment = comments[Math.floor(Math.random() * comments.length)];

  const sql = `
    SELECT win_number, loss_number 
    FROM game_records 
    WHERE user_id = ? AND rule = ?`;

  connection.query(sql, [userId, rule], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    let totalWins = 0;
    let totalLosses = 0;

    results.forEach((row) => {
      totalWins += row.win_number;
      totalLosses += row.loss_number;
    });

    const winRate =
      totalWins + totalLosses > 0
        ? (totalWins / (totalWins + totalLosses)) * 100
        : 0;

    res.render("area_X", {
      userId: userId,
      rule: rule,
      totalWins: totalWins,
      totalLosses: totalLosses,
      winRate: winRate.toFixed(2),
      comment: randomComment,
    });
  });
});
app.get("/yagura_X", checkUserName, (req, res) => {
  const userId = req.session.userName;
  const rule = "yagura_X";

  const randomComment = comments[Math.floor(Math.random() * comments.length)];

  const sql = `
    SELECT win_number, loss_number 
    FROM game_records 
    WHERE user_id = ? AND rule = ?`;

  connection.query(sql, [userId, rule], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    let totalWins = 0;
    let totalLosses = 0;

    results.forEach((row) => {
      totalWins += row.win_number;
      totalLosses += row.loss_number;
    });

    const winRate =
      totalWins + totalLosses > 0
        ? (totalWins / (totalWins + totalLosses)) * 100
        : 0;

    res.render("yagura_X", {
      userId: userId,
      rule: rule,
      totalWins: totalWins,
      totalLosses: totalLosses,
      winRate: winRate.toFixed(2),
      comment: randomComment,
    });
  });
});
app.get("/hoko_X", checkUserName, (req, res) => {
  const userId = req.session.userName;
  const rule = "hoko_X";

  const randomComment = comments[Math.floor(Math.random() * comments.length)];

  const sql = `
    SELECT win_number, loss_number 
    FROM game_records 
    WHERE user_id = ? AND rule = ?`;

  connection.query(sql, [userId, rule], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    let totalWins = 0;
    let totalLosses = 0;

    results.forEach((row) => {
      totalWins += row.win_number;
      totalLosses += row.loss_number;
    });

    const winRate =
      totalWins + totalLosses > 0
        ? (totalWins / (totalWins + totalLosses)) * 100
        : 0;

    res.render("hoko_X", {
      userId: userId,
      rule: rule,
      totalWins: totalWins,
      totalLosses: totalLosses,
      winRate: winRate.toFixed(2),
      comment: randomComment,
    });
  });
});
app.get("/asari_X", checkUserName, (req, res) => {
  const userId = req.session.userName;
  const rule = "asari_X";

  const randomComment = comments[Math.floor(Math.random() * comments.length)];

  const sql = `
    SELECT win_number, loss_number 
    FROM game_records 
    WHERE user_id = ? AND rule = ?`;

  connection.query(sql, [userId, rule], (err, results) => {
    if (err) {
      console.error("データ取得に失敗しました: " + err.stack);
      res.status(500).send("サーバーエラー");
      return;
    }

    let totalWins = 0;
    let totalLosses = 0;

    results.forEach((row) => {
      totalWins += row.win_number;
      totalLosses += row.loss_number;
    });

    const winRate =
      totalWins + totalLosses > 0
        ? (totalWins / (totalWins + totalLosses)) * 100
        : 0;

    res.render("asari_X", {
      userId: userId,
      rule: rule,
      totalWins: totalWins,
      totalLosses: totalLosses,
      winRate: winRate.toFixed(2),
      comment: randomComment,
    });
  });
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
  console.log(`サーバーが http://localhost:${port} で起動しましたよ`);
});
