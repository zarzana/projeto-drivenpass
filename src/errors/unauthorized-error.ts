import { ApplicationError } from '@/protocols';

export function unauthorizedError(): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: 'You must be signed in to access this route.',
  };
}
