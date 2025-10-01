const { io, serverHttp } = require("./http");
const connection = require("./middlewares/db");
const app = require("./http").app;

serverHttp.listen(3000, () => {
  console.log("Server running on port 3000");
});

const salas = [];
const mensagensChat = [];
const queue = []; // Fila de salas procurando match
const matches = []; // Matches em andamento

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

// Função para adicionar sala na fila de matchmaking
function addToQueue(sala) {
  // Verificar se a sala já está na fila
  const alreadyInQueue = queue.find(entry => entry.sala.Sala === sala.Sala);
  
  if (alreadyInQueue) {
    console.log(`Sala ${sala.Sala} já está na fila!`);
    return;
  }
  
  // Remover verificação de 5 jogadores para testes
  // if (sala.Players.length === 5) {
    const queueEntry = {
      sala: sala,
      timestamp: Date.now(),
      status: 'waiting' // waiting, matched, confirmed
    };
    
    queue.push(queueEntry);
    console.log(`Sala ${sala.Sala} adicionada à fila de matchmaking`);
    
    // Tentar encontrar match imediatamente
    findMatch();
  // }
}

// Função para encontrar match entre salas
function findMatch() {
  const waitingSalas = queue.filter(entry => entry.status === 'waiting');
  console.log(`Procurando match... Salas na fila: ${waitingSalas.length}`);
  console.log("Fila atual:", queue.map(q => ({ sala: q.sala.Sala, status: q.status })));
  
  if (waitingSalas.length >= 2) {
    // Pegar as duas primeiras salas da fila
    const sala1 = waitingSalas[0];
    const sala2 = waitingSalas[1];
    
    // Criar match
    const match = {
      id: `match_${Date.now()}`,
      sala1: sala1.sala,
      sala2: sala2.sala,
      status: 'pending_confirmation', // pending_confirmation, confirmed, rejected
      timestamp: Date.now(),
      confirmations: {
        sala1: [],
        sala2: []
      }
    };
    
    // Atualizar status das salas na fila
    sala1.status = 'matched';
    sala2.status = 'matched';
    
    // Remover da fila
    const index1 = queue.findIndex(entry => entry.sala.Sala === sala1.sala.Sala);
    const index2 = queue.findIndex(entry => entry.sala.Sala === sala2.sala.Sala);
    
    if (index1 !== -1) queue.splice(index1, 1);
    if (index2 !== -1) queue.splice(index2, 1);
    
    // Adicionar ao array de matches
    matches.push(match);
    
    console.log(`Match encontrado: ${sala1.sala.Sala} vs ${sala2.sala.Sala}`);
    
    // Emitir evento de match encontrado para ambas as salas
    const matchData1 = {
      matchId: match.id,
      opponentSala: sala2.sala,
      timeToAccept: 30 // 30 segundos para aceitar
    };
    
    const matchData2 = {
      matchId: match.id,
      opponentSala: sala1.sala,
      timeToAccept: 30
    };
    
    console.log("Emitindo matchFound para sala1:", sala1.sala.Sala, matchData1);
    console.log("Emitindo matchFound para sala2:", sala2.sala.Sala, matchData2);
    
    // Verificar se as salas estão conectadas
    const room1Clients = io.sockets.adapter.rooms.get(sala1.sala.Sala);
    const room2Clients = io.sockets.adapter.rooms.get(sala2.sala.Sala);
    
    console.log(`Sala1 ${sala1.sala.Sala} tem ${room1Clients ? room1Clients.size : 0} clientes conectados`);
    console.log(`Sala2 ${sala2.sala.Sala} tem ${room2Clients ? room2Clients.size : 0} clientes conectados`);
    
    io.to(sala1.sala.Sala).emit('matchFound', matchData1);
    io.to(sala2.sala.Sala).emit('matchFound', matchData2);
    
    console.log("✅ Eventos matchFound emitidos!");
    
    // Timer para rejeitar automaticamente se não confirmar
    setTimeout(() => {
      if (match.status === 'pending_confirmation') {
        rejectMatch(match.id);
      }
    }, 30000); // 30 segundos
  }
}

// Função para confirmar match
function confirmMatch(matchId, salaId, playerId) {
  const match = matches.find(m => m.id === matchId);
  
  if (!match) return false;
  
  if (match.sala1.Sala === salaId) {
    if (!match.confirmations.sala1.includes(playerId)) {
      match.confirmations.sala1.push(playerId);
    }
  } else if (match.sala2.Sala === salaId) {
    if (!match.confirmations.sala2.includes(playerId)) {
      match.confirmations.sala2.push(playerId);
    }
  }
  
  // Verificar se todos os 10 jogadores confirmaram
  const totalConfirmations = match.confirmations.sala1.length + match.confirmations.sala2.length;
  
  if (totalConfirmations === 10) {
    match.status = 'confirmed';
    console.log(`Match ${matchId} confirmado por todos os jogadores!`);
    
    // Emitir evento de match confirmado
    io.to(match.sala1.Sala).emit('matchConfirmed', { matchId });
    io.to(match.sala2.Sala).emit('matchConfirmed', { matchId });
    
    // Aqui você pode iniciar a partida, redirecionar para o jogo, etc.
    startMatch(match);
  }
  
  return true;
}

// Função para rejeitar match
function rejectMatch(matchId) {
  const match = matches.find(m => m.id === matchId);
  
  if (!match) return false;
  
  match.status = 'rejected';
  
  // Voltar as salas para a fila apenas se não estiverem já na fila
  const sala1InQueue = queue.find(entry => entry.sala.Sala === match.sala1.Sala);
  const sala2InQueue = queue.find(entry => entry.sala.Sala === match.sala2.Sala);
  
  if (!sala1InQueue) {
    addToQueue(match.sala1);
  }
  if (!sala2InQueue) {
    addToQueue(match.sala2);
  }
  
  // Emitir evento de match rejeitado
  io.to(match.sala1.Sala).emit('matchRejected', { matchId });
  io.to(match.sala2.Sala).emit('matchRejected', { matchId });
  
  // Remover do array de matches
  const index = matches.findIndex(m => m.id === matchId);
  if (index !== -1) matches.splice(index, 1);
  
  console.log(`Match ${matchId} rejeitado`);
  return true;
}

// Função para rejeitar match por um time específico
function rejectMatchByTeam(matchId, salaId) {
  const match = matches.find(m => m.id === matchId);
  
  if (!match) return false;
  
  console.log(`Time ${salaId} rejeitou o match ${matchId}`);
  
  // Determinar qual sala rejeitou
  const isSala1 = match.sala1.Sala === salaId;
  const rejectingSala = isSala1 ? match.sala1 : match.sala2;
  const acceptingSala = isSala1 ? match.sala2 : match.sala1;
  
  // Remover o match
  const index = matches.findIndex(m => m.id === matchId);
  if (index !== -1) matches.splice(index, 1);
  
  // Remover a sala que rejeitou da fila
  const rejectingSalaInQueue = queue.find(entry => entry.sala.Sala === rejectingSala.Sala);
  if (rejectingSalaInQueue) {
    const queueIndex = queue.findIndex(entry => entry.sala.Sala === rejectingSala.Sala);
    if (queueIndex !== -1) {
      queue.splice(queueIndex, 1);
      console.log(`Sala ${rejectingSala.Sala} removida da fila por rejeitar match`);
    }
  }
  
  // Manter a sala que aceitou na fila (se não estiver já)
  const acceptingSalaInQueue = queue.find(entry => entry.sala.Sala === acceptingSala.Sala);
  if (!acceptingSalaInQueue) {
    addToQueue(acceptingSala);
    console.log(`Sala ${acceptingSala.Sala} mantida na fila após rejeição do oponente`);
  }
  
  // Emitir eventos específicos
  io.to(rejectingSala.Sala).emit('matchRejectedByYou', { 
    matchId, 
    message: "Você rejeitou a partida e saiu da fila"
  });
  
  io.to(acceptingSala.Sala).emit('matchRejectedByOpponent', { 
    matchId, 
    message: "Oponente rejeitou a partida. Continuando a procurar..." 
  });
  
  return true;
}

// Função para iniciar a partida
function startMatch(match) {
  console.log(`Iniciando partida: ${match.sala1.Sala} vs ${match.sala2.Sala}`);
  
  // Aqui você pode implementar a lógica para iniciar o jogo
  // Por exemplo: criar uma instância do jogo, definir mapa, etc.
  
  // Emitir evento de partida iniciada
  io.to(match.sala1.Sala).emit('gameStarted', { 
    matchId: match.id,
    opponentSala: match.sala2 
  });
  
  io.to(match.sala2.Sala).emit('gameStarted', { 
    matchId: match.id,
    opponentSala: match.sala1 
  });
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
      console.log(`Socket ${socket.id} entrou na sala ${salaCreateLobby}`);

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
            console.log(`Socket ${socket.id} entrou na sala ${Sala}`);

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

  // Evento para entrar na fila de matchmaking
  socket.on("joinQueue", (data) => {
    const { salaId } = data;
    console.log("=== JOIN QUEUE ===");
    console.log("SalaId recebido:", salaId);
    console.log("Socket ID:", socket.id);
    console.log("Salas disponíveis:", salas.map(s => s.Sala));
    
    // Encontrar a sala
    const sala = salas.find(s => s.Sala === salaId);
    console.log("Sala encontrada:", sala ? "SIM" : "NÃO");
    
    if (sala) {
      // Garantir que o socket está conectado à sala
      socket.join(salaId);
      console.log(`Socket ${socket.id} conectado à sala ${salaId}`);
      
      // Verificar se está conectado
      const roomClients = io.sockets.adapter.rooms.get(salaId);
      console.log(`Sala ${salaId} agora tem ${roomClients ? roomClients.size : 0} clientes`);
      
      console.log("Adicionando sala à fila:", sala.Sala);
      addToQueue(sala);
      
      // Emitir confirmação para a sala
      io.to(salaId).emit("queueJoined", {
        message: "Sala adicionada à fila de matchmaking",
        position: queue.length
      });
      console.log("Confirmação enviada para sala:", salaId);
    } else {
      console.log("Sala não encontrada!");
      socket.emit("queueError", {
        message: "Sala não está completa ou não encontrada"
      });
    }
  });

  // Evento para confirmar match
  socket.on("confirmMatch", (data) => {
    const { matchId, salaId, playerId } = data;
    
    const success = confirmMatch(matchId, salaId, playerId);
    
    if (success) {
      // Emitir confirmação individual
      socket.emit("matchConfirmationReceived", { matchId, playerId });
      
      // Emitir atualização para a sala
      const match = matches.find(m => m.id === matchId);
      if (match) {
        const totalConfirmations = match.confirmations.sala1.length + match.confirmations.sala2.length;
        
        io.to(match.sala1.Sala).emit("matchUpdate", {
          matchId,
          confirmations: totalConfirmations,
          total: 10
        });
        
        io.to(match.sala2.Sala).emit("matchUpdate", {
          matchId,
          confirmations: totalConfirmations,
          total: 10
        });
      }
    } else {
      socket.emit("matchError", {
        message: "Erro ao confirmar match"
      });
    }
  });

  // Evento para rejeitar match
  socket.on("rejectMatch", (data) => {
    const { matchId, salaId } = data;
    
    // Usar a nova função que remove apenas o time que rejeitou
    const success = rejectMatchByTeam(matchId, salaId);
    
    if (!success) {
      socket.emit("matchError", {
        message: "Erro ao rejeitar match"
      });
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