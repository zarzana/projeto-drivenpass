import { ApplicationError } from '../protocols';

export function duplicatedCredentialNameError(): ApplicationError {
  return {
    name: 'DuplicatedCredentialNameError',
    message: 'You already have a credential with that name.',
  };
};