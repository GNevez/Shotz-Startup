import React from 'react';
import styles from './Footer.module.scss';
import logos from '../../assets/logos/MainLogo.png';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}> 
        <img src={logos} alt="Shotz Logo" width={200} />
        <div className={styles.links}> 
          <a href="#" className={styles.link}>Suporte</a>
          <a href="#" className={styles.link}>Termos</a>
          <a href="#" className={styles.link}>Privacidade</a>
        </div>
        <div className={styles.copy}>© {year} Shotz. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
};

export default Footer;