const jwt = require('jsonwebtoken');

// Sekretny klucz -> ENV
const SECRET_KEY = 'supersekretnyklucz';

const requireAuth = (req, res, next) => {
  // Zakładamy, że token przychodzi w nagłówku "Authorization"
  // np. "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Brak nagłówka Authorization' });
  }

  // Usuwamy "Bearer " i otrzymujemy sam token
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Brak tokenu' });
  }

  try {
    // Weryfikacja tokenu
    const decoded = jwt.verify(token, SECRET_KEY);
    // Zapisanie userId w req, żeby w trasie móc się do niego odwołać
    req.userId = decoded.userId;
    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Nieprawidłowy token' });
  }
};

module.exports = requireAuth;