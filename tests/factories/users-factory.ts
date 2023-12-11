import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { prisma } from '../../src/config';

export async function createUser(params: Partial<User> = {}): Promise<User> {
    const plainPassword = params.password || faker.internet.password({ length: 10 });
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    return prisma.user.create({
        data: {
            email: params.email || faker.internet.email(),
            password: hashedPassword,
        },
    });
}