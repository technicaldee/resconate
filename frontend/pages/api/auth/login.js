const { loginAdmin } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      return await loginAdmin(req, res);
    } catch (error) {
      console.error('Login API error:', error);
      if (!res.headersSent) {
        return res.status(500).json({ 
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



