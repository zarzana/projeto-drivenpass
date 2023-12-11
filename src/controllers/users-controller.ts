import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService, SignInParams } from '../services';

export async function signUpPost(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await userService.createUser({ email, password });
  return res.status(httpStatus.CREATED).json({
    id: user.id,
    email: user.email,
  });
}

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;
  const result = await userService.signIn({ email, password });
  return res.status(httpStatus.OK).send(result);
}
