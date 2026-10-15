'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('users', 'display_name', 'full_name');
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('users', 'full_name', 'display_name');
  },
};