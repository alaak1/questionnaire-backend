const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const questionnaireController = require('../controllers/questionnaireController');
const analyticsController = require('../controllers/analyticsController');
const { Questionnaire } = require('../models');

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

router.use(authMiddleware);
router.post('/logout', authController.logout);

async function questionnaireOwnershipGuard(req, res, next) {
  const questionnaire = await Questionnaire.findByPk(req.params.id);
  if (!questionnaire) {
    return res.status(404).json({ message: 'Questionnaire not found' });
  }
  if (questionnaire.is_legacy || questionnaire.admin_id === null || questionnaire.admin_id === req.admin.id) {
    req.questionnaire = questionnaire;
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
}

router.get('/questionnaires', questionnaireController.list);
router.post('/questionnaires', questionnaireController.create);
router.get('/questionnaires/:id', questionnaireOwnershipGuard, questionnaireController.getOne);
router.put('/questionnaires/:id', questionnaireOwnershipGuard, questionnaireController.update);
router.delete('/questionnaires/:id', questionnaireOwnershipGuard, questionnaireController.remove);

router.get('/questionnaires/:id/results', questionnaireOwnershipGuard, analyticsController.getResults);

module.exports = router;
