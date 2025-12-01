const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class UserAnswerSession extends Model {}

UserAnswerSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    questionnaire_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'UserAnswerSession',
    tableName: 'user_answer_sessions',
    timestamps: false,
    indexes: [
      { fields: ['questionnaire_id'] },
      { fields: ['user_id'] },
      { fields: ['completed_at'] }
    ]
  }
);

module.exports = UserAnswerSession;
