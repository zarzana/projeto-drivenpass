import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createSession, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { duplicatedCredentialNameError, duplicatedEmailError } from '../../src/errors';
import app, { init } from '../../src/app';
import { prisma } from '../../src/config';
import * as jwt from 'jsonwebtoken';

beforeAll(async () => { await init() });
beforeEach(async () => { await cleanDb() });

const server = supertest(app);

describe('POST /credentials', () => {

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/credentials');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });


    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when body is invalid', () => {

        it('should respond with status 400 when body is not given', async () => {
            const token = await generateValidToken();
            const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 when body is invalid', async () => {
            const token = await generateValidToken();
            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
            const response = await server.post('/credentials').send(invalidBody).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

    })

    describe('when body is valid', () => {

        const generateValidBody = () => ({
            title: faker.lorem.words({ min: 1, max: 3 }),
            url: faker.internet.url(),
            username: faker.lorem.word(),
            password: faker.internet.password({ length: 6 }),
        });

        it('should respond with status 409 when given title is already in use by the user', async () => {
            const validBody = generateValidBody();
            const user = await createUser();
            const token = await generateValidToken(user);
            await server.post('/credentials').set('Authorization', `Bearer ${token}`).send(validBody); // send the valid body once
            const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`).send(validBody); // send the valid body twice
            expect(response.status).toBe(httpStatus.CONFLICT);
            expect(response.body.message).toEqual(duplicatedCredentialNameError().message);
        });

        it('should respond with status 201 when given valid information', async () => {
            const validBody = generateValidBody();
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await server.post('/credentials').set('Authorization', `Bearer ${token}`).send(validBody);
            expect(response.status).toBe(httpStatus.CREATED);
        });

    });

});

describe('GET /credentials', () => {

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/credentials');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        const generateValidBody = () => ({
            title: faker.lorem.words({ min: 1, max: 3 }),
            url: faker.internet.url(),
            username: faker.lorem.word(),
            password: faker.internet.password({ length: 6 }),
        });

        it('should respond with status 200 and list of credentials', async () => {
            const validBody = generateValidBody();
            const user = await createUser();
            const token = await generateValidToken(user);
            await server.post('/credentials').set('Authorization', `Bearer ${token}`).send(validBody);
            const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toStrictEqual([validBody]);
        });

    });

});

describe('DELETE /credentials/:id', () => {

    it('should respond with status 401 if no token is given', async () => {
        const response = await server.delete('/credentials');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.delete('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const response = await server.delete('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 404 when attempting to delete a non existent credential', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await server.delete('/credentials/999').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

    });

});

describe('GET /credentials/:id', () => {

    describe('when token is valid', () => {

        it('should respond with status 404 when attempting to get a non existent credential', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await server.get('/credentials/999').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

    });

});