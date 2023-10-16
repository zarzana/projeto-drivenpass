import { Router } from 'express';

import { signUpSchema, signInSchema } from '../schemas';
import { validateBody } from '../middlewares';
import { signUpPost, singInPost } from '../controllers';

const usersRouter = Router();

usersRouter
    .post('/signup', validateBody(signUpSchema), signUpPost)
    .post('/signin', validateBody(signInSchema), singInPost);

export { usersRouter };