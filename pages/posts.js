import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

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

    if (username && username !== 'admin' && authenticated === 'true') {
      setIsUser(true);
      fetchFiles(username);
    } else {
      router.push('/login');
    }
  }, [router]);

  // useEffect(() => {
  //   console.log('useEffect triggered');
  // }, [router]);
  

  const fetchFiles = async (username) => {
    try {
      const filesCollection = collection(db, 'files');
      const publicQuery = query(filesCollection, where('visibility', 'array-contains', 'public'));
      const privateQuery = query(filesCollection, where('user', 'array-contains', username));

      console.log('Fetching public files...');
      const publicFilesSnapshot = await getDocs(publicQuery);
      publicFilesSnapshot.forEach((doc) => {
        console.log(`Public file: ${doc.id} => ${JSON.stringify(doc.data())}`);
      });
      console.log('Public files fetched:', publicFilesSnapshot.size);

      console.log('Fetching private files...');
      const privateFilesSnapshot = await getDocs(privateQuery);
      console.log('Private files fetched:', privateFilesSnapshot.size);

      const publicFiles = publicFilesSnapshot.docs.map((doc) => doc.data());
      const privateFiles = privateFilesSnapshot.docs.map((doc) => doc.data());

      console.log('Public files:', publicFiles);
      console.log('Private files:', privateFiles);

      setFiles([...publicFiles, ...privateFiles]);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const fileRef = ref(storage, fileId);
      const fileUrl = await getDownloadURL(fileRef);
      console.log('File URL:', fileUrl);

      // Redirecionar para o arquivo
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Erro ao fazer o download do arquivo.');
    }
  };

  if (!isUser) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Página Principal</h1>
      {files.length === 0 ? (
        <p>Nenhum arquivo disponível.</p>
      ) : (
        // <ul>
        //   {files.map((file) => (
        //     <li key={file.id}>
        //       <img src={file.url} alt={file.url.split('/').pop()} style={{ maxWidth: '100%', height: 'auto' }} />
        //     </li>
        //   ))}
        // </ul>
        <ul>
        {files.map((file) => (
          <li key={file.id}>
            <img
              src={file.url}
              alt={file.originalFilename}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default Posts;
