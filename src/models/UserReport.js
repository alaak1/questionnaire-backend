const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class UserReport extends Model {}

UserReport.init(
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
    questionnaire_version_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    scoring_output: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    ai_report_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'UserReport',
    tableName: 'user_reports',
    timestamps: false,
    indexes: [
      { fields: ['session_id'] },
      { fields: ['questionnaire_version_id'] }
    ]
  }
);

module.exports = UserReport;
