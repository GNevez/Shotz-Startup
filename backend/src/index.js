require("dotenv").config();
const axios = require("axios");
const url = require("url");
const { sign } = require("jsonwebtoken");
//const crypto = require('crypto');
const connection = require("./middlewares/db");

const app = require("./http").app;
require("./websocket");

// const generateSecretKey = () => {
//   return crypto.randomBytes(32).toString('hex'); // Gera uma string hexadecimal de 32 bytes (256 bits)
// };

// const secretKey = generateSecretKey();

app.get("/api/auth/callback/discord", async (req, res) => {
  const { code } = req.query;

  if (code) {
    const formData = new url.URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code.toString(),
      redirect_uri: "http://localhost:1500/api/auth/callback/discord",
    });

    const output = await axios.post(
      "https://discord.com/api/v10/oauth2/token",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (output.data) {
      const access = output.data.access_token;

      const userinfo = await axios.get(
        "https://discord.com/api/v10/users/@me",
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      //refresh token

      const formData1 = new url.URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: output.data.refresh_token,
      });

      const refresh = await axios.post(
        "https://discord.com/api/v10/oauth2/token",
        formData1,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log(output.data, userinfo.data, refresh.data);
      if (userinfo) {
        const id = userinfo.data.id;
        const user = userinfo.data.username;
        const avatar = userinfo.data.avatar;
        const email = userinfo.data.email;

        const novoUsuario = {
          id_discord: id,
          username: user,
          avatar: avatar,
          email: email,
        };
        const selectQuery = "SELECT * FROM usuarios WHERE id_discord = ?";
        const insertQuery = "INSERT INTO usuarios SET ?";
        const updateQuery =
          "UPDATE usuarios SET username = ?, avatar = ?, email = ? WHERE id_discord = ?";

        connection.query(selectQuery, [id], (err, rows) => {
          if (err) {
            console.error("Erro ao verificar o registro:", err);
            return;
          }

          if (rows.length === 0) {
            connection.query(insertQuery, novoUsuario, (err, result) => {
              if (err) {
                console.error("Erro ao inserir dados:", err);
                return;
              }
              const token = sign(
                {
                  sub: id,
                  user: user,
                  email: email,
                  avatar: avatar,
                  id: result.insertId,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1h",
                }
              );

              console.log(
                "Novo usuário inserido com sucesso! ID do novo usuário:",
                result.insertId
              );

              res.cookie("token", token);

              res.redirect("http://localhost:5173");
            });
          } else {
            const existingUser = rows[0];
            connection.query(updateQuery, [user, avatar, email, id], (err) => {
              if (err) {
                console.error("Erro ao atualizar dados:", err);
                return;
              }
              console.log(
                "Dados do usuário atualizados com sucesso! ID do usuário:",
                existingUser.id
              );

              const token = sign(
                {
                  sub: id,
                  user: user,
                  email: email,
                  avatar: avatar,
                  id: existingUser.id,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1h",
                }
              );

              console.log(token);

              res.cookie("token", token);

              res.redirect("http://localhost:5173");
            });
          }
        });
      }
    }
  } else {
    res.status(400).send("Código de autorização ausente");
  }
});

app.post("/logout", (req, res) => {
  if (req.cookies["token"]) {
    res.clearCookie("token");
    res.sendStatus(200);
  } else {
    console.log("Usuario ja deslogado");
  }
});

const authenticate = require("./middlewares/authenticate");

app.get("/authentication", authenticate, (req, res) => {
  res.send(req.user);
});
