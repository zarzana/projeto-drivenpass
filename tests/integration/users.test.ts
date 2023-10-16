import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser } from '../factories';
import { cleanDb } from '../helpers';
import { duplicatedEmailError } from '../../src/errors';
import app, { init } from '../../src/app';
import { prisma } from '../../src/config';

beforeAll(async () => { await init() });
beforeEach(async () => { await cleanDb() });

const server = supertest(app);

describe('POST /users/signup', () => {

    describe('when body is invalid', () => {

        it('should respond with status 400 when body is not given', async () => {
            const response = await server.post('/users/signup');
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 when body is invalid', async () => {
            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
            const response = await server.post('/users/signup').send(invalidBody);
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

    })

    describe('when body is valid', () => {

        const generateValidBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
        });

        it('should respond with status 409 when given email is already in use', async () => {
            const validBody = generateValidBody();
            await createUser(validBody);
            const response = await server.post('/users/signup').send(validBody);
            expect(response.status).toBe(httpStatus.CONFLICT);
            expect(response.body.message).toEqual(duplicatedEmailError().message);
        });

        it('should respond with status 201 and user information when given valid email and password', async () => {
            const validBody = generateValidBody();
            const response = await server.post('/users/signup').send(validBody);
            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body).toEqual({
                id: response.body.id,
                email: validBody.email,
            });
        });

        it('should not return user password on body', async () => {
            const validBody = generateValidBody();
            const response = await server.post('/users/signup').send(validBody);
            expect(response.body).not.toHaveProperty('password');
        });

        it('should save user on database', async () => {
            const validBody = generateValidBody();
            const response = await server.post('/users/signup').send(validBody);
            const user = await prisma.user.findUnique({ where: { email: validBody.email } });
            expect(user).toEqual(
                expect.objectContaining({
                    id: response.body.id,
                    email: validBody.email,
                }),
            );
        });

    });

});

describe('POST /users/signin', () => {

    describe('when body is invalid', () => {

        it('should respond with status 400 when body is not given', async () => {
            const response = await server.post('/users/signup');
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 when body is invalid', async () => {
            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
            const response = await server.post('/users/signup').send(invalidBody);
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

    })

    describe('when body is valid', () => {

        const generateValidBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password({length: 6}),
        });

        describe('when credentials are invalid', () => {

            it('should respond with status 401 if there is no user for given email', async () => {
                const body = generateValidBody();
                const response = await server.post('/users/signin').send(body);
                expect(response.status).toBe(httpStatus.UNAUTHORIZED);
            });

            it('should respond with status 401 if there is a user for given email but the password is incorrect', async () => {
                const body = generateValidBody();
                await createUser(body);
                const response = await server.post('/users/signin').send({
                    ...body,
                    password: faker.lorem.word(),
                });
                expect(response.status).toBe(httpStatus.UNAUTHORIZED);
            });

        });

        describe('when credentials are valid', () => {

            it('should respond with status 200 and user information', async () => {
                const body = generateValidBody();
                await createUser(body);
                const response = await server.post('/users/signin').send(body);
                expect(response.status).toBe(httpStatus.OK);
                expect(response.body).toEqual({
                    user: {
                        id: response.body.user.id,
                        email: body.email,
                    },
                    token: response.body.token,
                });
            });

        });
    });
});
