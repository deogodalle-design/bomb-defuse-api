'use strict';

const TITLE = 'Web Basics Bomb Squad';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. the parent: the host who owns the set
    const [[host]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001'");

    // 2. the question set
    await queryInterface.bulkInsert('question_sets', [{
      host_id: host.user_id,
      title: TITLE,
      description: 'Short questions on the web, HTTP and databases for the demo game.',
    }]);
    const [[set]] = await db.query('SELECT question_set_id FROM question_sets WHERE title = :t', {
      replacements: { t: TITLE },
    });

    // 3. its questions (correct_index is 0 for A, 1 for B, 2 for C, 3 for D)
    const q = (text, a, b, c, d, correct) => ({
      question_set_id: set.question_set_id,
      question_text: text,
      choice_a: a,
      choice_b: b,
      choice_c: c,
      choice_d: d,
      correct_index: correct,
    });
    await queryInterface.bulkInsert('questions', [
      q('Which HTTP method is normally used to create a new resource?', 'GET', 'POST', 'DELETE', 'HEAD', 1),
      q('Which status code means "Not Found"?', '200', '301', '404', '500', 2),
      q('What does SQL stand for?', 'Structured Query Language', 'Simple Question Logic', 'Server Queue Link', 'Stored Query List', 0),
      q('Which key links a child table to its parent table?', 'Primary key', 'Foreign key', 'Candidate key', 'Sort key', 1),
      q('Which file keeps secrets out of Git when listed in .gitignore?', 'README.md', 'package.json', '.env', 'LICENSE', 2),
    ]);
  },

  async down(queryInterface) {
    // questions go with the set (ON DELETE CASCADE)
    await queryInterface.bulkDelete('question_sets', { title: TITLE }, {});
  },
};