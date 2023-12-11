import { Prisma } from '@prisma/client';
import { prisma } from '../config';
import { credentialNotFoundError } from '../errors';

async function findByNameAndUser(title: string, userId: number) {
    const params: Prisma.CredentialFindFirstArgs = { where: { title, userId } };
    return prisma.credential.findFirst(params);
}

async function createCredential(data: Prisma.CredentialUncheckedCreateInput) {
    return prisma.credential.create({ data });
}

async function findAllUserCredentials(userId: number) {
    return prisma.credential.findMany({
        where: { userId },
        select: { title: true, url: true, username: true, password: true },
    });
}

async function findCredential(credentialId: number, userId: number) {
    return prisma.credential.findUnique({
        where: { id: credentialId, userId },
        select: { title: true, url: true, username: true, password: true },
    });
}

async function deleteCredential(credentialId: number, userId: number) {
    const credential = await findCredential(credentialId, userId);
    if (!credential) { throw credentialNotFoundError() }
    else { return prisma.credential.delete({ where: { id: credentialId, userId } }) }
}

export const credentialRepository = {
    findByNameAndUser,
    createCredential,
    findAllUserCredentials,
    findCredential,
    deleteCredential,
};