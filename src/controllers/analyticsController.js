const analyticsService = require('../services/analyticsService');

async function getResults(req, res) {
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
