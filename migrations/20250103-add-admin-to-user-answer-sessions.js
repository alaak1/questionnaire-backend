module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_answer_sessions', 'admin_id', {
      type: Sequelize.UUID,
      allowNull: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_answer_sessions', 'admin_id');
  }
};
