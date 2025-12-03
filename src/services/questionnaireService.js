const { Questionnaire, Question, QuestionnaireVersion, sequelize } = require('../models');

async function createQuestionnaire(payload, admin) {
  return sequelize.transaction(async (t) => {
    const { title, description, questions = [] } = payload;
    const questionnaire = await Questionnaire.create(
      {
        title,
        description,
        admin_id: admin?.id || null,
        is_legacy: false,
        version_number: 1
      },
      { transaction: t }
    );

    await QuestionnaireVersion.create(
      {
        questionnaire_id: questionnaire.id,
        version_number: questionnaire.version_number
      },
      { transaction: t }
    );

    const questionRecords = questions.map((q, idx) => ({
      questionnaire_id: questionnaire.id,
      question_text: q.question_text,
      type: q.type,
      options: q.options || null,
      order_index: q.order_index ?? idx
    }));
    if (questionRecords.length) {
      await Question.bulkCreate(questionRecords, { transaction: t });
    }
    const created = await Questionnaire.findByPk(questionnaire.id, {
      include: [{ model: Question, as: 'questions', order: [['order_index', 'ASC']] }],
      transaction: t
    });
    return created;
  });
}

async function updateQuestionnaire(id, payload) {
  return sequelize.transaction(async (t) => {
    const { title, description, questions = [] } = payload;
    const questionnaire = await Questionnaire.findByPk(id, { transaction: t });
    if (!questionnaire) {
      throw new Error('Questionnaire not found');
    }

    questionnaire.title = title ?? questionnaire.title;
    questionnaire.description = description ?? questionnaire.description;
    await questionnaire.save({ transaction: t });

    await Question.destroy({ where: { questionnaire_id: id }, transaction: t });

    const questionRecords = questions.map((q, idx) => ({
      questionnaire_id: id,
      question_text: q.question_text,
      type: q.type,
      options: q.options || null,
      order_index: q.order_index ?? idx
    }));
    if (questionRecords.length) {
      await Question.bulkCreate(questionRecords, { transaction: t });
    }

    const updated = await Questionnaire.findByPk(id, {
      include: [{ model: Question, as: 'questions', order: [['order_index', 'ASC']] }],
      transaction: t
    });
    return updated;
  });
}

module.exports = {
  createQuestionnaire,
  updateQuestionnaire
};
