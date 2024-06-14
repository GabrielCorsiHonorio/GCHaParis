// pages/upload.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import usersData from '../data/users.json'
import styles from '../styles/upload.module.css';

const Upload = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [selectedUser, setSelectedUser] = useState('');
  const [comment, setComment] = useState('');
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const authenticated = localStorage.getItem('authenticated');

    if (username === 'gabriel' && authenticated === 'true') {
      setIsAdmin(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
          const response = await fetch('/api/login',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched users:', data); // Log para verificar os dados
          setUsers(data);
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);
  
const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
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
    formData.append('comment', comment);


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
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload.');
    };
  };


  if (!isAdmin) {
    return <p>Loading...</p>;
  }


return (
  <div className={styles.pageContainer}>
    <div className={styles.formContainer}>
    <h1 className={styles.h1}>Página de Upload</h1>
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="file">Escolha um arquivo</label>
        <input id="file" className={styles.inputFile} type="file" onChange={handleFileChange} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="visibility">Visibilidade</label>
        <select id="visibility" className={styles.select} value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="public">Público</option>
          <option value="private">Privado</option>
        </select>
      </div>

      {visibility === 'private' && (
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="user">Selecione um usuário</label>
          <select id="user" className={styles.select} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Selecione um usuário</option>
              {users.map(user => (
              <option key={user.username} value={user.username}>
              {user.username}
              </option>
              ))}
          </select>
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="comment">Comentário</label>
        <input
          id="comment"
          className={styles.input}
          type="text"
          placeholder="Comentário"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button className={styles.button} type="button" onClick={handleUpload}>Upload</button>
    </form>
    </div>
  </div>
);

};


export default Upload;
