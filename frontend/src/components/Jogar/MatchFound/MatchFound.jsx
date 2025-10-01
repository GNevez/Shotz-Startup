import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "./MatchFound.module.scss";
import socket from "../../../services/socket";
import { useSelector } from "react-redux";

const MatchFound = ({ show, onHide, matchData, onMatchConfirmed, onMatchRejected }) => {
  const user = useSelector((state) => state.user);
  const [timeLeft, setTimeLeft] = useState(30);
  const [confirmations, setConfirmations] = useState(0);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    if (show && matchData) {
      setTimeLeft(30);
      setConfirmations(0);
      setHasConfirmed(false);
    }
  }, [show, matchData]);

  useEffect(() => {
    let timer;
    if (show && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (show && timeLeft === 0) {
      // Tempo esgotado, rejeitar automaticamente
      handleReject();
    }
    return () => clearTimeout(timer);
  }, [show, timeLeft]);

  useEffect(() => {
    const handleMatchUpdate = (data) => {
      if (data.matchId === matchData?.matchId) {
        setConfirmations(data.confirmations);
      }
    };

    const handleMatchConfirmed = (data) => {
      if (data.matchId === matchData?.matchId) {
        onMatchConfirmed(data);
        onHide();
      }
    };

    const handleMatchRejected = (data) => {
      if (data.matchId === matchData?.matchId) {
        onMatchRejected(data);
        onHide();
      }
    };

    socket.on("matchUpdate", handleMatchUpdate);
    socket.on("matchConfirmed", handleMatchConfirmed);
    socket.on("matchRejected", handleMatchRejected);

    return () => {
      socket.off("matchUpdate", handleMatchUpdate);
      socket.off("matchConfirmed", handleMatchConfirmed);
      socket.off("matchRejected", handleMatchRejected);
    };
  }, [matchData, onMatchConfirmed, onMatchRejected, onHide]);

  const handleConfirm = () => {
    if (!hasConfirmed && matchData) {
      socket.emit("confirmMatch", {
        matchId: matchData.matchId,
        salaId: matchData.salaId,
        playerId: user.id
      });
      setHasConfirmed(true);
    }
  };

  const handleReject = () => {
    if (matchData) {
      socket.emit("rejectMatch", {
        matchId: matchData.matchId,
        salaId: matchData.salaId
      });
      onMatchRejected(matchData);
      onHide();
    }
  };

  if (!show || !matchData) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      className={styles.matchModal}
    >
      <Modal.Header className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>
          🎮 MATCH ENCONTRADO! 🎮
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className={styles.modalBody}>
        <div className={styles.matchInfo}>
          <div className={styles.timerContainer}>
            <div className={styles.timer}>
              {timeLeft}s
            </div>
            <div className={styles.timerLabel}>
              Tempo para aceitar
            </div>
          </div>

          <div className={styles.teamsContainer}>
            <div className={styles.team}>
              <h5 className={styles.teamTitle}>SUA SALA</h5>
              <div className={styles.playersList}>
                {matchData.yourSala?.Players?.map((player, index) => (
                  <div key={index} className={styles.player}>
                    <div className={styles.playerAvatar}>
                      <img src={player.Foto} alt={player.Nome} />
                    </div>
                    <span className={styles.playerName}>{player.Nome}</span>
                    <span className={styles.playerLevel}>{player.Nivel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.vsContainer}>
              <div className={styles.vs}>VS</div>
            </div>

            <div className={styles.team}>
              <h5 className={styles.teamTitle}>SALA ADVERSÁRIA</h5>
              <div className={styles.playersList}>
                {matchData.opponentSala?.Players?.map((player, index) => (
                  <div key={index} className={styles.player}>
                    <div className={styles.playerAvatar}>
                      <img src={player.Foto} alt={player.Nome} />
                    </div>
                    <span className={styles.playerName}>{player.Nome}</span>
                    <span className={styles.playerLevel}>{player.Nivel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.confirmationStatus}>
            <div className={styles.statusText}>
              Confirmações: {confirmations}/10
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${(confirmations / 10) * 100}%` }}
              />
            </div>
          </div>

          {hasConfirmed && (
            <div className={styles.confirmedMessage}>
              ✅ Você confirmou a partida!
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className={styles.modalFooter}>
        <Button
          variant="danger"
          onClick={handleReject}
          className={styles.rejectBtn}
          disabled={hasConfirmed}
        >
          ❌ Rejeitar
        </Button>
        <Button
          variant="success"
          onClick={handleConfirm}
          className={styles.confirmBtn}
          disabled={hasConfirmed}
        >
          ✅ {hasConfirmed ? 'Confirmado' : 'Aceitar Partida'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MatchFound;
