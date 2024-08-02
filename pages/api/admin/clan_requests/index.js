// pages/api/admin/clan_requests.js
import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      db.query('SELECT * FROM clan_requests', (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
        res.status(200).json({ requests: results });
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
