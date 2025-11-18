import React from "react";
import styles from "./SalaChat.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import socket from "../../../services/socket";
import MatchFound from "../MatchFound/MatchFound";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalaChat = (props) => {
  const user = useSelector((state) => state.user);

  const [radioSala, setRadioSala] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [inputChatValue, setInputChatValue] = useState(""); // Estado para armazenar o valor do input
    const [yourRoom, setYourRoom] = useState(props.yourRoom || []);
    const [chatMessages, setChatMessages] = useState([]); // Estado para armazenar mensagens do chat
    const phrases = [
      "Chame seus amigos para montar o time!",
      "Salas completas entram mais rápido em partida.",
      "Use o link da sala para recrutar jogadores!",
      "Comunicação vence jogos: diga seu plano.",
      "Todos prontos? Bora buscar a partida!",
      "Respeite seus aliados. Toxicidade será punida.",
      "Convide alguém novo hoje para fortalecer a comunidade.",
      "Ajuste suas preferências antes de entrar na fila.",
      "Compartilhe estratégias no chat enquanto aguardam.",
      "Lembre-se: jogo limpo, vitória certa.",
    ];
    const [phraseIndex, setPhraseIndex] = useState(() =>
      Math.floor(Math.random() * phrases.length)
    );
    const [inQueue, setInQueue] = useState(() => {
      // Recuperar estado do localStorage
      const savedInQueue = localStorage.getItem("inQueue");
      return savedInQueue === "true";
    });
    const [matchData, setMatchData] = useState(null);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [currentSalaId, setCurrentSalaId] = useState(() => {
      // Recuperar salaId do localStorage
      return localStorage.getItem("currentSalaId");
    });

    // Verificar se o usuário atual é o líder da sala
    const isLeader = yourRoom?.Players?.[0]?.Id === user.id;
    const handleInputChange = (event) => {
      setInputChatValue(event.target.value); // Atualiza o estado com o valor do input
    };

    const handleRadioSala = (event) => {
      setRadioSala(event.target.value);
    };

    const handleChatOpen = () => {
      setChatOpen((prevState) => !prevState);
    };

    const dataMessage = {
      user: user.name,
      id: user.id,
      text: inputChatValue,
      salaId: yourRoom?.Sala,
    };

    const handleSubmitChat = async (event) => {
      event.preventDefault();

      if (!inputChatValue.trim()) return; // Não enviar mensagem vazia

      socket.emit("messageChat", dataMessage);
      setInputChatValue(""); // Limpar input após enviar
    };

    useEffect(() => {
      setYourRoom(props.yourRoom);
    }, [props.yourRoom]);

    // Rotacionar frases enquanto não há mensagens
    useEffect(() => {
      if (chatMessages.length === 0) {
        const interval = setInterval(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 6000);
        return () => clearInterval(interval);
      }
    }, [chatMessages.length, phrases.length]);

    // Salvar estado no localStorage
    useEffect(() => {
      localStorage.setItem("inQueue", inQueue.toString());
    }, [inQueue]);

    useEffect(() => {
      if (currentSalaId) {
        localStorage.setItem("currentSalaId", currentSalaId);
      }
    }, [currentSalaId]);

    // Reconectar à fila após F5 se estava na fila
    useEffect(() => {
      if (inQueue && yourRoom && yourRoom.Sala) {
        console.log("Reconectando à fila após F5...");
        const salaId = yourRoom.Sala;
        setCurrentSalaId(salaId);
        socket.emit("joinQueue", { salaId });
      }
    }, [inQueue, yourRoom]);

    // Listener global para debug do matchFound
    useEffect(() => {
      const debugMatchFound = (data) => {
        console.log("🔍 DEBUG: Evento matchFound recebido globalmente:", data);
      };

      // Teste de conectividade do socket
      const testSocket = () => {
        console.log("🔌 Testando conectividade do socket...");
        console.log("Socket conectado:", socket.connected);
        console.log("Socket ID:", socket.id);
      };

      socket.on("matchFound", debugMatchFound);
      socket.on("connect", testSocket);

      // Testar imediatamente
      testSocket();

      return () => {
        socket.off("matchFound", debugMatchFound);
        socket.off("connect", testSocket);
      };
    }, []);

    // Evitar múltiplas entradas na fila
    useEffect(() => {
      if (inQueue && currentSalaId) {
        console.log(
          "Usuário já está na fila, não emitindo joinQueue novamente"
        );
      }
    }, [inQueue, currentSalaId]);

    useEffect(() => {
      const handleLobbyCreated = (data) => {
        console.log(data);
      };
      const handleMessageChat = (data) => {
        console.log("Mensagem recebida:", data);
        // Adicionar mensagem ao estado apenas se for da sala atual
        if (data.room === yourRoom?.Sala) {
          setChatMessages((prev) => [...prev, data]);
        }
      };

      const handleQueueJoined = (data) => {
        console.log("Fila:", data);
        // Atualizar estado para todos os membros da sala
        setInQueue(true);
        if (data.position) {
          toast.info(`Posição na fila: ${data.position}`);
        }
      };

      const handleQueueError = (data) => {
        console.log("Erro na fila:", data);
        toast.error(data.message);
        setInQueue(false);
      };

      const handleMatchFound = (data) => {
        console.log("🎮 MATCH FOUND RECEBIDO NO FRONTEND! 🎮");
        console.log("Dados do match:", data);
        console.log("yourRoom atual:", yourRoom);
        console.log("currentSalaId:", currentSalaId);

        setMatchData({
          matchId: data.matchId,
          opponentSala: data.opponentSala,
          yourSala: yourRoom, // yourRoom já tem a estrutura correta
          salaId: currentSalaId,
          timeToAccept: data.timeToAccept,
        });
        setShowMatchModal(true);
        setInQueue(false);
      };

      const handleMatchRejected = (data) => {
        console.log("Match rejeitado:", data);
        toast.warning("Match rejeitado. Voltando para a fila...");
        setShowMatchModal(false);
        setMatchData(null);
        // Voltar para a fila automaticamente
        if (currentSalaId) {
          socket.emit("joinQueue", { salaId: currentSalaId });
          setInQueue(true);
        }
      };

      const handleMatchRejectedByYou = (data) => {
        console.log("Você rejeitou o match:", data);
        toast.warning(data.message);
        setShowMatchModal(false);
        setMatchData(null);

        // Resetar estado da fila completamente
        setInQueue(false);
        setCurrentSalaId(null);
        localStorage.removeItem("inQueue");
        localStorage.removeItem("currentSalaId");

        console.log("Estado da fila resetado após rejeição");
      };

      const handleMatchRejectedByOpponent = (data) => {
        console.log("Oponente rejeitou o match:", data);
        toast.info(data.message);
        setShowMatchModal(false);
        setMatchData(null);
        // Manter na fila - não fazer nada
      };

      const handleMatchConfirmed = (data) => {
        console.log("Match confirmado:", data);
        toast.success("Partida confirmada! Iniciando jogo...");
        // Limpar estado da fila
        setInQueue(false);
        setCurrentSalaId(null);
        localStorage.removeItem("inQueue");
        localStorage.removeItem("currentSalaId");
        // Aqui você pode redirecionar para o jogo ou fazer outras ações
      };

      const handleLeftLobby = (data) => {
        console.log("Resposta ao sair da sala:", data);

        if (data.success) {
          // Recarregar a página para voltar à listagem de salas
          window.location.reload();
        } else {
          toast.error(data.message || "Erro ao sair da sala");
        }
      };

      const handleQueueLeft = (data) => {
        console.log("Saiu da fila:", data);
        // Atualizar estado para todos os membros
        setInQueue(false);
        setCurrentSalaId(null);
        localStorage.removeItem("inQueue");
        localStorage.removeItem("currentSalaId");
        toast.info(data.message);
      };

      socket.on("attSala", (data) => {
        console.log("attSala recebido:", data);
        setYourRoom(data); // Atualizar o objeto completo da sala

        // Limpar mensagens ao trocar de sala
        if (yourRoom?.Sala && data.Sala !== yourRoom.Sala) {
          setChatMessages([]);
        }
      });

      socket.on("messageChat", handleMessageChat);
      socket.on("queueJoined", handleQueueJoined);
      socket.on("queueError", handleQueueError);
      socket.on("queueLeft", handleQueueLeft);
      socket.on("matchFound", handleMatchFound);
      socket.on("matchConfirmed", handleMatchConfirmed);
      socket.on("matchRejected", handleMatchRejected);
      socket.on("matchRejectedByYou", handleMatchRejectedByYou);
      socket.on("matchRejectedByOpponent", handleMatchRejectedByOpponent);
      socket.on("leftLobby", handleLeftLobby);

      return () => {
        socket.off("playerJoined", handleLobbyCreated);
        socket.off("messageChat", handleMessageChat);
        socket.off("attSala");
        socket.off("queueJoined", handleQueueJoined);
        socket.off("queueError", handleQueueError);
        socket.off("queueLeft", handleQueueLeft);
        socket.off("matchFound", handleMatchFound);
        socket.off("matchConfirmed", handleMatchConfirmed);
        socket.off("matchRejected", handleMatchRejected);
        socket.off("matchRejectedByYou", handleMatchRejectedByYou);
        socket.off("matchRejectedByOpponent", handleMatchRejectedByOpponent);
        socket.off("leftLobby", handleLeftLobby);
      };
    }, [props.yourRoom, currentSalaId, yourRoom?.Sala]);

    const handleJoinQueue = () => {
      if (inQueue) {
        toast.warning("Você já está procurando partida!");
        return;
      }

      if (yourRoom && yourRoom.Sala) {
        const salaId = yourRoom.Sala;
        console.log("Entrando na fila - salaId: " + salaId);

        socket.emit("joinQueue", { salaId });
        setInQueue(true);
        setCurrentSalaId(salaId);
        toast.success("Você entrou na fila de matchmaking!");
      } else {
        toast.error("Erro: ID da sala não encontrado");
      }
    };

    const handleCancelQueue = () => {
      if (inQueue && currentSalaId) {
        console.log(`Cancelando fila - salaId: ${currentSalaId}`);

        // Emitir evento para sair da fila
        socket.emit("leaveQueue", { salaId: currentSalaId });

        // Limpar estados
        setInQueue(false);
        setCurrentSalaId(null);
        localStorage.removeItem("inQueue");
        localStorage.removeItem("currentSalaId");

        toast.info("Você saiu da fila de matchmaking");
      }
    };

    const handleLeaveLobby = () => {
      if (yourRoom && yourRoom.Sala) {
        const salaId = yourRoom.Sala;
        const userId = user.id;

        console.log(`Saindo da sala - salaId: ${salaId}, userId: ${userId}`);

        // Emitir evento para sair da sala
        socket.emit("leaveLobby", { salaId, userId });

        // Limpar estados locais
        setInQueue(false);
        setCurrentSalaId(null);
        setYourRoom(null);
        localStorage.removeItem("inQueue");
        localStorage.removeItem("currentSalaId");

        toast.info("Você saiu da sala");
      } else {
        toast.error("Erro: ID da sala não encontrado");
      }
    };

    const handleCopyRoomLink = () => {
      if (yourRoom && yourRoom.Sala) {
        const roomLink = `${window.location.origin}/jogar?sala=${yourRoom.Sala}`;

        navigator.clipboard
          .writeText(roomLink)
          .then(() => {
            toast.success("Link da sala copiado!");
          })
          .catch((err) => {
            console.error("Erro ao copiar link:", err);
            toast.error("Erro ao copiar link da sala");
          });
      } else {
        toast.error("Erro: ID da sala não encontrado");
      }
    };

    return (
      <>
        <div className={styles.container}>
          <div className={"d-flex flex-column mt-3 mx-3 " + styles.inContainer}>
            <div className={styles.headerRoom}>
              <div className="d-flex align-items-center gap-3">
                <h4 className={styles.titleRoom}>SUA SALA</h4>
                <div className={styles.nivelDiv}>20</div>
              </div>
            </div>
            <div className={styles.actionsContainer}>
              <div className={styles.smallButtonsGroup}>
                <button
                  className={styles.btnSala}
                  title="Copiar link da sala"
                  onClick={handleCopyRoomLink}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    className={styles.icons}
                  >
                    <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
                  </svg>
                </button>
                <button
                  className={styles.btnSalaLeave}
                  onClick={handleLeaveLobby}
                  title="Sair da sala"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className={styles.icons}
                  >
                    <path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                  </svg>
                </button>
              </div>
              <button
                className={`${styles.btnQueue} ${
                  inQueue ? styles.btnQueueActive : ""
                } ${!isLeader ? styles.btnQueueDisabled : ""}`}
                onClick={
                  isLeader
                    ? inQueue
                      ? handleCancelQueue
                      : handleJoinQueue
                    : null
                }
                disabled={!isLeader}
                title={
                  !isLeader
                    ? "Apenas o líder da sala pode controlar a fila"
                    : ""
                }
              >
                {inQueue ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      className={styles.iconQueue}
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                    {isLeader ? "Cancelar Fila" : "Procurando Partida..."}
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className={styles.iconQueue}
                    >
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                    </svg>
                    Entrar na Fila
                  </>
                )}
              </button>
            </div>
            <hr className={styles.hr} />
            <h5 className="text-white m-0 mb-3">TIPO DE SALA</h5>
            <div className={"d-flex gap-3"}>
              <div className={styles.radioCustom}>
                <input
                  type="radio"
                  id="tipoSala1"
                  name="tipoSala"
                  value={"tipoPrivada"}
                  className={styles.skillInput}
                  onChange={handleRadioSala}
                />
                <label
                  htmlFor="tipoSala1"
                  className={
                    radioSala === "tipoPrivada"
                      ? styles.skillBtn2
                      : styles.skillBtn
                  }
                >
                  <p>Privada</p>
                </label>
              </div>
              <div className={styles.radioCustom}>
                <input
                  type="radio"
                  id="tipoSala2"
                  name="tipoSala"
                  value={"tipoPublico"}
                  className={styles.skillInput}
                  onChange={handleRadioSala}
                />
                <label
                  htmlFor="tipoSala2"
                  className={
                    radioSala === "tipoPublico"
                      ? styles.skillBtn2
                      : styles.skillBtn
                  }
                >
                  <p>Publica</p>
                </label>
              </div>
            </div>
            <hr className={styles.hr} />
            <div className="d-flex flex-column">
              {yourRoom &&
                yourRoom.Players &&
                yourRoom.Players.map((item, index) => {
                  return (
                    <div key={index} className={styles.playersCells}>
                      <img
                        src={item.Foto}
                        alt={item.Nome}
                        className={styles.userFoto}
                      />
                      <p className="text-white m-0">{item.Nome}</p>
                      <div className={styles.nivelDiv}>{item.Nivel}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div
          className={styles.chatContainer}
          style={chatOpen ? { top: "96%" } : {}}
        >
          <button className={styles.btnOpenChat} onClick={handleChatOpen}>
            <p>CHAT</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              className={styles.iconChat}
              style={chatOpen ? { transform: "rotate(180deg)" } : {}}
            >
              <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
            </svg>
          </button>
          <div className={"m-3 " + styles.chatArea}>
            <ul className={styles.listChat}>
              {chatMessages.length === 0 ? (
                <li
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "60px", opacity: 0.75 }}
                >
                  <p className="text-white m-0" style={{ textAlign: "center" }}>
                    {phrases[phraseIndex]}
                  </p>
                </li>
              ) : (
                chatMessages.map((message, index) => {
                  // Encontrar o jogador que enviou a mensagem
                  const sender = yourRoom?.Players?.find(
                    (p) => p.Nome === message.user
                  );
                  const isCurrentUser = message.user === user.name;

                  return isCurrentUser ? (
                    <li
                      key={index}
                      className="d-flex gap-2 mb-2 justify-content-end"
                    >
                      <div className="d-flex flex-column">
                        <p className="text-white m-0 d-flex justify-content-end">
                          {message.user}
                        </p>
                        <p className={"m-0 " + styles.mensagem}>
                          {message.text}
                        </p>
                      </div>
                      <div className={styles.userFoto}>
                        <img
                          src={sender?.Foto || user.avatar}
                          alt={message.user}
                        />
                      </div>
                    </li>
                  ) : (
                    <li key={index} className="d-flex gap-2 mb-2">
                      <div className={styles.userFoto}>
                        <img src={sender?.Foto || ""} alt={message.user} />
                      </div>
                      <div className="d-flex flex-column justify-content-between">
                        <p className="text-white m-0">{message.user}</p>
                        <p className={"m-0 " + styles.mensagem}>
                          {message.text}
                        </p>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <form
            action=""
            className={styles.inputChatDiv}
            onSubmit={handleSubmitChat}
          >
            <input
              className={styles.chatInput}
              type="text"
              value={inputChatValue}
              onChange={handleInputChange}
              placeholder="Digite sua mensagem..."
            />
          </form>
        </div>

        <MatchFound
          show={showMatchModal}
          onHide={() => setShowMatchModal(false)}
          matchData={matchData}
          onMatchConfirmed={(data) => {
            console.log("Match confirmado:", data);
            // Implementar lógica de redirecionamento para o jogo
          }}
          onMatchRejected={(data) => {
            console.log("Match rejeitado:", data);
            setShowMatchModal(false);
            setMatchData(null);
          }}
        />
      </>
    );
};

export default SalaChat;
