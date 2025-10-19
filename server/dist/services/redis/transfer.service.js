"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferService = void 0;
const cart_service_1 = __importDefault(require("./cart.service"));
const favorites_service_1 = __importDefault(require("./favorites.service"));
class TransferService {
    // Transfer guest cart to user cart in PostgreSQL
    async transferCart(sessionId, userId, pool) {
        const client = await pool.connect(); // Assuming pool has connect() method
        try {
            const cartKey = `cart:${sessionId}`;
            const cartResult = await cart_service_1.default.getCart(sessionId);
            if (!cartResult.success || cartResult.items.length === 0) {
                return { success: true, message: 'No cart items to transfer' };
            }
            await client.query('BEGIN');
            for (const item of cartResult.items) {
                // Check if item already exists in user cart
                const existingItem = await client.query('SELECT * FROM cart WHERE user_id = $1 AND variant_id = $2', [userId, item.variantId]);
                if (existingItem.rows.length > 0) {
                    // Update quantity (add guest quantity to existing)
                    await client.query('UPDATE cart SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND variant_id = $3', [item.quantity, userId, item.variantId]);
                }
                else {
                    // Insert new item
                    await client.query('INSERT INTO cart (user_id, variant_id, quantity) VALUES ($1, $2, $3)', [userId, item.variantId, item.quantity]);
                }
            }
            await client.query('COMMIT');
            // Clear guest cart from Redis
            await cart_service_1.default.clearCart(sessionId);
            return { success: true, message: 'Cart transferred successfully' };
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Cart transfer error:', error);
            return { success: false, message: 'Failed to transfer cart' };
        }
        finally {
            client.release();
        }
    }
    // Transfer guest favorites to user favorites in PostgreSQL
    async transferFavorites(sessionId, userId, pool) {
        const client = await pool.connect();
        try {
            const favResult = await favorites_service_1.default.getFavorites(sessionId);
            if (!favResult.success || favResult.items.length === 0) {
                return { success: true, message: 'No favorites to transfer' };
            }
            await client.query('BEGIN');
            for (const productId of favResult.items) {
                // Check if item already exists in user favorites
                const existingFav = await client.query('SELECT * FROM user_favorites WHERE user_id = $1 AND product_id = $2', [userId, productId]);
                if (existingFav.rows.length === 0) {
                    // Insert new favorite (avoid duplicates)
                    await client.query('INSERT INTO user_favorites (user_id, product_id) VALUES ($1, $2)', [userId, productId]);
                }
            }
            await client.query('COMMIT');
            // Clear guest favorites from Redis
            await favorites_service_1.default.clearFavorites(sessionId);
            return { success: true, message: 'Favorites transferred successfully' };
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Favorites transfer error:', error);
            return { success: false, message: 'Failed to transfer favorites' };
        }
        finally {
            client.release();
        }
    }
    // Transfer both cart and favorites
    async transferAll(sessionId, userId, pool) {
        try {
            const cartResult = await this.transferCart(sessionId, userId, pool);
            const favResult = await this.transferFavorites(sessionId, userId, pool);
            return {
                success: cartResult.success && favResult.success,
                message: cartResult.success && favResult.success
                    ? 'All data transferred successfully'
                    : 'Some data transfer failed',
                cartTransfer: cartResult,
                favoritesTransfer: favResult
            };
        }
        catch (error) {
            console.error('Full transfer error:', error);
            return {
                success: false,
                message: 'Failed to transfer guest data',
                cartTransfer: { success: false, message: 'Cart transfer failed' },
                favoritesTransfer: { success: false, message: 'Favorites transfer failed' }
            };
        }
    }
}
exports.TransferService = TransferService;
exports.default = new TransferService();
