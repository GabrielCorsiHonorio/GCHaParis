export default async function handler(req, res) {
    console.log("Handler called with method:", req.method);
  
    if (req.method === 'GET') {
      const usersJson = process.env.USERS_JSON;
  
      if (!usersJson) {
        console.error("USERS_JSON environment variable is not set");
        res.status(500).json({ message: 'User data not available' });
        return; // Adicione um return aqui
      }
  
      try {
        const users = JSON.parse(usersJson);
        res.status(200).json(users);
      } catch (error) {
        console.error("JSON parsing error:", error);
        res.status(500).json({ message: 'Error parsing user data' });
      }
    } else {
      console.error("Method not allowed:", req.method);
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  