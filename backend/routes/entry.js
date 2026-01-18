import express from 'express';
import { createEntry, getEntries, deleteEntry } from '../controllers/entryController.js';
// import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// TEMP: removed auth for testing
router.post('/entry', createEntry);
router.get('/entries', getEntries);
router.delete('/entry/:id', deleteEntry);

export default router;
