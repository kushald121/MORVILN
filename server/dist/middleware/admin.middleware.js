"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    // For now, allow all authenticated users to access admin routes
    // You can modify this based on your user structure when you add role support
    if (!req.user) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Authentication required.'
        });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
