// pages/api/login.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const usersJson = process.env.USERS_JSON;
    if (!usersJson) {
      return res.status(500).json({ message: 'User data not available' });
    }

    try {
    const users = JSON.parse(usersJson);

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  }catch (error) {
    // Capturar qualquer erro durante o parse do JSON
    return res.status(500).json({ message: 'Error parsing user data' });
  }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
