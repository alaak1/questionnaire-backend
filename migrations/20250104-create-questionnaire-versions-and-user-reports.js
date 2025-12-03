module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('questionnaire_versions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      questionnaire_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      version_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      scoring_rules: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      interpretation_rules: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addIndex('questionnaire_versions', ['questionnaire_id']);
    await queryInterface.addConstraint('questionnaire_versions', {
      fields: ['questionnaire_id', 'version_number'],
      type: 'unique',
      name: 'uq_questionnaire_versions_questionnaire_version'
    });

    await queryInterface.createTable('user_reports', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      session_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      questionnaire_version_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      scoring_output: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      ai_report_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addIndex('user_reports', ['session_id']);
    await queryInterface.addIndex('user_reports', ['questionnaire_version_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user_reports');
    await queryInterface.dropTable('questionnaire_versions');
  }
};
