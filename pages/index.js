// pages/index.js
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';
require('dotenv').config();


const Home = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <img
          src="/images/torreeiffel.jpg"
          alt="Torre Eiffel"
          className={styles.backgroundImage}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Bem-vindo ao Projeto GCH à Paris</h1>
        <button className={styles.startButton} onClick={handleLoginRedirect}>
          Começar
        </button>
      </div>
    </div>
  );
};

export default Home;
