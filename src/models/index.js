const sequelize = require('../config/database');
const Admin = require('./Admin');
const User = require('./User');
const Questionnaire = require('./Questionnaire');
const Question = require('./Question');
const UserAnswerSession = require('./UserAnswerSession');
const Answer = require('./Answer');

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

module.exports = {
  sequelize,
  Admin,
  User,
  Questionnaire,
  Question,
  UserAnswerSession,
  Answer
};
