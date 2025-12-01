const analyticsService = require('../services/analyticsService');
const DEMO_EMAIL = 'demo@demo.com';
const DEMO_ALLOWED_ID = '7ad9e6be-1046-45b9-aa63-95c6ad1947ef';

async function getResults(req, res) {
  if (req.admin?.email === DEMO_EMAIL && req.params.id !== DEMO_ALLOWED_ID) {
    return res.status(403).json({ message: 'Demo user cannot view these results' });
  }
  try {
    const data = await analyticsService.getQuestionnaireResults(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(err.message === 'Questionnaire not found' ? 404 : 400).json({ message: err.message });
  }
}

module.exports = {
  getResults
};
