const admin = require('firebase-admin');

async function firebaseAuth(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ message: 'Token format is invalid' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
}

module.exports = firebaseAuth;
