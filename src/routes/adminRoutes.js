const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const questionnaireController = require('../controllers/questionnaireController');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

router.use(authMiddleware);

router.get('/questionnaires', questionnaireController.list);
router.post('/questionnaires', questionnaireController.create);
router.get('/questionnaires/:id', questionnaireController.getOne);
router.put('/questionnaires/:id', questionnaireController.update);
router.delete('/questionnaires/:id', questionnaireController.remove);

router.get('/questionnaires/:id/results', analyticsController.getResults);

module.exports = router;
