
// import { Sequelize } from "sequelize";
import { describe, expect, test } from 'vitest'
import axios from 'axios'
import { app } from '../app.js';

app.listen(process.env.PORT, () => { console.log(`Server is now listening on port ${process.env.PORT}`) })

const BASE_URL = `http://localhost:${process.env.PORT}/api/v1`;
// const BASE_URL = 'http://localhost:8000/api/v1';

var email = 'test1@test.com';
var name = 'test';
var password = 'Test@12345';
var device_info = 'iPhone 14 Pro Max';
var token: string;
var sessionId: number;

describe('RegisterUser', () => {
  test('should create a new user', async () => {
    const newUserPayload = {
      email: email,
      name: name,
      password: password,
      device_info: device_info,
    };
    const newUser = await axios.post(`${BASE_URL}/users`, newUserPayload);
    token = newUser.data.data.sessionResponse.token;
    expect(newUser.data.data.sessionResponse.device_info).toStrictEqual(newUserPayload.device_info);
  });
});

describe('LoginUser', () => {
  test('should login user', async () => {
    const loginCredentialsPayload = {
      email: email,
      password: password,
      device_info: device_info,
    };
    const loggedInUser = await axios.post(`${BASE_URL}/users/login`, loginCredentialsPayload);
    // console.log("loggedInUser", loggedInUser);
    token = loggedInUser.data.data.sessionResponse.token;
    expect(loggedInUser.data.data.sessionResponse.device_info).toStrictEqual(loginCredentialsPayload.device_info);
  })
})

describe("Get All User's Sessions", () => {
  test('should return all sessions', async () => {
    const allSessions = await axios.get(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
    sessionId = allSessions.data.data.sessionsList[0].id;
    expect(allSessions.data.data.sessionsList.length).toBeGreaterThan(0);
  })
})

describe("Logout a specific session", () => {
  test("should logout a session with specified id", async () => {
    const loggedOutSession = await axios.delete(`${BASE_URL}/users/${sessionId}`, { headers: { Authorization: `Bearer ${token}` } });
    expect(Number(loggedOutSession.data.data.deletedID)).toStrictEqual(sessionId);
  })
});

describe("Logout User Itself", () => {
  test("should log out user itself", async () => {
    const loggedOutUser = await axios.delete(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
    // console.log("logged out user", loggedOutUser);
    expect(loggedOutUser.status).toStrictEqual(200);
  })
})

describe("Clear all records from Database", () => {
  test("should clear all database fields", async () => {
    const deletedDatabase = await axios.delete(`${BASE_URL}/test`);
    expect(deletedDatabase.status).toStrictEqual(200);
  })
});
