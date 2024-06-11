
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';


dotenv.config();


const app = express();


app.use(cors());


app.use(express.json());


const JWT_SECRET = process.env.JWT_SECRET || 'MzlixeWKQWi5dNNC7GZuyhFUVcBtfj1QZHrHeJhXohA';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'bFDiF+/Tl/ZKDEbIW5hE6As0EKnbBlAsVFZSWm8hIk4';


const users = [{
  id: 1,
  username: 'admin',
  password: bcrypt.hashSync('password', 10)  
}];


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !await bcrypt.compare(password, user.password)) {
    res.status(401).json({ error: 'Invalid username or password' });
  } else {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    res.json({ token, refreshToken });
  }
});


app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ newToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
