import styles from "./HowToPlay.module.scss";
import Squares from "./Squares";

const HowToPlay = () => {
  return (
    <>
      <div className={styles.background}>
        <div className={"d-flex justify-content-center " + styles.container1}>
          <h1 className={styles.mainText}>Como</h1>
          <h1 className={styles.mainText2}> Jogar</h1>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <Squares mensagem='Realize seu login com discord' />
              <Squares mensagem="Vá em Jogar Agora!" />
              <Squares mensagem="Crie seu time convide seus amigos e busque a fila!" />
            </div>
            <div className="col-lg-6"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToPlay;
