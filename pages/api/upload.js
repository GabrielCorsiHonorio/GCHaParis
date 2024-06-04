// pages/api/upload.js

import { storage, db } from '../../firebaseAdmin';
var formidable = require('formidable');
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const config = {
  api: {
    bodyParser: false, // Desativa o body parser padrão do Next.js para lidar com uploads de arquivos
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const form = new formidable.IncomingForm(); // Cria a instância de IncomingForm
      form.uploadDir = 'uploads'; // Diretório onde os arquivos serão temporariamente armazenados
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

        // Realiza o upload de cada arquivo
        const uploadPromises = uploadedFiles.map(async (file) => {
          // Verifica se o arquivo possui um nome
          if (!file.originalFilename) {
            console.error('Arquivo sem nome detectado:', file);
            return;
          }

          // const fileName = `${user}/${Date.now()}_${file.originalFilename}`;
          const fileId = `${user}/${Date.now()}_${file.name}`;
          const bucket = storage.bucket();
          const fileRef = bucket.file(fileId);
          const stream = fileRef.createWriteStream({
            metadata: {
              contentType: file.type,
            },
          });

          const fileStream = fs.createReadStream(file.filepath);
          fileStream.pipe(stream);

          return new Promise((resolve, reject) => {
            stream.on('error', (error) => {
              console.error('Erro ao fazer upload:', error);
              reject(error);
            });

            stream.on('finish', async () => {
              const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileId}`;

              // Salva as informações no Firestore
              const fileDocRef = db.collection('files').doc();
              await fileDocRef.set({
                url: fileUrl,
                visibility,
                user,
                fileId,
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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido. Apenas o método POST é suportado.`);
  }
}
