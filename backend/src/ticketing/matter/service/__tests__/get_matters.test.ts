import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import pool from '../../../../db/pool';
import { MatterService } from '../matter_service';

/**
 * Due to the testing data being seeded randomly, I'm using simplified
 * queries to test `getMatters`
 * Another strategy would be to create deterministic fixtures for these tests
 * so `getMatters` can be tested without writing more queries that could have bugs
 */

let client;
let matterService;

beforeAll(async () => {
  client = await pool.connect();
  matterService = new MatterService();
});

afterAll(async () => {
  client.release();
  await pool.end();
});

describe('getMatters', () => {
  it('default params', async () => {
    const matters = await matterService.getMatters({});
    const expectedMatters = await client.query(`
        SELECT
            mt.id,
            mt.board_id,
            mt.created_at,
            mt.updated_at
        FROM mv_tickets mt
        ORDER BY mt.created_at DESC
        LIMIT 25 OFFSET 0
    `);

    expect(matters.total).toBe(10000);
    expect(matters.data.length).toBe(25);

    for (let i = 0; i < matters.data.length; i++) {
      expect(matters.data[i].id).toBe(expectedMatters.rows[i].id);
    }
  });

  it('case number sort', async () => {
    const matters = await matterService.getMatters({ sortBy: 'case_number', sortOrder: 'asc' });
    const expectedMatters = await client.query(`
        SELECT
            mt.id,
            mt.board_id,
            mt.created_at,
            mt.updated_at
        FROM mv_tickets mt
        ORDER BY mt.case_number ASC
        LIMIT 25 OFFSET 0
    `);

    expect(matters.total).toBe(10000);
    expect(matters.data.length).toBe(25);

    for (let i = 0; i < matters.data.length; i++) {
      expect(matters.data[i].id).toBe(expectedMatters.rows[i].id);
    }
  });

  it('status sort', async () => {
    const matters = await matterService.getMatters({ sortBy: 'status', sortOrder: 'desc' });
    const expectedMatters = await client.query(`
        SELECT
            mt.id,
            mt.board_id,
            mt.created_at,
            mt.updated_at
        FROM mv_tickets mt
        LEFT JOIN ticketing_field_status_options tfso ON tfso.id = mt.status_id
        ORDER BY tfso.sequence DESC
        LIMIT 25 OFFSET 0
    `);

    expect(matters.total).toBe(10000);
    expect(matters.data.length).toBe(25);

    for (let i = 0; i < matters.data.length; i++) {
      expect(matters.data[i].id).toBe(expectedMatters.rows[i].id);
    }
  });
});
