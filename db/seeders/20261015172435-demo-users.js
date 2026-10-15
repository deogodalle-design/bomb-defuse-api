'use strict';

// Fictitious accounts only: school IDs start with 2099, emails end in .test
const SCHOOL_IDS = ['2099-0001', '2099-1001', '2099-1002', '2099-1003', '2099-1004', '2099-1005'];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0001', email: 'host.reyes@bombdefuse.test', display_name: 'Demo Host Reyes', role: 'HOST', created_at: now },
      { school_id: '2099-1001', email: 'rina@bombdefuse.test', display_name: 'Rina', role: 'PLAYER', created_at: now },
      { school_id: '2099-1002', email: 'dale@bombdefuse.test', display_name: 'Dale', role: 'PLAYER', created_at: now },
      { school_id: '2099-1003', email: 'pao@bombdefuse.test', display_name: 'Pao', role: 'PLAYER', created_at: now },
      { school_id: '2099-1004', email: 'lia@bombdefuse.test', display_name: 'Lia', role: 'PLAYER', created_at: now },
      // awkward case: an account that never joins any game
      { school_id: '2099-1005', email: 'mico@bombdefuse.test', display_name: 'Mico', role: 'PLAYER', created_at: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { school_id: { [Sequelize.Op.in]: SCHOOL_IDS } }, {});
  },
};