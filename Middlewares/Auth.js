const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

const ensureAuthenticated = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token or wrong format');
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch the user from the database
        const user = await UserModel.findById(decoded._id).exec();
        if (!user) {
            console.log('User not found');
            return res.status(403).json({ message: 'Unauthorized, user does not exist' });
        }

        // Attach user details to the request object
        req.user = user;
        // console.log('User verified', req.user);
        next();
    } catch (err) {
        console.log('Token verification failed', err);
        return res.status(403).json({ message: 'Unauthorized, JWT token is wrong or expired' });
    }
}

// Middleware to check user roles
const checkRole = (roles) => {
    return (req, res, next) => {
        // console.log('Checking role', req.user.role);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = { ensureAuthenticated, checkRole };
