'use strict';

require('dotenv').config({ path: `${__dirname}/test.env` });

const request = require('supertest');

jest.mock('../src/config');

const {
  API: { KEY },
} = require('../src/config');

describe('User Resource', () => {
  let database = null;
  let server = null;

  let agent = null;

  beforeAll.skip(async () => {
    database = require('./helpers/database');
    await database.start();
    server = require('../src/server');
    const app = await server.start();
    agent = request.agent(app);
    agent.set({ 'x-api-key': KEY });
  });

  afterAll(async () => {
    await server.stop();
    await database.stop();
  });

  describe('List Operation - GET /users', () => {
    test('should return emptry array', async () => {
      const res = await agent.get('/users');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });
});
