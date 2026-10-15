'use strict';

const FINISHED_CODE = '482913';
const LOBBY_CODE = '730194';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. find the parents that earlier seeders created
    const [[host]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001'");
    const [[set]] = await db.query(
      "SELECT question_set_id FROM question_sets WHERE title = 'Web Basics Bomb Squad'");

    // 2. one game that has ENDED, and one still in the lobby (it must NOT appear in /results)
    await queryInterface.bulkInsert('game_sessions', [
      {
        host_id: host.user_id, question_set_id: set.question_set_id, join_code: FINISHED_CODE,
        status: 'CLOSED', time_limit: 300,
        started_at: new Date('2026-10-12T01:00:00Z'), ended_at: new Date('2026-10-12T01:05:00Z'),
      },
      {
        host_id: host.user_id, question_set_id: set.question_set_id, join_code: LOBBY_CODE,
        status: 'WAITING', time_limit: 300, started_at: null, ended_at: null,
      },
    ]);
    const [[game]] = await db.query('SELECT session_id FROM game_sessions WHERE join_code = :c', {
      replacements: { c: FINISHED_CODE },
    });

    // 3. the seats of the finished game
    // completed (my rule): defuse_progress = 5, all five wires cut
    // Rina and Dale tie on 1500 (rank 1, 1); Pao is next; Lia exploded the bomb (3 failed cuts)
    const seat = async (schoolId, nickname, score, progress, joinedAt) => {
      const [[u]] = await db.query('SELECT user_id FROM users WHERE school_id = :s', {
        replacements: { s: schoolId },
      });
      return {
        session_id: game.session_id, user_id: u.user_id, nickname, score,
        defuse_progress: progress, joined_at: new Date(joinedAt),
      };
    };
    await queryInterface.bulkInsert('players', [
      await seat('2099-1001', 'Rina', 1500, 5, '2026-10-12T00:58:10Z'),
      await seat('2099-1002', 'Dale', 1500, 5, '2026-10-12T00:58:20Z'),
      await seat('2099-1003', 'Pao', 1400, 5, '2026-10-12T00:58:35Z'),
      await seat('2099-1004', 'Lia', 400, 2, '2026-10-12T00:59:00Z'),
    ]);

    // 4. a few answers, so the answers table has rows
    const [questions] = await db.query(
      'SELECT question_id, correct_index FROM questions WHERE question_set_id = :s ORDER BY question_id',
      { replacements: { s: set.question_set_id } });
    const playerId = async (nickname) => {
      const [[p]] = await db.query(
        'SELECT player_id FROM players WHERE session_id = :s AND nickname = :n',
        { replacements: { s: game.session_id, n: nickname } });
      return p.player_id;
    };
    const rina = await playerId('Rina');
    const lia = await playerId('Lia');
    const answer = (playerIdValue, question, choiceIndex) => {
      const correct = choiceIndex === question.correct_index;
      return {
        player_id: playerIdValue, question_id: question.question_id,
        choice_index: choiceIndex, correct, points: correct ? 100 : 0,
      };
    };
    await queryInterface.bulkInsert('answers', [
      answer(rina, questions[0], questions[0].correct_index),
      answer(rina, questions[1], questions[1].correct_index),
      answer(rina, questions[2], questions[2].correct_index),
      answer(lia, questions[0], questions[0].correct_index),
      answer(lia, questions[1], (questions[1].correct_index + 1) % 4), // wrong
      answer(lia, questions[2], (questions[2].correct_index + 1) % 4), // wrong
    ]);
  },

  async down(queryInterface, Sequelize) {
    // seats and answers go with their game (ON DELETE CASCADE)
    await queryInterface.bulkDelete(
      'game_sessions', { join_code: { [Sequelize.Op.in]: [FINISHED_CODE, LOBBY_CODE] } }, {});
  },
};