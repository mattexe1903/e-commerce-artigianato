const jwt = require('jsonwebtoken');
const pool = require('../db');

const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            const result = await pool.query('SELECT user_id, user_name, email, user_role FROM users WHERE user_id = $1', [decoded.id]);
            console.log('Decoded token:', decoded);
            console.log('Result from DB:', result.rows[0]);
            req.user = result.rows[0];
            next();
        } catch (err) {
            res.status(401).json({ message: 'Token non valido' });
        }
    } else {
        res.status(401).json({ message: 'Token mancante' });
    }
};

module.exports = {
    protect
};