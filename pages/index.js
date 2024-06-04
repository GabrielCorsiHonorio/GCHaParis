// pages/index.js
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div>
      <h1>Bem-vindo à Rede Social</h1>
      <button onClick={handleLoginRedirect}>Login</button>
    </div>
  );
};

export default Home;
