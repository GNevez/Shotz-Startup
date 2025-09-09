const { io, serverHttp } = require("./http");
const connection = require("./middlewares/db");
const app = require("./http").app;

serverHttp.listen(3000, () => {
  console.log("Server running on port 3000");
});

const salas = [];
const mensagensChat = [];

function compareArrayNome(obj, array) {
  if (!Array.isArray(array)) {
    console.error("O segundo argumento deve ser um array.");
    return false;
  }

  for (const item of array) {
    if (item.Nome === obj.Nome) {
      console.log(`Sala já existente: ${item.Nome} e ${obj.Nome}`);
      return true;
    }
  }
  console.log("Sala não encontrada");
  return false;
}

function compareArrayId(obj, array) {
  if (!Array.isArray(array)) {
    console.error("O segundo argumento deve ser um array.");
    return false;
  }

  for (const item of array) {
    if (item.Players[0].Id === obj.Players[0].Id) {
      console.log(
        `Usuário já criou uma sala: ${item.Players[0].Id} e ${obj.Players[0].Id}`
      );
      return true;
    }
  }
  console.log("Usuário não encontrado");
  return false;
}

io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on("createLobby", (createLobby, callback) => {
    if (compareArrayId(createLobby, salas)) {
      callback({ success: false, message: "Você já possui uma sala criada!" });
    } else if (compareArrayNome(createLobby, salas)) {
      callback({ success: false, message: "Sala já criada com esse nome!" });
    } else {
      const salaCreateLobby = createLobby.Sala;
      socket.join(salaCreateLobby);
      console.log("Lider conectado a sala", salaCreateLobby);

      console.log("Lider Sala", createLobby.Players[0]);
      salas.push(createLobby);
      console.log("Sala criada:", createLobby);
      callback({ success: true, message: "Sala criada com sucesso!" });
      console.log("Salas", salas);
      //console.log("Teste: " + createLobby.Sala);

      io.to(salaCreateLobby).emit("attSala", createLobby);
      io.emit("lobbys", salas);
    }
  });

  socket.on("joinRoom", ({ Sala, id }) => {
    console.log("Recebido pedido para entrar na sala:", Sala);

    connection.query(
      "SELECT * FROM usuarios WHERE id = ?",
      [id],
      (err, rows) => {
        if (err) {
          console.error("Erro ao verificar o registro:", err);
          return;
        }

        console.log("Consulta ao banco de dados concluída:", rows);

        if (rows.length > 0) {
          const user = rows[0];
          console.log("Usuário encontrado:", user);

          let SalaFind = salas.find((item) => item.Sala === Sala);

          if (!SalaFind) {
            console.error("Sala não encontrada:", Sala);
            return;
          }

          if (!SalaFind.Players) {
            SalaFind.Players = [];
          }

          let playerExists = SalaFind.Players.find(
            (player) => player.Id === user.id
          );

          if (!playerExists) {
            const Players = {
              Id: user.id,
              Nome: user.username,
              Foto: `https://cdn.discordapp.com/avatars/${user.id_discord}/${user.avatar}.png`,
              Prime: true,
              Verificado: true,
              Nivel: 15,
            };

            SalaFind.Players.push(Players);
            socket.join(Sala);
            console.log("Jogador adicionado à sala:", SalaFind);

            // Emite o evento atualizado da sala
            io.to(Sala).emit("playerJoined", SalaFind);
            io.to(Sala).emit("attSala", SalaFind);
          } else {
            console.log("Jogador já existe na sala:", user.id);
          }
        } else {
          console.log("Nenhum usuário encontrado com esse ID");
        }
      }
    );

    console.log("Consulta ao banco de dados iniciada");
  });

  socket.on("messageChat", (data) => {
    let roomFound = false;

    for (const item of salas) {
      const player = item.Players.find((player) => player.Id === data.id);

      if (player) {
        roomFound = true;
        const room = item.Sala;

        const message = {
          room: room,
          user: data.user,
          text: data.text,
          createdAt: new Date(),
        };

        mensagensChat.push(message);
        console.log(`Mensagem para a sala ${room}:`, message);

        // Emitir mensagem para a sala correta
        io.to(room).emit("messageChat", message);

        console.log(mensagensChat);
        break;
      }
    }

    if (!roomFound) {
      console.log(`Nenhuma sala encontrada para o jogador com ID ${data.id}`);
    }
  });
});

app.get("/lobbys", (req, res) => {
  res.send(salas);
});

app.post("/yourRoom", (req, res) => {
  const userId = req.body.id;
  console.log("ID recebido no backend:", userId);

  salas.forEach((element) => {
    console.log(element.Players);
  });

  const salaEncontrada = salas.find((sala) =>
    sala.Players.some((player) => player.Id === userId)
  );

  if (salaEncontrada) {
    res.status(200).send(salaEncontrada);
  } else {
    res
      .status(404)
      .send({ message: "Error: Sala não encontrada para este jogador" });
  }
});