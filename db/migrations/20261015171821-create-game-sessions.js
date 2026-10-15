'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      session_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      host_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'RESTRICT', // keep game records
      },
      question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'question_set_id' },
        onDelete: 'RESTRICT',
      },
      join_code: { type: Sequelize.STRING(6), allowNull: false, unique: true },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'WAITING' },
      time_limit: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 300 }, // seconds
      started_at: { type: Sequelize.DATE, allowNull: true },
      ended_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'ck_game_sessions_status_valid',
      fields: ['status'],
      where: { status: { [Sequelize.Op.in]: ['WAITING', 'RUNNING', 'CLOSED'] } },
    });
    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'ck_game_sessions_time_limit_positive',
      fields: ['time_limit'],
      where: { time_limit: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_sessions');
  },
};