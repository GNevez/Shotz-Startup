const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const port = process.env.PORT || 1500;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "teste", // mudar pra hash
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60,
    },
  })
);

app.listen(port, () => {
  console.log("Server 1 running on port " + port);
});

const Server = require("socket.io").Server;
const http = require("http");

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

module.exports = { serverHttp, io, app };
