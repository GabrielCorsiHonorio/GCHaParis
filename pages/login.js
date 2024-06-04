// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

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
    if (username === 'admin') {
      router.push('/upload'); // Redirecionar para a página de upload para o admin
    } else {
      router.push('/posts'); // Redirecionar para a página principal para os outros usuários
    }
  } else {
    setError(result.message);
  }
};


  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
