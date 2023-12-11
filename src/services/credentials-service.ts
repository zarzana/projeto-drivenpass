import Cryptr from "cryptr";
import { Credential } from "@prisma/client";
import { credentialNotFoundError, duplicatedCredentialNameError } from '../errors';
import { credentialRepository } from '../repositories';

export async function createCredential(credentialInfo: CredentialParams, userId: number): Promise<void> {
    const { title, url, username, password } = credentialInfo;
    await validateUniqueNameOrFail(title, userId);
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const encryptedPassword = cryptr.encrypt(password);
    credentialRepository.createCredential({
        title,
        url,
        username,
        password: encryptedPassword,
        userId,
    });
};

async function validateUniqueNameOrFail(title: string, userId: number) {
    const credentialWithSameNameFromUser = await credentialRepository.findByNameAndUser(title, userId);
    if (credentialWithSameNameFromUser) {
        throw duplicatedCredentialNameError();
    }
};

async function findAllUserCredentials(userId: number) {
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const credentialArray = await credentialRepository.findAllUserCredentials(userId);
    for (let i = 0; i < credentialArray.length; i++) {
        credentialArray[i].password = cryptr.decrypt(credentialArray[i].password);
    };
    return credentialArray;
};

async function findCredential(credentialId: number, userId: number) {
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const credential = await credentialRepository.findCredential(credentialId, userId);
    if (!credential) throw credentialNotFoundError();
    credential.password = cryptr.decrypt(credential.password);
    return credential;
};

async function deleteCredential(credentialId: number, userId: number) {
    await credentialRepository.deleteCredential(credentialId, userId);
};

export type CredentialParams = Omit<Credential, 'id' | 'userId'>;

export const credentialService = {
    createCredential,
    findAllUserCredentials,
    findCredential,
    deleteCredential,
};