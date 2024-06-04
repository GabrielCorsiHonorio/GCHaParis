// pages/api/login.js
import { readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const users = JSON.parse(fileContent);

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
