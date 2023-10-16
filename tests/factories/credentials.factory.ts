import { faker } from '@faker-js/faker';
import { Credential } from '@prisma/client';
import { prisma } from '../../src/config';
import Cryptr from 'cryptr';
import { createUser } from '../factories';

export async function createCredential(params: Partial<Credential> = {}): Promise<Credential> {
    const user = await createUser();
    const plainPassword = params.password || faker.internet.password({ length: 10 });
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const encryptedPassword = cryptr.encrypt(plainPassword);
    return prisma.credential.create({
        data: {
            title: params.title || faker.lorem.words({ min: 1, max: 3 }),
            url: params.url || faker.internet.url(),
            username: params.username || faker.internet.userName(),
            password: encryptedPassword,
            userId: user.id,
        },
    });
};