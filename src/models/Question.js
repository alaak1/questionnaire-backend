const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Question extends Model {}

Question.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    questionnaire_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('text', 'mcq', 'checkbox', 'rating'),
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Question',
    tableName: 'questions',
    timestamps: false,
    indexes: [{ fields: ['questionnaire_id'] }]
  }
);

module.exports = Question;
