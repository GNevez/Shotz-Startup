import React from "react";
import styles from "./SalaChat.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";

import socket from "../../../services/socket";

const SalaChat = () => {
  const user = useSelector((state) => state.user);

  const [radioSala, setRadioSala] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [inputChatValue, setInputChatValue] = useState(""); // Estado para armazenar o valor do input

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
  };

  const handleSubmitChat = async (event) => {
    event.preventDefault();
    socket.emit("messageChat", dataMessage);
  };

  socket.on("messageChat", (data) => {
    console.log(data);
  });

  return (
    <>
      <div className={styles.container}>
        <div className={"d-flex flex-column mt-3 mx-3 " + styles.inContainer}>
          <div className="d-flex align-items-center gap-3">
            <h4 className="text-white m-0">SUA SALA</h4>
            <div className={styles.nivelDiv}>20</div>
          </div>
          <div className="d-flex mt-3 align-items-center gap-3">
            <button className={styles.btnSala}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className={styles.icons}
              >
                <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
              </svg>
            </button>
            <button className={styles.btnSala}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className={styles.icons}
              >
                <path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
              </svg>
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
            <div className={styles.playersCells}>
              <div className={styles.fotoDiv}></div>
              <p className="text-white m-0">Nevez</p>
              <div className={styles.nivelDiv}>20</div>
            </div>
            <div className={styles.playersCells}>
              <div className={styles.fotoDiv}></div>
              <p className="text-white m-0">Nevez</p>
              <div className={styles.nivelDiv}>20</div>
            </div>
            <div className={styles.playersCells}>
              <div className={styles.fotoDiv}></div>
              <p className="text-white m-0">Nevez</p>
              <div className={styles.nivelDiv}>20</div>
            </div>
            <div className={styles.playersCells}>
              <div className={styles.fotoDiv}></div>
              <p className="text-white m-0">Nevez</p>
              <div className={styles.nivelDiv}>20</div>
            </div>
            <div className={styles.playersCells}>
              <div className={styles.fotoDiv}></div>
              <p className="text-white m-0">Nevez</p>
              <div className={styles.nivelDiv}>20</div>
            </div>
            <div className={styles.playersCells}>
              <div className={styles.fotoDiv}></div>
              <p className="text-white m-0">Nevez</p>
              <div className={styles.nivelDiv}>20</div>
            </div>
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
            <li className="d-flex gap-2 mb-2">
              <div className={styles.userFoto}>
                <img src="" alt="" />
              </div>
              <div className="d-flex flex-column justify-content-between">
                <p className="text-white m-0">Nevez</p>
                <p className={"m-0 " + styles.mensagem}>Dale dele dele dolly</p>
              </div>
            </li>
            <li className="d-flex gap-2 mb-2">
              <div className={styles.userFoto}>
                <img src="" alt="" />
              </div>
              <div className="d-flex flex-column justify-content-between">
                <p className="text-white m-0">Nevez</p>
                <p className={"m-0 " + styles.mensagem}>Dale dele dele dolly</p>
              </div>
            </li>
            <li className="d-flex gap-2 mb-2 justify-content-end">
              <div className="d-flex flex-column">
                <p className="text-white m-0 d-flex justify-content-end">
                  Nevez
                </p>
                <p className={"m-0 " + styles.mensagem}>Drulios </p>
              </div>
              <div className={styles.userFoto}>
                <img src="" alt="" />
              </div>
            </li>
            <li className="d-flex gap-2 mb-2">
              <div className={styles.userFoto}>
                <img src="" alt="" />
              </div>
              <div className="d-flex flex-column justify-content-between">
                <p className="text-white m-0">Nevez</p>
                <p className={"m-0 " + styles.mensagem}>Dale dele dele dolly</p>
              </div>
            </li>
            <li className="d-flex gap-2 mb-2">
              <div className={styles.userFoto}>
                <img src="" alt="" />
              </div>
              <div className="d-flex flex-column justify-content-between">
                <p className="text-white m-0">Nevez</p>
                <p className={"m-0 " + styles.mensagem}>Dale dele dele dolly</p>
              </div>
            </li>
            <li className="d-flex gap-2 mb-2">
              <div className={styles.userFoto}>
                <img src="" alt="" />
              </div>
              <div className="d-flex flex-column justify-content-between">
                <p className="text-white m-0">Nevez</p>
                <p className={"m-0 " + styles.mensagem}>Dale dele dele dolly</p>
              </div>
            </li>
            <li className="d-flex gap-2 mb-2">
              <div className={styles.userFoto}>
                <img src="" alt="" />
              </div>
              <div className="d-flex flex-column justify-content-between">
                <p className="text-white m-0">Nevez</p>
                <p className={"m-0 " + styles.mensagem}>Dale dele dele dolly</p>
              </div>
            </li>
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
            onChange={handleInputChange}
          />
        </form>
      </div>
    </>
  );
};

export default SalaChat;
