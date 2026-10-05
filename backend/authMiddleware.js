const activeTokens = new Map();

function createAuthToken(user) {
    const crypto = require("crypto");

    const token = crypto.randomBytes(32).toString("hex");

    activeTokens.set(token, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        expiresAt: Date.now() + (8 * 60 * 60 * 1000)
    });

    return token;
}

function requireLogin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Login required."
        });
    }

    const token = authHeader.substring(7).trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token."
        });
    }

    const session = activeTokens.get(token);

    if (!session) {
        return res.status(401).json({
            success: false,
            message: "Session expired. Please login again."
        });
    }

    if (Date.now() > session.expiresAt) {
        activeTokens.delete(token);

        return res.status(401).json({
            success: false,
            message: "Session expired. Please login again."
        });
    }

    req.authToken = token;
    req.user = session;

    next();
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied."
        });
    }

    next();
}

function removeAuthToken(token) {
    if (token) {
        activeTokens.delete(token);
    }
}

module.exports = {
    createAuthToken,
    requireLogin,
    requireAdmin,
    removeAuthToken
};