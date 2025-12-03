const analyticsService = require('../services/analyticsService');
const { Questionnaire } = require('../models');
const DEMO_EMAIL = 'demo@demo.com';
const DEMO_ALLOWED_ID = '7ad9e6be-1046-45b9-aa63-95c6ad1947ef';

async function getResults(req, res) {
  if (req.admin?.email === DEMO_EMAIL && req.params.id !== DEMO_ALLOWED_ID) {
    return res.status(403).json({ message: 'Demo user cannot view these results' });
  }
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }
    const isLegacy = questionnaire.is_legacy || questionnaire.admin_id === null;
    if (!isLegacy && questionnaire.admin_id !== req.admin?.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const data = await analyticsService.getQuestionnaireResults(req.params.id, req.admin);
    res.json(data);
  } catch (err) {
    res.status(err.message === 'Questionnaire not found' ? 404 : 400).json({ message: err.message });
  }
}

module.exports = {
  getResults
};
