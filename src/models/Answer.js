const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Answer extends Model {}

Answer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    answer_value: {
      type: DataTypes.JSON,
      allowNull: true
    },
    flagged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Answer',
    tableName: 'answers',
    timestamps: false,
    indexes: [
      { fields: ['session_id'] },
      { fields: ['question_id'] }
    ]
  }
);

module.exports = Answer;
