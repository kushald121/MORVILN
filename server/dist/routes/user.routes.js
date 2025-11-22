"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("../controllers/address.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.authMiddleware);
// Get all addresses for current user
router.get('/addresses', address_controller_1.getUserAddresses);
// Get specific address by ID
router.get('/addresses/:id', address_controller_1.getAddressById);
// Create new address
router.post('/addresses', address_controller_1.createAddress);
// Update address
router.put('/addresses/:id', address_controller_1.updateAddress);
// Delete address
router.delete('/addresses/:id', address_controller_1.deleteAddress);
// Set default address
router.put('/addresses/:id/default', address_controller_1.setDefaultAddress);
exports.default = router;
