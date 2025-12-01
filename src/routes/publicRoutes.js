const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/q/:id', publicController.loadQuestionnaire);
router.post('/q/:id/start', publicController.startSession);
router.post('/q/:id/submit', publicController.submitAnswers);

module.exports = router;
