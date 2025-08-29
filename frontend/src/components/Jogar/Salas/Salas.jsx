import React, { useEffect, useState } from "react";

import styles from "./Salas.module.scss";

import { useSelector } from "react-redux";
import { selectLobbys } from "../../../redux/lobbySlice";

import socket from "../../../services/socket";

const Salas = () => {

  const salasList = useSelector(selectLobbys);
  const user = useSelector((state) => state.user);

  console.log(salasList);

  const handleJoin = (Sala) => {
    socket.emit("joinRoom", { Sala: Sala, id: user.id });
    window.location.reload();
  };

  const elementos = () => {
    if (!Array.isArray(salasList)) {
      return <p>Não há salas disponíveis.</p>;
    }
    return salasList.map((item, index) => (
      <div className={styles.card} key={index}>
        <div className={styles.topCard}>
          <div className={styles.primeVerificado}></div>
          <div className={styles.nivelTime}>
            <p className={styles.nivelTimeTexto}>{item.Nivel}</p>
          </div>
          <div className={styles.primeVerificado}></div>
        </div>
        <p className={styles.timeName}>{item.Nome}</p>
        <div className={styles.barraHor}></div>
        <div className={"row d-flex " + styles.rowCardCells}>
          {[...Array(6)].map((_, index) => {
            const player = item.Players[index];

            return (
              <div className={"col-md-6 " + styles.cardCells} key={index}>
                {player ? (
                  <>
                    <img
                      src={player.Foto}
                      alt=""
                      className={styles.avatarUser}
                    />
                    <p className={styles.timeName}>{player.Nome}</p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
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
          <p>Entrar na Sala</p>
        </button>
      </div>
    ));
  };

  return (
    <div className={styles.menuServidores + " col-lg-12"}>
      <div className={"row " + styles.row2}>{elementos()}</div>
    </div>
  );
};

export default Salas;
