import React from 'react';
import styles from "./Loja.module.scss";

const Loja = () => {
  const products = [
    {
      id: 'prime',
      name: 'Prime',
      type: 'prime',
      description: 'Destaque-se da multidão com o status Prime exclusivo. Obtenha benefícios especiais e mostre seu compromisso com a plataforma.',
      price: 29.90,
      period: '/mês',
      features: [
        'Badge Prime dourado exclusivo',
        'Destaque no perfil e rankings',
        'Acesso prioritário aos servidores',
        'Suporte premium 24/7',
        'Descontos exclusivos na loja'
      ],
      icon: (
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="url(#gradientPrime)"/>
          <defs>
            <linearGradient id="gradientPrime" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ffed4e" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'verified',
      name: 'Verificado',
      type: 'verified',
      description: 'Valide sua identidade e ganhe credibilidade na comunidade. Mostre que você é um jogador legítimo e confiável.',
      price: 19.90,
      period: 'pagamento único',
      features: [
        'Badge verificado azul',
        'Selo de autenticidade no perfil',
        'Aumento de confiança na comunidade',
        'Proteção contra imitadores',
        'Status permanente'
      ],
      icon: (
        <svg width="80" height="80" viewBox="0 0 141 136" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M66.8892 11.5395C69.1484 12.5094 71.7061 12.5128 73.9678 11.5489L85.6143 6.58589C88.376 5.40901 91.5825 6.45437 93.1199 9.03283L99.4143 19.5894C100.685 21.7212 102.781 23.2335 105.204 23.7686L117.485 26.4798C120.452 27.1348 122.461 29.9048 122.162 32.9288L120.975 44.9371C120.727 47.445 121.542 49.942 123.222 51.8208L131.415 60.985C133.455 63.2669 133.451 66.7186 131.404 68.995L123.289 78.0232C121.601 79.9021 120.779 82.4042 121.026 84.9184L122.217 97.0562C122.514 100.087 120.494 102.859 117.519 103.505L105.337 106.151C102.909 106.678 100.807 108.185 99.5292 110.315L93.1333 120.973C91.5883 123.548 88.3779 124.584 85.6192 123.399L74.1144 118.454C71.8531 117.482 69.2924 117.478 67.0285 118.444L55.3882 123.411C52.6255 124.589 49.417 123.544 47.8794 120.963L41.5868 110.404C40.315 108.27 38.2178 106.756 35.7917 106.222L23.5182 103.518C20.5497 102.864 18.5392 100.094 18.838 97.069L20.0251 85.0523C20.2728 82.5445 19.4578 80.0477 17.7782 78.1691L9.58605 69.0059C7.54548 66.7235 7.55066 63.2708 9.59805 60.9945L17.7172 51.9675C19.4022 50.0941 20.2248 47.6001 19.9848 45.0919L18.8213 32.9294C18.532 29.9049 20.5491 27.1416 23.5178 26.4953L35.6666 23.8507C38.0923 23.3226 40.1921 21.8161 41.4694 19.6875L47.8679 9.02464C49.4124 6.45078 52.6213 5.41434 55.3796 6.59845L66.8892 11.5395ZM45.3047 71.3278C38.9324 64.5706 48.7166 54.5019 55.8027 60.8763C58.3013 63.1218 61.9336 66.4022 64.4531 68.627L83.8745 45.0749C90.6353 38.1934 101.312 48.3034 94.635 55.2366L70.248 83.9214C68.9132 85.3137 67.0813 86.1397 65.1398 86.2247C63.1982 86.3097 61.2993 85.647 59.8445 84.3767C55.7083 80.4962 49.6404 74.8979 45.3047 71.3278Z" fill="url(#gradientVerified)"/>
          <defs>
            <linearGradient id="gradientVerified" x1="106.781" y1="117.406" x2="22.125" y2="12.5938">
              <stop stopColor="#1D60E3"/>
              <stop offset="1" stopColor="#04C1FA"/>
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  const handleBuy = (productId) => {
    // Implementar lógica de compra
    alert(`Iniciando compra do produto: ${productId}`);
  };

  return (
    <div className={styles.lojaContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Loja</h1>
          <p className={styles.subtitle}>Adquira benefícios exclusivos e destaque-se na plataforma</p>
        </div>

        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={`${styles.productCard} ${styles[product.type]}`}>
              <div className={styles.productHeader}>
                <div className={styles.productIcon}>
                  {product.icon}
                </div>
                <h2 className={styles.productTitle}>{product.name}</h2>
                <span className={styles.badge}>{product.type === 'prime' ? 'Popular' : 'Permanente'}</span>
              </div>

              <p className={styles.productDescription}>{product.description}</p>

              <ul className={styles.featuresList}>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <div className={styles.priceSection}>
                <span className={styles.priceLabel}>Preço</span>
                <div className={styles.priceValue}>
                  <span className={styles.currency}>R$</span>
                  <span>{product.price.toFixed(2)}</span>
                  <span className={styles.period}>{product.period}</span>
                </div>
              </div>

              <button 
                className={`${styles.btnBuy} ${styles[product.type]}`}
                onClick={() => handleBuy(product.id)}
              >
                <span>Comprar Agora</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loja;
