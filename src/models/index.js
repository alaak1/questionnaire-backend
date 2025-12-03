const sequelize = require('../config/database');
const Admin = require('./Admin');
const User = require('./User');
const Questionnaire = require('./Questionnaire');
const Question = require('./Question');
const UserAnswerSession = require('./UserAnswerSession');
const Answer = require('./Answer');
const QuestionnaireVersion = require('./QuestionnaireVersion');
const UserReport = require('./UserReport');

Admin.hasMany(Questionnaire, {
  foreignKey: 'admin_id',
  as: 'questionnaires'
});
Questionnaire.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });
Questionnaire.hasMany(Question, {
  foreignKey: 'questionnaire_id',
  as: 'questions',
  onDelete: 'CASCADE'
});
Question.belongsTo(Questionnaire, { foreignKey: 'questionnaire_id', as: 'questionnaire' });

User.hasMany(UserAnswerSession, {
  foreignKey: 'user_id',
  as: 'sessions',
  onDelete: 'CASCADE'
});
UserAnswerSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Questionnaire.hasMany(UserAnswerSession, {
  foreignKey: 'questionnaire_id',
  as: 'sessions',
  onDelete: 'CASCADE'
});
UserAnswerSession.belongsTo(Questionnaire, { foreignKey: 'questionnaire_id', as: 'questionnaire' });
Admin.hasMany(UserAnswerSession, { foreignKey: 'admin_id', as: 'sessions' });
UserAnswerSession.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });

Question.hasMany(Answer, {
  foreignKey: 'question_id',
  as: 'answers',
  onDelete: 'CASCADE'
});
Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

UserAnswerSession.hasMany(Answer, {
  foreignKey: 'session_id',
  as: 'answers',
  onDelete: 'CASCADE'
});
Answer.belongsTo(UserAnswerSession, { foreignKey: 'session_id', as: 'session' });

Questionnaire.hasMany(QuestionnaireVersion, {
  foreignKey: 'questionnaire_id',
  as: 'versions',
  onDelete: 'CASCADE'
});
QuestionnaireVersion.belongsTo(Questionnaire, { foreignKey: 'questionnaire_id', as: 'questionnaire' });

QuestionnaireVersion.hasMany(UserReport, {
  foreignKey: 'questionnaire_version_id',
  as: 'reports',
  onDelete: 'CASCADE'
});
UserReport.belongsTo(QuestionnaireVersion, {
  foreignKey: 'questionnaire_version_id',
  as: 'questionnaireVersion'
});
UserAnswerSession.hasOne(UserReport, { foreignKey: 'session_id', as: 'report', onDelete: 'CASCADE' });
UserReport.belongsTo(UserAnswerSession, { foreignKey: 'session_id', as: 'session' });

module.exports = {
  sequelize,
  Admin,
  User,
  Questionnaire,
  Question,
  UserAnswerSession,
  Answer,
  QuestionnaireVersion,
  UserReport
};
