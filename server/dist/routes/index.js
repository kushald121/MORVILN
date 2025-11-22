"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const products_route_1 = __importDefault(require("./products.route"));
const magicLink_route_1 = __importDefault(require("./magicLink.route"));
const pushNotification_routes_1 = __importDefault(require("./pushNotification.routes"));
const adminAuth_routes_1 = __importDefault(require("./adminAuth.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const cloudinary_route_1 = __importDefault(require("./cloudinary.route"));
const upload_route_1 = __importDefault(require("./upload.route"));
const test_routes_1 = __importDefault(require("./test.routes"));
const payment_routes_1 = __importDefault(require("./payment.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const favorites_routes_1 = __importDefault(require("./favorites.routes"));
const cart_routes_1 = __importDefault(require("./cart.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const emailRoutes_1 = __importDefault(require("./emailRoutes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const router = (0, express_1.Router)();
console.log('🔄 Loading routes...');
router.use('/auth', auth_routes_1.default);
router.use('/magic-link', magicLink_route_1.default);
router.use('/push', pushNotification_routes_1.default);
// Mount specific product routes before general ones to avoid conflicts
router.use('/product', product_routes_1.default); // Regular product API endpoints
router.use('/products', products_route_1.default); // SEO-friendly routes
router.use('/admin', adminAuth_routes_1.default); // Admin auth (login) - no middleware
router.use('/admin', admin_routes_1.default); // Admin protected routes
router.use('/cloudinary', cloudinary_route_1.default);
router.use('/upload', upload_route_1.default);
router.use('/test', test_routes_1.default);
router.use('/payment', payment_routes_1.default);
router.use('/orders', order_routes_1.default);
router.use('/favorites', favorites_routes_1.default);
router.use('/cart', cart_routes_1.default);
router.use('/user', user_routes_1.default); // User routes (addresses, profile, etc.)
router.use('/email', emailRoutes_1.default);
console.log('✅ Auth routes loaded');
console.log('✅ Payment routes loaded');
console.log('✅ Gmail Email routes loaded');
console.log('✅ Cart routes loaded');
console.log('✅ Product routes loaded');
console.log('✅ Products routes loaded');
console.log('✅ Admin routes loaded');
// Test route to verify router is working
router.get('/test', (_req, res) => {
    res.json({ message: 'API routes are working!' });
});
exports.default = router;
