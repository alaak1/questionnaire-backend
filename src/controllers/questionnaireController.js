const { Questionnaire, Question } = require('../models');
const questionnaireService = require('../services/questionnaireService');

async function list(req, res) {
  const questionnaires = await Questionnaire.findAll({
    attributes: ['id', 'title', 'description', 'created_at'],
    order: [['created_at', 'DESC']]
  });
  res.json(questionnaires);
}

async function create(req, res) {
  try {
    const created = await questionnaireService.createQuestionnaire(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getOne(req, res) {
  const questionnaire = await Questionnaire.findByPk(req.params.id, {
    include: [{ model: Question, as: 'questions', order: [['order_index', 'ASC']] }]
  });
  if (!questionnaire) return res.status(404).json({ message: 'Not found' });
  res.json(questionnaire);
}

async function update(req, res) {
  try {
    const updated = await questionnaireService.updateQuestionnaire(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(err.message === 'Questionnaire not found' ? 404 : 400).json({ message: err.message });
  }
}

async function remove(req, res) {
  const deleted = await Questionnaire.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
}

module.exports = {
  list,
  create,
  getOne,
  update,
  remove
};
