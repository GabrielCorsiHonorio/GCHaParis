import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/posts.module.css';

const Posts = () => {
  const [isUser, setIsUser] = useState(false);
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const [controlsVisible, setControlsVisible] = useState(false);

  const videoRef = useRef(null);


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

  // Função para converter timestamp em Date
const parseDate = (timestamp) => {
  const [day, month, year] = timestamp.split('/');
  return new Date(year, month - 1, day); // Mês é baseado em zero, então subtraímos 1
};

// Ordena os arquivos pela data, mais recentes primeiro
const sortedFiles = files.sort((a, b) => parseDate(b.timestamp) - parseDate(a.timestamp));

const showControls = () => {
  setControlsVisible(true);
};

const hideControls = () => {
  setControlsVisible(false);
};

const handleVideoTouch = () => {
  const video = videoRef.current;
  if (video) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
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
      {sortedFiles.map((file) => (
    <li key={file.id} className={styles.container}>
      <div className={styles.header}>
      <div className={styles.left}>
        <img src="/images/fotodeperfil.png" alt="Foto de perfil" className={styles.profilePic} />
        <span className={styles.profileName}>Gabriel Corsi Honório</span>
      </div>
        <p className={styles.date}>{file.timestamp}</p>
      </div>

      <div className={styles.media}>
  {file.imageURL ? (
    file.type.startsWith('image/') ? (
      <img src={file.imageURL} alt={file.id} className={styles.image} />
    ) : file.type.startsWith('video/') ? (
      <div className={styles.videoContainer}    
      onMouseEnter={showControls}
      onMouseLeave={hideControls}
      onClick={handleVideoTouch}
      onTouchStart={() => videoRef.current?.play()}
      onTouchEnd={() => videoRef.current?.pause()}>
      <video ref={videoRef} controls={controlsVisible} className={styles.video} controlsList="nodownload nofullscreen" >
        <source src={file.imageURL} type={file.type} />
        Seu navegador não suporta a tag de vídeo.
      </video>
    </div>
      ) : file.type.startsWith('audio/') ? (
        <audio 
          ref={videoRef} 
          className={styles.audio}
          onClick={handleVideoTouch}
          onTouchStart={() => videoRef.current?.play()}
          onTouchEnd={() => videoRef.current?.pause()}
          controls
          >
          <source src={file.imageURL} type={file.type} />
            Seu navegador não suporta a tag de áudio.
          </audio>
    ) : (
      <p>Formato de mídia não suportado</p>
    )
  ) : (
    <p>Mídia não encontrada</p>
  )}
</div>

      <p className={styles.comment}><b>{file.comment}</b></p>
    </li>
  ))}
</ul>

      </div>
    );
  };
  
export default Posts;
