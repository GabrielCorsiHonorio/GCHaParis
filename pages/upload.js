// pages/upload.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { storage } from '../firebaseConfig'; // Importe apenas o storage, pois é tudo o que você precisa nesta página
import usersData from '../data/users.json';

const Upload = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [selectedUser, setSelectedUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const authenticated = localStorage.getItem('authenticated');

    if (username === 'admin' && authenticated === 'true') {
      setIsAdmin(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('visibility', visibility);
    formData.append('user', selectedUser);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar o arquivo');
      }

      setFile(null);
      setSelectedUser('');

      const result = await response.json();
      console.log('Upload bem-sucedido:', result);
      alert('Upload bem-sucedido!');
      // router.push('/posts');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload.');
      // setError('Erro ao fazer upload');
    }
  };


  if (!isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Página de Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
        <option value="public">Público</option>
        <option value="private">Privado</option>
      </select>
      {visibility === 'private' && (
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Selecione um usuário</option>
          {usersData.map(user => (
            <option key={user.username} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
      )}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
