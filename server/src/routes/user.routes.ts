import { Router, RequestHandler } from 'express';
import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/address.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all addresses for current user
router.get('/addresses', getUserAddresses as RequestHandler);

// Get specific address by ID
router.get('/addresses/:id', getAddressById as RequestHandler);

// Create new address
router.post('/addresses', createAddress as RequestHandler);

// Update address
router.put('/addresses/:id', updateAddress as RequestHandler);

// Delete address
router.delete('/addresses/:id', deleteAddress as RequestHandler);

// Set default address
router.put('/addresses/:id/default', setDefaultAddress as RequestHandler);

export default router;
