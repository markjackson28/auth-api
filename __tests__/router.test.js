'use strict';

process.env.SECRET = "secret";

const supertest = require('supertest');
const server = require('../src/server').server;
const { db } = require('../src/auth/models/index');

const mockRequest = supertest(server);

let clothe = {
  name: "Pant",
  color: "Blue",
  size: "Large"
}

beforeAll(async (done) => {
  await db.sync();
  done();
});
afterAll(async (done) => {
  await db.drop();
  done();
});


describe('Auth Router', () => {

  it('should respond with 200', async () => {
    const response = await mockRequest.get('/api/v1/clothes').send(clothe);
    expect(response.status).toBe(200);
  });

  it('should respond with', async () => {
    const response = await mockRequest.get('/api/v1/clothes').send(clothe);
    console.log(response.body)
  })

});
