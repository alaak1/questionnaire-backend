const { Questionnaire, Question } = require('../models');
const { Op } = require('sequelize');
const questionnaireService = require('../services/questionnaireService');

const DEMO_EMAIL = 'demo@demo.com';
const DEMO_ALLOWED_ID = '7ad9e6be-1046-45b9-aa63-95c6ad1947ef';

function canAccessQuestionnaire(questionnaire, admin) {
  if (!questionnaire) return false;
  const isLegacy = questionnaire.is_legacy || questionnaire.admin_id === null;
  if (isLegacy) return true;
  return questionnaire.admin_id === admin?.id;
}

let attemptedSync = false;

async function list(req, res) {
  const where = {
    [Op.or]: [{ is_legacy: true }, { admin_id: null }, { admin_id: req.admin?.id }]
  };
  if (req.admin?.email === DEMO_EMAIL) {
    where.id = DEMO_ALLOWED_ID;
  }

  try {
    const questionnaires = await Questionnaire.findAll({
      attributes: ['id', 'title', 'description', 'created_at', 'admin_id', 'is_legacy', 'version_number'],
      where,
      order: [['created_at', 'DESC']]
    });
    return res.json(questionnaires);
  } catch (err) {
    // If schema is missing new columns (admin_id/is_legacy/version_number), attempt to sync once.
    const missingColumn =
      err?.original?.code === 'ER_BAD_FIELD_ERROR' || err?.original?.code === 'ER_NO_SUCH_FIELD';
    if (!attemptedSync && missingColumn) {
      attemptedSync = true;
      try {
        await require('../models').sequelize.sync({ alter: true });
        const questionnaires = await Questionnaire.findAll({
          attributes: ['id', 'title', 'description', 'created_at', 'admin_id', 'is_legacy', 'version_number'],
          where,
          order: [['created_at', 'DESC']]
        });
        return res.json(questionnaires);
      } catch (syncErr) {
        return res.status(500).json({ message: 'Schema sync failed', error: syncErr.message });
      }
    }
    return res.status(500).json({ message: 'Failed to load questionnaires', error: err.message });
  }
}

async function create(req, res) {
  if (req.admin?.email === DEMO_EMAIL) {
    return res.status(403).json({ message: 'Demo user cannot create questionnaires' });
  }
  try {
    const created = await questionnaireService.createQuestionnaire(req.body, req.admin);
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
  if (!canAccessQuestionnaire(questionnaire, req.admin)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(questionnaire);
}

async function update(req, res) {
  if (req.admin?.email === DEMO_EMAIL) {
    return res.status(403).json({ message: 'Demo user cannot modify questionnaires' });
  }
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Not found' });
    }
    if (!canAccessQuestionnaire(questionnaire, req.admin)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
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
  const questionnaire = await Questionnaire.findByPk(req.params.id);
  if (!questionnaire) {
    return res.status(404).json({ message: 'Not found' });
  }
  if (!canAccessQuestionnaire(questionnaire, req.admin)) {
    return res.status(403).json({ message: 'Forbidden' });
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
