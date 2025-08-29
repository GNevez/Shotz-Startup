import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "./CreateLobby.module.scss";
import socket from "../../../services/socket";
import { useSelector } from "react-redux";

const CreateLobby = (props) => {
  const user = useSelector((state) => state.user);

  const [tipoSala, setTipoSala] = useState("");
  const [nomeSala, setNomeSala] = useState("");
  const [erroMessage, setErroMessage] = useState("");

  const handleTipoSala = (event) => {
    setTipoSala(event.target.value);
  };

  const handleNomeSala = (event) => {
    setNomeSala(event.target.value);
  };

  const generateRandomId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (nomeSala !== "") {
      if (tipoSala !== "") {
        const createdLobby = {
          Sala: generateRandomId(),
          tipoSala: tipoSala,
          Nome: nomeSala,
          Players: [
            {
              Id: user.id,
              Nome: user.name,
              Foto: user.avatar,
              Prime: true,
              Verificado: true,
              Nivel: 15,
            },
          ],
        };

        socket.emit("createLobby", createdLobby, (response) => {
          if (response.success) {
            props.onClose();
          } else {
            setErroMessage(response.message);
          }
        });
      } else {
        setErroMessage("Selecione o tipo da sala");
      }
    } else {
      setErroMessage("Favor insira o nome da Sala");
    }
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <form onSubmit={handleSubmit}>
        <Modal.Header className={styles.modalStyle}>
          <Modal.Title>Criar Lobby</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalStyle}>
          <div className="d-flex flex-column">
            <h5>Nome do time:</h5>
            <input
              type="text"
              name="nomeTime"
              id="nomeTime"
              className={styles.inputSla}
              value={nomeSala}
              onChange={handleNomeSala}
            />
          </div>
          <p className="text-uppercase text-white mt-2">{erroMessage}</p>
          <h5 className="mt-3">Tipo de Sala: </h5>
          <div className="d-flex mt-3 gap-4">
            <input
              type="radio"
              id="SalaPrivada1"
              name="SalaPrivada"
              value="SalaPrivada"
              className={styles.skillInput}
              onClick={handleTipoSala}
            />
            <label
              htmlFor="SalaPrivada1"
              className={
                tipoSala === "SalaPrivada" ? styles.skillBtn2 : styles.skillBtn
              }
            >
              <p>Privada</p>
            </label>
            <input
              type="radio"
              id="SalaPublica1"
              name="SalaPublica"
              value="SalaPublica"
              className={styles.skillInput}
              onClick={handleTipoSala}
            />
            <label
              htmlFor="SalaPublica1"
              className={
                tipoSala === "SalaPublica" ? styles.skillBtn2 : styles.skillBtn
              }
            >
              <p>Publica</p>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.modalStyle}>
          <Button variant="secondary" onClick={props.onClose}>
            Fechar
          </Button>
          <Button variant="primary" type="submit">
            Criar
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CreateLobby;
