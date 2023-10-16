import { Router } from 'express';

import { credentialSchema } from '../schemas';
import { authenticateToken, validateBody } from '../middlewares';
import { credentialPost, credentialGet, credentialGetById, credentialDelete } from '../controllers';

const credentialsRouter = Router();

credentialsRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(credentialSchema), credentialPost)
    .get('/', credentialGet)
    .get('/:id', credentialGetById)
    .delete('/:id', credentialDelete);

export { credentialsRouter };