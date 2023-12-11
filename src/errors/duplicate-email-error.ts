import { ApplicationError } from '../protocols';

export function duplicatedEmailError(): ApplicationError {
  return {
    name: 'DuplicatedEmailError',
    message: 'A user with this email already exists.',
  };
}