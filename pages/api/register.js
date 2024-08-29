import bcrypt from 'bcryptjs';
import axios from 'axios';
import db from '../../lib/db';
import crypto from 'crypto';
import sendVerificationEmail from '@/lib/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password, recaptchaToken, role } = req.body;

  if (!username || !email || !password || !recaptchaToken) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying reCAPTCHA', error });
  }

  try {
    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Username or email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const startingId = role === 1 ? 1 : 100;

      db.query(
        'SELECT MAX(id) AS maxId FROM users WHERE id >= ?',
        [startingId],
        async (error, results) => {
          if (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
          }

          const newId = results[0].maxId ? results[0].maxId + 1 : startingId;

          const verificationToken = crypto.randomBytes(32).toString('hex');
          console.log(verificationToken);
          db.query(
            'INSERT INTO users (id, username, email, password, role, active, verification_token) VALUES (?, ?, ?, ?, ?, 0, ?)',
            [newId, username, email, hashedPassword, role, verificationToken],
            async (error) => {
              if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                  return res.status(409).json({ message: 'Username or email already in use' });
                } else {
                  return res.status(500).json({ message: 'Internal server error', error: error.message });
                }
              }

              try {
                await sendVerificationEmail(email, username, verificationToken);
                res.status(201).json({ message: 'User created successfully. Verification email sent.' });
              } catch (emailError) {
                res.status(500).json({ message: 'User created, but failed to send verification email', error: emailError.message });
              }
            }
          );
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
