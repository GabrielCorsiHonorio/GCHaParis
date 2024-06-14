// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

// Adicione logs para depuração
const handleLogin = async () => {
  console.log('Tentando fazer login com:', username, password);
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  console.log('Resposta da API:', result);

  if (response.ok) {
    localStorage.setItem('username', username);
    localStorage.setItem('authenticated', 'true');
    if (username === 'gabriel') {
      router.push('/upload');// Redirecionar para a página de upload para o admin
    } else {
      router.push('/posts');
    }
  } else {
    setError(result.message);
  }
};


  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <h1 className={styles.h1}>Bienvenue</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className={styles.input}
        />
        <button onClick={handleLogin} className={styles.button}>Connexion</button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
