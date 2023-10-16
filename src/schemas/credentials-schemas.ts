import Joi from 'joi';
import { CredentialParams } from '../services';

export const credentialSchema = Joi.object<CredentialParams>({
    title: Joi.string().required(),
    url: Joi.string().uri().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
});
