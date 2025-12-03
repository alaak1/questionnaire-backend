const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class QuestionnaireVersion extends Model {}

QuestionnaireVersion.init(
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
    version_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scoring_rules: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    interpretation_rules: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'QuestionnaireVersion',
    tableName: 'questionnaire_versions',
    timestamps: false,
    indexes: [
      { fields: ['questionnaire_id'] },
      { unique: true, fields: ['questionnaire_id', 'version_number'] }
    ]
  }
);

module.exports = QuestionnaireVersion;
