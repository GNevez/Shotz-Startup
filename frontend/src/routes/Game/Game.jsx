import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./Game.module.scss";
import socket from "../../services/socket";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  
  // Dados do match vindos da navegação
  const [matchData, setMatchData] = useState(location.state?.matchData || null);
  const [serverLink, setServerLink] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!matchData) {
      toast.error("Dados da partida não encontrados");
      navigate("/jogar");
      return;
    }

    // Gerar link do servidor (simulado - substituir pela lógica real)
    const generatedLink = `connect 192.168.1.${Math.floor(Math.random() * 255)}:27015; password shotz_${matchData.matchId?.slice(-6)}`;
    setServerLink(generatedLink);

    // Listener para quando o jogo terminar
    const handleGameEnded = (data) => {
      toast.info("Partida encerrada!");
      setTimeout(() => {
        navigate("/jogar");
      }, 3000);
    };

    socket.on("gameEnded", handleGameEnded);

    return () => {
      socket.off("gameEnded", handleGameEnded);
    };
  }, [matchData, navigate]);

  const handleCopyServerLink = () => {
    navigator.clipboard
      .writeText(serverLink)
      .then(() => {
        toast.success("Link do servidor copiado!");
      })
      .catch((err) => {
        console.error("Erro ao copiar link:", err);
        toast.error("Erro ao copiar link");
      });
  };

  const handleConnect = () => {
    setIsConnected(true);
    toast.success("Conectando ao servidor...");
    // Aqui você pode adicionar lógica para abrir o jogo automaticamente
  };

  const handleLeaveGame = () => {
    if (window.confirm("Deseja realmente sair da partida?")) {
      toast.info("Saindo da partida...");
      navigate("/jogar");
    }
  };

  if (!matchData) {
    return null;
  }

  const team1 = matchData.sala1 || matchData.yourSala;
  const team2 = matchData.sala2 || matchData.opponentSala;
  const matchId = matchData.matchId || `MATCH_${Date.now()}`;

  return (
    <div className={styles.gameContainer}>
      <div className={styles.header}>
        <div className={styles.matchInfo}>
          <h2 className={styles.title}>PARTIDA INICIADA</h2>
          <div className={styles.matchDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>ID da Partida:</span>
              <span className={styles.value}>{matchId}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Modo:</span>
              <span className={styles.value}>6x6 Competitivo</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Mapa:</span>
              <span className={styles.value}>Arena Principal</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Time 1 - Esquerda */}
        <div className={styles.teamPanel}>
          <div className={styles.teamHeader}>
            <h3 className={styles.teamName}>{team1?.Nome || "Time 1"}</h3>
            <div className={styles.teamBadge}>
              <span className={styles.teamLevel}>{team1?.Nivel || 15}</span>
            </div>
          </div>
          <div className={styles.playersList}>
            {team1?.Players?.map((player, index) => (
              <div key={index} className={styles.playerCard}>
                <img
                  src={player.Foto}
                  alt={player.Nome}
                  className={styles.playerAvatar}
                />
                <div className={styles.playerInfo}>
                  <span className={styles.playerName}>{player.Nome}</span>
                  <div className={styles.playerMeta}>
                    <span className={styles.playerLevel}>Nv. {player.Nivel}</span>
                    {player.Prime && (
                      <span className={styles.badge} title="Prime">👑</span>
                    )}
                    {player.Verificado && (
                      <span className={styles.badge} title="Verificado">✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centro - Ações */}
        <div className={styles.centerPanel}>
          <div className={styles.vsIndicator}>
            <span className={styles.vsText}>VS</span>
          </div>
          
          <div className={styles.actionsCard}>
            <h4 className={styles.actionsTitle}>Conectar ao Servidor</h4>
            
            <div className={styles.serverInfo}>
              <label className={styles.serverLabel}>Link do Servidor:</label>
              <div className={styles.serverLinkContainer}>
                <input
                  type="text"
                  value={serverLink}
                  readOnly
                  className={styles.serverInput}
                />
                <button
                  className={styles.btnCopy}
                  onClick={handleCopyServerLink}
                  title="Copiar link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.icon}>
                    <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/>
                  </svg>
                </button>
              </div>
            </div>

            <button
              className={`${styles.btnConnect} ${isConnected ? styles.btnConnected : ""}`}
              onClick={handleConnect}
              disabled={isConnected}
            >
              {isConnected ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={styles.iconBtn}>
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                  </svg>
                  Conectado
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className={styles.iconBtn}>
                    <path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
                  </svg>
                  Conectar a Partida
                </>
              )}
            </button>

            <div className={styles.instructions}>
              <p className={styles.instructionText}>
                <strong>Instruções:</strong>
              </p>
              <ol className={styles.instructionList}>
                <li>Copie o link do servidor acima</li>
                <li>Cole o id do servidor na pesquisa de partidas customizadas</li>
                <li>Aguarde a conexão com a sala</li>
              </ol>
            </div>

            <button className={styles.btnLeave} onClick={handleLeaveGame}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={styles.iconBtn}>
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
              </svg>
              Sair da Partida
            </button>
          </div>
        </div>

        {/* Time 2 - Direita */}
        <div className={styles.teamPanel}>
          <div className={styles.teamHeader}>
            <h3 className={styles.teamName}>{team2?.Nome || "Time 2"}</h3>
            <div className={styles.teamBadge}>
              <span className={styles.teamLevel}>{team2?.Nivel || 15}</span>
            </div>
          </div>
          <div className={styles.playersList}>
            {team2?.Players?.map((player, index) => (
              <div key={index} className={styles.playerCard}>
                <img
                  src={player.Foto}
                  alt={player.Nome}
                  className={styles.playerAvatar}
                />
                <div className={styles.playerInfo}>
                  <span className={styles.playerName}>{player.Nome}</span>
                  <div className={styles.playerMeta}>
                    <span className={styles.playerLevel}>Nv. {player.Nivel}</span>
                    {player.Prime && (
                      <span className={styles.badge} title="Prime">👑</span>
                    )}
                    {player.Verificado && (
                      <span className={styles.badge} title="Verificado">✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
