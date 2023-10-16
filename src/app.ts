import 'express-async-errors';
import express, { Express } from 'express';
import { handleApplicationErrors } from './middlewares';
import { usersRouter, credentialsRouter } from './routers';
import { loadEnv, connectDb, disconnectDB } from './config';

loadEnv();

const app = express();
app
    .use(express.json())
    .use('/users', usersRouter)
    .use('/credentials', credentialsRouter)
    .use(handleApplicationErrors);

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
}

export async function close(): Promise<void> {
    await disconnectDB();
}

export default app;