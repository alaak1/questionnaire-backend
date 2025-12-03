const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Questionnaire extends Model {}

Questionnaire.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    admin_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    version_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_legacy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Questionnaire',
    tableName: 'questionnaires',
    timestamps: false,
    indexes: [
      { fields: ['created_at'] },
      { fields: ['admin_id'] },
      { fields: ['is_legacy'] }
    ]
  }
);

module.exports = Questionnaire;
