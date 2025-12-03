const {
  Questionnaire,
  Question,
  User,
  UserAnswerSession,
  Answer,
  QuestionnaireVersion,
  UserReport,
  sequelize
} = require('../models');
const { scoringEngine } = require('../services/scoringEngine');
const { aiReportService } = require('../services/aiReportService');

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

  const sessionAdminId = questionnaire.is_legacy ? null : questionnaire.admin_id;
  const session = await UserAnswerSession.create({
    user_id: user.id,
    questionnaire_id: questionnaire.id,
    admin_id: sessionAdminId,
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
  const questionnaire = await Questionnaire.findByPk(req.params.id);
  if (!questionnaire) {
    return res.status(404).json({ message: 'Questionnaire not found' });
  }
  const user = await User.findByPk(session.user_id);

  let reportId = null;
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
    session.admin_id = questionnaire.is_legacy ? null : questionnaire.admin_id;
    session.completed_at = new Date();
    await session.save({ transaction: t });

    const questionnaireVersion =
      (await QuestionnaireVersion.findOne({
        where: {
          questionnaire_id: questionnaire.id,
          version_number: questionnaire.version_number || 1
        },
        transaction: t
      })) ||
      (await QuestionnaireVersion.create(
        {
          questionnaire_id: questionnaire.id,
          version_number: questionnaire.version_number || 1
        },
        { transaction: t }
      ));

    const scoringOutput = scoringEngine.computeScores(answerRecords, questionnaireVersion);
    const aiReportText = await aiReportService.generateReport(
      scoringOutput,
      user ? { id: user.id, email: user.email, name: user.name } : null,
      questionnaireVersion
    );

    const existingReport = await UserReport.findOne({ where: { session_id: session.id }, transaction: t });
    let report = existingReport;
    if (existingReport) {
      existingReport.scoring_output = scoringOutput;
      existingReport.ai_report_text = aiReportText;
      report = await existingReport.save({ transaction: t });
    } else {
      report = await UserReport.create(
        {
          session_id: session.id,
          questionnaire_version_id: questionnaireVersion.id,
          scoring_output: scoringOutput,
          ai_report_text: aiReportText
        },
        { transaction: t }
      );
    }
    reportId = report.id;
  });

  res.json({ message: 'Submission received', reportStatus: 'pending_ai', sessionId, reportId });
}

module.exports = {
  loadQuestionnaire,
  startSession,
  submitAnswers
};
