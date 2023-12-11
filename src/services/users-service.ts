import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { duplicatedEmailError, invalidCredentialsError } from '../errors';
import { sessionsRepository, userRepository } from '../repositories';
import { exclude } from '../utils/prisma-utils';

// signup

export async function createUser({ email, password }: SignUpParams): Promise<User> {
  await validateUniqueEmailOrFail(email);
  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.createUser({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

// signin

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;
  const user = await getUserOrFail(email);
  await validatePasswordOrFail(password, user.password);
  const token = await createSession(user.id);
  return {
    user: exclude(user, 'password'),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();
  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionsRepository.createSession({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

type SignInResult = { user: Pick<User, 'id' | 'email'>; token: string; };
type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

export type SignUpParams = Pick<User, 'email' | 'password'>;
export type SignInParams = Pick<User, 'email' | 'password'>;

export const userService = {
  createUser,
  signIn,
};