import Joi from 'joi';
import { SignInParams, SignUpParams } from '../services';

// eles são essencialmente idênticos, mas mantive como dois schemas (e params) diferentes para ser mais future proof

export const signUpSchema = Joi.object<SignUpParams>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
