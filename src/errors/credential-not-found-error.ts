import { ApplicationError } from '../protocols';

export function credentialNotFoundError(): ApplicationError {
  return {
    name: 'CredentialNotFoundError',
    message: 'Request credential either does not exist or you do not have access to it.',
  };
}
