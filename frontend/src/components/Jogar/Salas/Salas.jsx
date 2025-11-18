import React, { useEffect, useState } from "react";

import styles from "./Salas.module.scss";

import { useSelector } from "react-redux";
import { selectLobbys } from "../../../redux/lobbySlice";

import socket from "../../../services/socket";
import verified from "../../../assets/verified.svg";
import prime from "../../../assets/prime.svg";

const Salas = () => {
  const salasList = useSelector(selectLobbys);
  const user = useSelector((state) => state.user);

  // useEffect(() => {
  //   console.log(salasList);
  // }, [salasList]);

  const handleJoin = (Sala) => {
    socket.emit("joinRoom", { Sala: Sala, id: user.id });
  };

  const elementos = () => {
    if (!Array.isArray(salasList)) {
      return <p className={styles.emptyMessage}>Não há salas disponíveis.</p>;
    }
    return salasList.map((item, index) => {
      const maxPlayers = 6;

      return (
        <div className={styles.card} key={index}>
          <div className={styles.cardHeader}>
            <div className={styles.badge} title="Prime">
              <img src={prime} alt="Prime" />
            </div>
            <div className={styles.nivelTime}>
              <p className={styles.nivelTimeTexto}>{item.Nivel || 15}</p>
            </div>
            <div className={styles.badge} title="Verificado">
              <img src={verified} alt="Verified" style={{ width: "18px" }} />
            </div>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.timeName}>{item.Nome}</p>
            <div className={styles.playersGrid}>
              {[...Array(maxPlayers)].map((_, idx) => {
                const player = item.Players[idx];
                return (
                  <div className={styles.playerSlot} key={idx}>
                    {player ? (
                      <>
                        <img
                          src={player.Foto}
                          alt={player.Nome}
                          className={styles.avatarUser}
                        />
                        <span className={styles.playerName}>{player.Nome}</span>
                      </>
                    ) : (
                      <span className={styles.emptySlot}>Vazio</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <button
            className={styles.btnEntrar}
            onClick={() => handleJoin(item.Sala)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className={styles.svgEntrar}
            >
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
            </svg>
            <span>Entrar na Sala</span>
          </button>
        </div>
      );
    });
  };

  return (
    <div className={styles.menuServidores + " col-lg-12"}>
      <div className={"row " + styles.row2}>{elementos()}</div>
    </div>
  );
};

export default Salas;
