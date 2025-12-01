const { Questionnaire, Question, User, UserAnswerSession, Answer, sequelize } = require('../models');

async function loadQuestionnaire(req, res) {
  const questionnaire = await Questionnaire.findByPk(req.params.id, {
    include: [{ model: Question, as: 'questions', order: [['order_index', 'ASC']] }]
  });
  if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });
  res.json({
    questionnaire: {
      id: questionnaire.id,
      title: questionnaire.title,
      description: questionnaire.description
    },
    questions: questionnaire.questions
  });
}

async function startSession(req, res) {
  const { email, name, age, phone, saveUser } = req.body;
  if (!email || !name) return res.status(400).json({ message: 'Email and name are required' });

  const questionnaire = await Questionnaire.findByPk(req.params.id);
  if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });

  let user = await User.findOne({ where: { email } });
  if (!user) {
    if (!saveUser) return res.status(400).json({ message: 'User not found. Set saveUser=true to create.' });
    user = await User.create({ email, name, age, phone });
  }

  const session = await UserAnswerSession.create({
    user_id: user.id,
    questionnaire_id: questionnaire.id,
    started_at: new Date()
  });

  res.status(201).json({ sessionId: session.id, user });
}

async function submitAnswers(req, res) {
  const { sessionId, answers } = req.body;
  if (!sessionId || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'sessionId and answers array are required' });
  }

  const session = await UserAnswerSession.findByPk(sessionId);
  if (!session || session.questionnaire_id !== req.params.id) {
    return res.status(404).json({ message: 'Session not found for questionnaire' });
  }

  await sequelize.transaction(async (t) => {
    await Answer.destroy({ where: { session_id: sessionId }, transaction: t });

    const answerRecords = answers.map((a) => ({
      session_id: sessionId,
      question_id: a.questionId,
      answer_value: a.answerValue,
      flagged: !!a.flagged
    }));
    if (answerRecords.length) {
      await Answer.bulkCreate(answerRecords, { transaction: t });
    }
    session.completed_at = new Date();
    await session.save({ transaction: t });
  });

  res.json({ message: 'Submitted' });
}

module.exports = {
  loadQuestionnaire,
  startSession,
  submitAnswers
};
