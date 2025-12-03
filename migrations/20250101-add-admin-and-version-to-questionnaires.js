module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('questionnaires', 'admin_id', {
      type: Sequelize.UUID,
      allowNull: true
    });
    await queryInterface.addColumn('questionnaires', 'version_number', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('questionnaires', 'version_number');
    await queryInterface.removeColumn('questionnaires', 'admin_id');
  }
};
