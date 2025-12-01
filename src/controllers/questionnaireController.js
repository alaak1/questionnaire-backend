const { Questionnaire, Question } = require('../models');
const questionnaireService = require('../services/questionnaireService');

const DEMO_EMAIL = 'demo@demo.com';
const DEMO_ALLOWED_ID = '7ad9e6be-1046-45b9-aa63-95c6ad1947ef';

async function list(req, res) {
  const where =
    req.admin?.email === DEMO_EMAIL
      ? { id: DEMO_ALLOWED_ID }
      : {};

  const questionnaires = await Questionnaire.findAll({
    attributes: ['id', 'title', 'description', 'created_at'],
    where,
    order: [['created_at', 'DESC']]
  });
  res.json(questionnaires);
}

async function create(req, res) {
  if (req.admin?.email === DEMO_EMAIL) {
    return res.status(403).json({ message: 'Demo user cannot create questionnaires' });
  }
  try {
    const created = await questionnaireService.createQuestionnaire(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getOne(req, res) {
  if (req.admin?.email === DEMO_EMAIL && req.params.id !== DEMO_ALLOWED_ID) {
    return res.status(403).json({ message: 'Demo user cannot view this questionnaire' });
  }
  const questionnaire = await Questionnaire.findByPk(req.params.id, {
    include: [{ model: Question, as: 'questions', order: [['order_index', 'ASC']] }]
  });
  if (!questionnaire) return res.status(404).json({ message: 'Not found' });
  res.json(questionnaire);
}

async function update(req, res) {
  if (req.admin?.email === DEMO_EMAIL) {
    return res.status(403).json({ message: 'Demo user cannot modify questionnaires' });
  }
  try {
    const updated = await questionnaireService.updateQuestionnaire(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(err.message === 'Questionnaire not found' ? 404 : 400).json({ message: err.message });
  }
}

async function remove(req, res) {
  if (req.admin?.email === DEMO_EMAIL) {
    return res.status(403).json({ message: 'Demo user cannot delete questionnaires' });
  }
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
