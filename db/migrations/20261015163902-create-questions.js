'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'question_set_id',
        },
        onDelete: 'CASCADE',
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      choice_a: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      choice_b: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      choice_c: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      choice_d: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      correct_index: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      question_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'tool',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('questions');
  },
};

