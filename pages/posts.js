import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/posts.module.css';

const Posts = () => {
  const [isUser, setIsUser] = useState(false);
  const [files, setFiles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    console.log('useEffect triggered');
    const username = localStorage.getItem('username');
    const authenticated = localStorage.getItem('authenticated');

    console.log('Username from localStorage:', username);
    console.log('Authenticated from localStorage:', authenticated);


    if (username && username !== 'gabriel' && authenticated === 'true') {
      setIsUser(true);
      fetchFiles(username);

    } else {
      router.push('/login');
    }
  }, [router]);
  
  const fetchFiles = async (username) => {
    try {
      console.log('Fetching files...');
      const response = await fetch(`/api/files?username=${encodeURIComponent(username)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data);
      console.log('Files:', data);
    } catch (error) {
      console.error('Error fetching files:', error);
      // Trate o erro de forma adequada, exibindo uma mensagem para o usuário, por exemplo.
    } finally {
      console.log('Fetch files completed.');
    }
  };
  

  if (!isUser) {
    return <p>Loading...</p>;
  }

  const username = localStorage.getItem('username');

    return (
      <div className={styles.pageContainer}>
      <p className={styles.usuariotxt}>Bem-vindo, {username}</p>
        <h1 className={styles.h1}>Posts</h1>
        <ul className={styles.postsList}>
          {files.map((file) => (
            <li key={file.id} className={styles.container}>
              <div className={styles.header}>
                <img src="/images/fotodeperfil.png" alt="Foto de perfil" className={styles.profilePic} />
                <span className={styles.profileName}>Gabriel Corsi Honório</span>
              </div>
              <div className={styles.image}>
                {file.imageURL ? (
                  <img src={file.imageURL} alt={file.id} />
                ) : (
                  <p>Imagem não encontrada</p>
                )}
              </div>
              <p className={styles.comment}>{file.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
export default Posts;
