'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'question_set_id' },
        onDelete: 'CASCADE', // a question means nothing without its set
      },
      question_text: { type: Sequelize.TEXT, allowNull: false },
      choice_a: { type: Sequelize.STRING(255), allowNull: false },
      choice_b: { type: Sequelize.STRING(255), allowNull: false },
      choice_c: { type: Sequelize.STRING(255), allowNull: false },
      choice_d: { type: Sequelize.STRING(255), allowNull: false },
      correct_index: { type: Sequelize.SMALLINT, allowNull: false },
    });
    await queryInterface.addConstraint('questions', {
      type: 'check',
      name: 'ck_questions_correct_index_range',
      fields: ['correct_index'],
      where: { correct_index: { [Sequelize.Op.between]: [0, 3] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};