const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentControllers');
const upload = require('../middlewares/uploadMiddleware');

// Ensure routes have proper callbacks
router.post('/', upload.single('file'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.delete('/:id', documentController.deleteDocument);
router.put('/:id/verify', documentController.verifyDocument);
router.put('/:id/reject', documentController.rejectDocument);

module.exports = router;