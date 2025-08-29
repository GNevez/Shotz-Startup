import square from "../assets/squares.png";
import styles from "./Squares.module.scss";

const Squares = (props) => {
  return (
    <div className="mt-5 d-flex">
      <img src={square} alt="" className={styles.square} width={"170px"} />
      <span className={`text-white ${styles.fontWeight}`}>
        {props.mensagem}
      </span>
    </div>
  );
};

export default Squares;
