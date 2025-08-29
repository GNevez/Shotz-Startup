import styles from "./Navbar.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import BtnShotz from "../Btn/BtnShotz";
import Login from "../../services/Login";

import { logout } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const user = useSelector((state) => state.user);

  const isLogged = () => {
    return user.isLogged;
  };

  const dispatch = useDispatch();

  const handleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleLoginRedirect = () => {
    window.location.href =
      "https://discord.com/oauth2/authorize?client_id=1157098257202282497&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A1500%2Fapi%2Fauth%2Fcallback%2Fdiscord&scope=identify+guilds+guilds.join+email";
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:1500/logout");
      dispatch(logout());

      window.location.reload();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <Login />
      <nav className={styles.navBar + " container-fluid"}>
        <div className={"row " + styles.rowNav}>
          <div
            className={
              "col-lg-5 d-flex justify-content-evenly align-items-center d-flex " +
              styles.ItensNav
            }
          >
            <Link to="/Jogar" className={styles.navItens2}>
              <button className={styles.logButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className={styles.iconPlay}
                >
                  <path d="M528 56c0-13.3-10.7-24-24-24s-24 10.7-24 24v8H32C14.3 64 0 78.3 0 96V208c0 17.7 14.3 32 32 32H42c20.8 0 36.1 19.6 31 39.8L33 440.2c-2.4 9.6-.2 19.7 5.8 27.5S54.1 480 64 480h96c14.7 0 27.5-10 31-24.2L217 352H321.4c23.7 0 44.8-14.9 52.7-37.2L400.9 240H432c8.5 0 16.6-3.4 22.6-9.4L477.3 208H544c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32H528V56zM321.4 304H229l16-64h105l-21 58.7c-1.1 3.2-4.2 5.3-7.5 5.3zM80 128H464c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                </svg>
                <p>Jogar Agora!</p>
              </button>
            </Link>
            <Link to="/Jogar" className={styles.navItens3}>
              <h5>Jogar</h5>
            </Link>
            <Link to="/" className={styles.navItens}>
              <h5>Inicio</h5>
            </Link>
            <Link to="/Loja" className={styles.navItens}>
              <h5>Loja</h5>
            </Link>
            <Link to="/Ranking" className={styles.navItens}>
              <h5>Ranking</h5>
            </Link>
          </div>
          <div
            className={
              "col-lg-2 justify-content-center align-items-center " +
              styles.navLogo
            }
          >
            <Link to="/">
              <img src="src/assets/logos/MainLogo.png" alt="" width={"200px"} />
            </Link>
          </div>
          <div
            className={
              "col-lg-5 align-items-center justify-content-end " + styles.navLog
            }
          >
            {
            isLogged() ? (
              <div onClick={handleDropdown} className="d-flex">
                <p className={styles.username}>{user.name}</p>
                <img src={user.avatar} alt="" className={styles.imgUser} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className={styles.arrow}
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              </div>
            ) : (
              <BtnShotz
                handle={handleLoginRedirect}
                text={"Entrar com discord!"}
              />
            )}
          </div>
          <div
            className={
              styles.dropdownBtn + (isDropdownVisible ? " d-flex" : " d-none")
            }
          >
            <div className="d-flex">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="user"
                className={styles.iconNav}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
              </svg>
              <Link to={"/Perfil"} className={styles.link}>
                Meu Perfil
              </Link>
            </div>
            <hr className={styles.hr} />
            <div className="d-flex" onClick={handleLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className={styles.iconNav}
              >
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
              <a className={styles.link}>Logout</a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
