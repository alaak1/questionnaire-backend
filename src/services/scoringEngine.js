// Placeholder scoring engine for future AI scoring support
const scoringEngine = {
  computeScores: (answers, questionnaireVersion) => {
    return {
      status: 'pending_manual',
      rawAnswers: answers,
      domains: {},
      questionnaireVersion: questionnaireVersion
        ? { id: questionnaireVersion.id, version_number: questionnaireVersion.version_number }
        : null
    };
  }
};

module.exports = { scoringEngine };
