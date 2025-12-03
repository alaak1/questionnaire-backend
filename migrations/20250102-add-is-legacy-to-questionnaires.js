module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('questionnaires', 'is_legacy', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
    await queryInterface.sequelize.query('UPDATE questionnaires SET is_legacy = 1, admin_id = NULL WHERE is_legacy = 0');
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('questionnaires', 'is_legacy');
  }
};
