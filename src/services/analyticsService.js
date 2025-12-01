const { Questionnaire, Question, UserAnswerSession, Answer, User } = require('../models');

async function getQuestionnaireResults(questionnaireId) {
  const questionnaire = await Questionnaire.findByPk(questionnaireId, {
    include: [{ model: Question, as: 'questions', order: [['order_index', 'ASC']] }]
  });
  if (!questionnaire) {
    throw new Error('Questionnaire not found');
  }

  const sessions = await UserAnswerSession.findAll({
    where: { questionnaire_id: questionnaireId, completed_at: { [require('sequelize').Op.ne]: null } },
    include: [
      { model: User, as: 'user' },
      {
        model: Answer,
        as: 'answers',
        include: [{ model: Question, as: 'question' }]
      }
    ]
  });

  const totalSubmissions = sessions.length;

  const answersByQuestion = {};
  sessions.forEach((session) => {
    session.answers.forEach((ans) => {
      const qid = ans.question_id;
      if (!answersByQuestion[qid]) {
        answersByQuestion[qid] = [];
      }
      answersByQuestion[qid].push(ans);
    });
  });

  const aggregated = questionnaire.questions
    .sort((a, b) => a.order_index - b.order_index)
    .map((q) => {
      const answers = answersByQuestion[q.id] || [];
      const count = answers.length;
      const flagged = answers.filter((a) => a.flagged).length;
      const stats = { count, flagged };

      if (q.type === 'rating') {
        const numbers = answers.map((a) => Number(a.answer_value)).filter((n) => !Number.isNaN(n));
        const sum = numbers.reduce((acc, n) => acc + n, 0);
        stats.average = numbers.length ? sum / numbers.length : 0;
      }

      if (q.type === 'mcq' || q.type === 'checkbox') {
        const optionCounts = {};
        answers.forEach((a) => {
          const val = a.answer_value;
          if (Array.isArray(val)) {
            val.forEach((v) => {
              optionCounts[v] = (optionCounts[v] || 0) + 1;
            });
          } else if (val) {
            optionCounts[val] = (optionCounts[val] || 0) + 1;
          }
        });
        stats.optionCounts = optionCounts;
      }

      return {
        questionId: q.id,
        questionText: q.question_text,
        type: q.type,
        stats
      };
    });

  const lineChartData = questionnaire.questions
    .sort((a, b) => a.order_index - b.order_index)
    .map((q, idx) => ({
      label: `Q${idx + 1}`,
      value: (answersByQuestion[q.id] || []).length
    }));

  const completedUsers = sessions.map((s) => ({
    sessionId: s.id,
    user: s.user ? { id: s.user.id, name: s.user.name, email: s.user.email } : null,
    completed_at: s.completed_at,
    answers: s.answers.map((a) => ({
      questionId: a.question_id,
      questionText: a.question.question_text,
      answerValue: a.answer_value,
      flagged: a.flagged
    }))
  }));

  return {
    questionnaire: { id: questionnaire.id, title: questionnaire.title },
    totalSubmissions,
    aggregated,
    lineChartData,
    completedUsers
  };
}

module.exports = {
  getQuestionnaireResults
};
