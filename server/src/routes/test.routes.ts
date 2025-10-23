import { Router } from 'express';
import testController from '../controllers/test.controller';

const router = Router();

// Health check
router.get('/health', testController.healthCheck);

// Individual tests
router.get('/connection', testController.testConnection);
router.get('/tables', testController.testTables);
router.get('/user-operations', testController.testUserOperations);
router.get('/auth', testController.testAuth);

// Comprehensive test suite
router.get('/all', testController.runAllTests);

export default router;