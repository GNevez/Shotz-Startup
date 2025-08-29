import React, { useState } from "react";
import styles from "./Perfil.module.scss";

import Me from "./Me/Me";
import Inventario from "./Inventario/Inventario";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import { Outlet, useNavigate } from "react-router-dom";

const Perfil = () => {
  const [activeBtn, setActiveBtn] = useState(1);
  const [activeIcon, setActiveIcon] = useState(null);

  const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleBtn = (id, url) => {
    setActiveBtn(id);
    setActiveIcon(id);

    return navigate(url);
  };

  const handleLoginServer = () => {
    console.log("Logando no servidor");
  };

  return (
    <div
      className={
        "container-fluid justify-content-center d-flex " + styles.containerMain
      }
    >
      <div className="container justify-content-center d-flex">
        <div className={"row d-flex align-items-center " + styles.Row}>
          <div
            className={
              "col-lg-2 align-items-center d-flex justify-content-center " +
              styles.divMain
            }
          >
            <div className={styles.menuBtns}>
              <button
                className={`${styles.btns} ${
                  activeBtn === 1 ? styles.active : ""
                }`}
                onClick={() => handleBtn(1, "./Me")}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="user"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className={`${styles.iconsMenubar} ${
                    activeBtn === 1 ? styles.activeBtn : ""
                  }`}
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
                </svg>
              </button>
              <button
                className={`${styles.btns} ${
                  activeBtn === 2 ? styles.active : ""
                }`}
                onClick={() => handleBtn(2, "./Inventario")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className={`${styles.iconsMenubar} ${
                    activeBtn === 2 ? styles.activeBtn : ""
                  }`}
                >
                  <path d="M50.7 58.5L0 160H208V32H93.7C75.5 32 58.9 42.3 50.7 58.5zM240 160H448L397.3 58.5C389.1 42.3 372.5 32 354.3 32H240V160zm208 32H0V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192z" />
                </svg>
              </button>
              <button
                className={`${styles.btns} ${
                  activeBtn === 3 ? styles.active : ""
                }`}
                onClick={() => handleBtn(3, "./Trocas")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className={`${styles.iconsMenubar} ${
                    activeBtn === 3 ? styles.activeBtn : ""
                  }`}
                >
                  <path d="M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z" />
                </svg>
              </button>
              <button
                className={`${styles.btns} ${
                  activeBtn === 4 ? styles.active : ""
                }`}
                onClick={() => handleBtn(4, "./Time")}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="users"
                  className={`${styles.iconsMenubar} ${
                    activeBtn === 4 ? styles.activeBtn : ""
                  }`}
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"></path>
                </svg>
              </button>
              <button
                className={`${styles.btns} ${
                  activeBtn === 5 ? styles.active : ""
                }`}
                onClick={() => handleBtn(5, "./Configuracoes")}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="gear"
                  className={`${styles.iconsMenubar} ${
                    activeBtn === 5 ? styles.activeBtn : ""
                  }`}
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className={"col-lg-10 d-flex-column " + styles.containerPerfil}>
            <div className={"container-fluid " + styles.perfil1}>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="user"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className={styles.iconUser}
              >
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
              </svg>
              <p className={styles.UserName}>Meu Perfil</p>
            </div>
            <div className={"container-fluid " + styles.perfil2}>
              <img
                src={user.avatar}
                alt=""
                width={"40px"}
                className={styles.logoPequena}
              />
              <div className={styles.divId}>
                <p className={styles.Text1}>Meu ID</p>
                <p className={styles.Text2}>309</p>
              </div>
              <hr className={styles.hr} />
              <div className={styles.divId}>
                <p className={styles.Text1}>Nome de usuario</p>
                <p className={styles.Text2}>Nevez</p>
              </div>
              <hr className={styles.hr} />
              <div className={styles.divId}>
                <p className={styles.Text1}>Premium</p>
                <span className={styles.Text3}>Adquira agora</span>
              </div>
              <hr className={styles.hr} />
              <div className={styles.divId}>
                <p className={styles.Text1}>Acesso Prioritário</p>
                <p className={styles.Text3}>Adquira agora</p>
              </div>
              <hr className={styles.hr} />
              <div className={styles.divId}>
                <div className="d-flex">
                  <p className={styles.Text1}>Online:</p>
                  <p className={styles.Text4}>300/1000</p>
                </div>
                <Link to="../Jogar">
                  <button
                    className={styles.logButton}
                    onClick={handleLoginServer}
                  >
                    <p>Jogar!</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className={styles.iconCnt}
                    >
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
            <div className={"container-fluid " + styles.perfil3}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
