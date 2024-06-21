// pages/api/upload.js
// import multer from 'multer';
import { storage, db } from '../../firebaseAdmin';
var formidable = require('formidable');
import fs from 'fs';
import moment from 'moment-timezone';

// Função para determinar o tipo MIME do arquivo com base na extensão
export const config = {
  api: {
    bodyParser: false, // Desativa o body parser padrão do Next.js para lidar com uploads de arquivos
  },
};


export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://gch-a-paris.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // const firebaseConfig = process.env.FIREBASE_CONFIG;
  // res.status(200).json({ firebaseConfig });

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.status(200).end();
    return;
  }

  console.log('Request received:', req.method);
  if (req.method === 'POST') {
    console.log('Upload logic starts');
    try {
      const form = new formidable.IncomingForm(); // Cria a instância de IncomingForm
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


          const token = Date.now(); // Gera um token simples com base no timestamp

          const stream = fileRef.createWriteStream({
            metadata: {
              contentType: file.mimetype,
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
                timestamp: moment.tz('America/Sao_Paulo').format('DD/MM/YYYY'),
                type: file.mimetype,
              });

              console.log('Upload concluído:', fileUrl);
              resolve();
            });
          });

        });

        // Aguarda o término de todos os uploads
        await Promise.all(uploadPromises);

        res.status(200).json({ message: 'Upload bem-sucedido!' });
      });
    } catch (error) {
      console.error('Erro durante o upload:', error);
      res.status(500).json({ message: 'Erro durante o upload.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido. Apenas o método POST é suportado.`);
  }
}
