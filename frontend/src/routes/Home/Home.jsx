import styles from "./Home.module.scss";
import logos from "../../assets/logos.json";
import HowToPlay from "../../components/HowToPlay";

const Home = () => {
  return (
    <>
      <div className={styles.sobreposicao}>
        <img
          className={styles.logoShotz}
          src="src/assets/logos/MainLogo.png"
          alt=""
        />
        <h1 className={styles.mainText}>
          O seu servidor <strong> competitivo </strong> de Arena!
        </h1>
        <p className={styles.subText}>
          Monte seu time e venha disputar com os <strong> melhores </strong> do
          cenário!
        </p>
        <img
          className={styles.background}
          src="src/assets/logos/ShotzBanner.png"
          alt=""
          width="100%"
        />
        <div className={styles.rodapeHome}>
          <p className="d-flex align-items-center text-white m-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className={"mx-2 " + styles.warnLogo}
            >
              <path
                fill="#e63131"
                d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
              />
            </svg>
            Nosso servidor está em desenvolvimento, você está jogando uma versão
            BETA!
          </p>
        </div>
      </div>
      <HowToPlay />
    </>
  );
};

export default Home;
