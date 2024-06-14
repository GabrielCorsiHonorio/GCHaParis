// pages/api/users.js
export default async function handler(req, res) {
    if (req.method === 'GET') {
      const usersJson = process.env.USERS_JSON;
  
      if (!usersJson) {
        return res.status(500).json({ message: 'User data not available' });
      }
  
      try {
        const users = JSON.parse(usersJson);
        res.status(200).json(users);
      } catch (error) {
        console.error("JSON parsing error:", error);
        return res.status(500).json({ message: 'Error parsing user data' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  
  