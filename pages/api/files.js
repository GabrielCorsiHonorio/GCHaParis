// pages/api/files.js
import { db } from '../../firebaseAdmin';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default async function handlerFiles(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

try {
    const { username } = req.query;

    const filesCollection = db.collection('files');

    // Obter arquivos públicos
    const publicFilesSnapshot = await filesCollection.where('visibility', 'array-contains', 'public').get();
    const publicFiles = [];
    publicFilesSnapshot.forEach((doc) => {
      publicFiles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Obter arquivos privados do usuário específico
    const privateFilesSnapshot = await filesCollection.where('user', 'array-contains', username).get();
    const privateFiles = [];
    privateFilesSnapshot.forEach((doc) => {
      privateFiles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Combinar arquivos públicos e privados
    const files = [...publicFiles, ...privateFiles];

    // Preparar dados para enviar ao frontend
    const filesToSend = files.map((file) => ({
        id: file.id,
        visibility: file.visibility,
        user: file.user,
        imageURL: file.url,
        comment: file.comment
        // Outros campos do arquivo, se necessário
    }));

    // Responder com os arquivos encontrados
    return res.status(200).json(filesToSend);
  }catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
