const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  submitApplication,
  getApplicationStatus,
  addApplicationNote,
  requestAdditionalInfo
} = require('../controllers/applicationControllers');


router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.put('/:id/submit', submitApplication);
router.get('/:id/status', getApplicationStatus);
router.post('/:id/notes', addApplicationNote);
router.post('/:id/request-info', requestAdditionalInfo);

module.exports = router;
