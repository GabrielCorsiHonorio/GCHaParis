// pages/api/upload.js
import multer from 'multer';
import { storage, db } from '../../firebaseAdmin';
var formidable = require('formidable');
import path from 'path';
import fs from 'fs';


// const uploadDir = path.resolve(process.cwd(), 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });

// }
// Função para determinar o tipo MIME do arquivo com base na extensão
function getContentTypeByFileExtension(fileName) {
  const ext = path.extname(fileName);
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.bmp':
      return 'image/bmp';
    case '.webp':
      return 'image/webp';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
    case 'mp4':
      return 'video/mp4';
    case 'avi':
      return 'video/x-msvideo';
    case 'mov':
      return 'video/quicktime';
    case 'mkv':
      return 'video/x-matroska';
    case 'txt':
      return 'text/plain';
    case 'pdf':
      return 'application/pdf';
    case 'doc':
    case 'docx':
      return 'application/msword';
    case 'xls':
    case 'xlsx':
      return 'application/vnd.ms-excel';
    case 'ppt':
    case 'pptx':
      return 'application/vnd.ms-powerpoint';
    case 'zip':
      return 'application/zip';
    case 'rar':
      return 'application/x-rar-compressed';
    default:
      return 'application/octet-stream'; // Tipo genérico para outros tipos de arquivo
  }
}
export const config = {
  api: {
    bodyParser: false, // Desativa o body parser padrão do Next.js para lidar com uploads de arquivos
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://gch-a-paris.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const firebaseConfig = process.env.FIREBASE_CONFIG;
  res.status(200).json({ firebaseConfig });

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.status(200).end();
    return;
  }

  console.log('Request received:', req.method);
  // if (req.method === 'POST') {
    console.log('Upload logic starts');
    try {
      const form = new formidable.IncomingForm(); // Cria a instância de IncomingForm
      // form.uploadDir = 'uploads'; // Diretório onde os arquivos serão temporariamente armazenados
      form.keepExtensions = true; // Mantém a extensão do arquivo original
      form.multiples = true; // Permite o upload de múltiplos arquivos

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Erro ao processar o formulário:', err);
          res.status(500).json({ message: 'Erro ao processar o formulário.' });
          return;
        }

        console.log('Campos recebidos:', fields);
        console.log('Arquivos recebidos:', files);

        // Verifica se files.file existe e se é um array
        if (!files.file) {
          console.error('Nenhum arquivo encontrado no upload.');
          res.status(400).json({ message: 'Nenhum arquivo encontrado no upload.' });
          return;
        }

        const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file]; // Lida com múltiplos arquivos
        const user = fields.user;
        const visibility = fields.visibility;
        const comment = fields.comment;

        // Realiza o upload de cada arquivo
        const uploadPromises = uploadedFiles.map(async (file) => {
          // Verifica se o arquivo possui um nome
          if (!file.originalFilename) {
            console.error('Arquivo sem nome detectado:', file);
            return;
          }

          const fileId = `${user}/${visibility === 'public' ? 'public' : 'private'}/${Date.now()}_${file.originalFilename}`;
          const bucket = storage.bucket();
          const fileRef = bucket.file(fileId);

          const contentType = getContentTypeByFileExtension(file.originalFilename);

          const token = Date.now(); // Gera um token simples com base no timestamp

          const stream = fileRef.createWriteStream({
            metadata: {
              contentType: contentType,
              metadata: {
                firebaseStorageDownloadTokens: token,
              },
            },
          });

          const fileStream = fs.createReadStream(file.filepath);
          fileStream.pipe(stream);

          return new Promise((resolve, reject) => {
            stream.on('error', (error) => {
              console.error('Erro ao fazer upload api:', error);
              reject(error);
            });

            stream.on('finish', async () => {
              // Obtém o token de acesso para o arquivo
              const [metadata] = await fileRef.getMetadata();
              const token = metadata?.metadata?.firebaseStorageDownloadTokens;
             // Gera a URL pública para o arquivo com o token
              const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileId)}?alt=media&token=${token}`;
              // Salva as informações no Firestore
              const fileDocRef = db.collection('files').doc();
              await fileDocRef.set({
                url: fileUrl,
                visibility,
                user,
                fileId,
                comment,
                timestamp: new Date(),
              });

              console.log('Upload concluído:', fileUrl);
              resolve();
            });
          });

          stream.end(file.path);
        });

        // Aguarda o término de todos os uploads
        await Promise.all(uploadPromises);

        res.status(200).json({ message: 'Upload bem-sucedido!' });
      });
    } catch (error) {
      console.error('Erro durante o upload:', error);
      res.status(500).json({ message: 'Erro durante o upload.' });
    }
  // } else {
  //   res.setHeader('Allow', ['POST']);
  //   res.status(405).end(`Método ${req.method} não permitido. Apenas o método POST é suportado.`);
  // }
}
