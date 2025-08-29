import React, { useState, useEffect } from "react";
import Salas from "../../components/Jogar/Salas/Salas";

import { io } from "socket.io-client";

import axios from "axios";
import styles from "./Jogar.module.scss";
import CreateLobby from "../../components/Jogar/CreateLobby/CreateLobby";
import SalaChat from "../../components/Jogar/SalaChat/SalaChat";
import { useDispatch, useSelector } from "react-redux";
import { changeLobby } from "../../redux/lobbySlice";
import { selectLobbys } from "../../redux/lobbySlice";

import socket from "../../services/socket";

const Jogar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const salasList = useSelector(selectLobbys);

  const [isInRoom, setIsInRoom] = useState(false);

  socket.on("lobbys", (salas) => {
    dispatchSalas();
    dispatch(changeLobby(salas));
  });

  function dispatchSalas() {
    axios.get("http://localhost:1500/lobbys").then((response) => {
      if (response.data) {
        dispatch(changeLobby(response.data));
        console.log(response.data);
      }
    });
  }

  useEffect(() => {
    dispatchSalas();
  }, []);

  useEffect(() => {
    for (const item of salasList) {
      for (const players of item.Players) {
        console.log(players);
        if (players.Id === user.id) {
          setIsInRoom(true);
        }
      }
    }
  }, [salasList]);

  const [isChecked, setIsChecked] = useState(false);
  const [radioFilter, setRadioFilter] = useState(false);
  const [checkVaga, setCheckVaga] = useState(false);
  const [valueRange, setValueRange] = useState(50);
  const [radioSkill, setRadioSkill] = useState(false);
  const [visiblePopCreate, setVisiblePopCreate] = useState(false);

  const handleChangeRange = (event) => {
    setValueRange(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleRadioFilter = (event) => {
    setRadioFilter(event.target.value);
  };

  const handleCheckVaga = (event) => {
    setCheckVaga(event.target.checked);
  };

  const handleRadioSkill = (event) => {
    setRadioSkill(event.target.value);
  };

  const handlePopCreate = () => {
    setVisiblePopCreate(true);
  };

  const handlePopInvisible = () => {
    setVisiblePopCreate(false);
  };

  return (
    <>
      {isInRoom ? <SalaChat /> : ""}

      <div
        className={
          "container-fluid justify-content-center d-flex " +
          styles.containerMain
        }
      >
        <div className="container justify-content-center d-flex">
          <div className={"row " + styles.Row}>
            <div
              className={`${
                isChecked ? styles.menuPlay2 : styles.menuPlay1
              } col-lg-12  ${styles.menuPlay}`}
            >
              <div className={styles.row2 + " row"}>
                <div className="col-lg-6 align-items-center d-flex gap-3">
                  <button className={styles.logButton}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                      className={styles.svg}
                    >
                      <path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z" />
                    </svg>
                    <p>Jogar Solo (6x6)</p>
                  </button>
                  <button className={styles.logButton}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className={styles.svg}
                    >
                      <path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z" />
                    </svg>
                    <p>Partida Rapida</p>
                  </button>
                  <CreateLobby
                    show={visiblePopCreate}
                    onClose={handlePopInvisible}
                  />
                  <button
                    className={styles.logButton}
                    type="button"
                    onClick={handlePopCreate}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className={styles.svg}
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                    <p>Criar Lobby</p>
                  </button>
                </div>
                <div className={"col-lg-4 " + styles.colMenu}>
                  <div className={"d-flex " + styles.skillDiv}>
                    <div className={styles.skills}>
                      <p className={styles.skillLevel}>Skill Level</p>
                      <p className={styles.levelSkill}>{valueRange}</p>
                    </div>
                    <div className={styles.radioCustom}>
                      <input
                        type="radio"
                        id="skillGap1"
                        name="skillGap"
                        value={"skillGap1"}
                        className={styles.skillInput}
                        onChange={handleRadioSkill}
                      />
                      <label
                        htmlFor="skillGap1"
                        className={
                          radioSkill === "skillGap1"
                            ? styles.skillBtn2
                            : styles.skillBtn
                        }
                      >
                        <p>Times</p>
                      </label>
                    </div>
                    <div className={styles.radioCustom}>
                      <input
                        type="radio"
                        id="skillGap2"
                        name="skillGap"
                        value={"skillGap2"}
                        className={styles.skillInput}
                        onChange={handleRadioSkill}
                      />
                      <label
                        htmlFor="skillGap2"
                        className={
                          radioSkill === "skillGap2"
                            ? styles.skillBtn2
                            : styles.skillBtn
                        }
                      >
                        <p>Jogadores</p>
                      </label>
                    </div>
                  </div>
                  <div className="volume-slider">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className={styles.slider}
                      id="volumeRange"
                      value={valueRange}
                      onChange={handleChangeRange}
                    />
                  </div>
                </div>
                <div
                  className={
                    "col-lg-2 align-items-center justify-content-center " +
                    styles.dFlexColumn
                  }
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      id="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="checkbox" className={styles.toggle}>
                      <div className={styles.bars + " " + styles.bar1}></div>
                      <div className={styles.bars + " " + styles.bar2}></div>
                      <div className={styles.bars + " " + styles.bar3}></div>
                    </label>
                  </div>
                </div>
              </div>
              <div
                className={`${
                  isChecked ? styles.opacity100 : styles.opacity0
                } row ${styles.filters}`}
              >
                <div className={"col-lg-6"}></div>
                <div
                  className={
                    "col-lg-6 justify-content-center " + styles.dFlexColumn
                  }
                >
                  <div className="d-flex gap-4 align-items-center justify-content-center">
                    <p className={styles.playFilter}>Jogar Com:</p>
                    <label
                      htmlFor="radioFilter1"
                      className={
                        radioFilter === "radioFilter1"
                          ? styles.filterBtn2
                          : styles.filterBtn
                      }
                      onChange={handleRadioFilter}
                    >
                      <input
                        type="radio"
                        name="radioFilter"
                        value={"radioFilter1"}
                        className={"d-none"}
                        id="radioFilter1"
                      />
                      <p>Todos</p>
                    </label>
                    <label
                      htmlFor="radioFilter2"
                      className={
                        radioFilter === "radioFilter2"
                          ? styles.filterBtn2
                          : styles.filterBtn
                      }
                      onChange={handleRadioFilter}
                    >
                      <input
                        type="radio"
                        name="radioFilter"
                        value={"radioFilter2"}
                        className={"d-none"}
                        id="radioFilter2"
                      />
                      <p>Verificados</p>
                    </label>
                    <label
                      htmlFor="radioFilter3"
                      className={
                        radioFilter === "radioFilter3"
                          ? styles.filterBtn2
                          : styles.filterBtn
                      }
                      onChange={handleRadioFilter}
                    >
                      <input
                        type="radio"
                        name="radioFilter"
                        value={"radioFilter3"}
                        className={"d-none"}
                        id="radioFilter3"
                      />
                      <p>Verificados e Prime</p>
                    </label>
                  </div>
                  <hr className={styles.hr} />
                  <div className="d-flex gap-4 align-items-center justify-content-center">
                    <label
                      htmlFor="checkVaga"
                      className={checkVaga ? styles.bg2 : styles.checkVaga}
                    >
                      <input
                        type="checkbox"
                        name="checkVaga"
                        className={styles.checkInput}
                        onChange={handleCheckVaga}
                      />
                    </label>
                    <p className={styles.skillLevel}>Exibir Lobbys com vagas</p>
                  </div>
                  <hr className={styles.hr} />
                  <div className="d-flex gap-4 align-items-center justify-content-center">
                    <p className={styles.skillLevel}>Pesquisar Salas:</p>{" "}
                    <input type="text" className={styles.searchRooms} />
                  </div>
                </div>
              </div>
            </div>
            <Salas />
          </div>
        </div>
      </div>
    </>
  );
};

export default Jogar;
