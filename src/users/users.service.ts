import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash, verify } from 'argon2';
import { KeyObject, createPrivateKey, createPublicKey, randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { SignJWT, jwtVerify } from 'jose';
import { AuthDataSource } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateAvatar } from 'src/utils/utils';
import { LoginDTO, SignupDTO } from './dtos';
import { PublicUser, User, withGrants } from './models';

@Injectable()
export class UsersService extends AuthDataSource {
	private readonly keys: { private: KeyObject; public: KeyObject };

	public constructor(private readonly prisma: PrismaService) {
		super();

		this.keys = {
			private: createPrivateKey(readFileSync('priv-key.pem')),
			public: createPublicKey(readFileSync('pub-key.pem'))
		};
	}

	public async signup(data: SignupDTO) {
		const salt = randomBytes(32);
		const password = await hash(data.password, { salt });
		const discriminator = Math.floor(Math.random() * 8999) + 1000;

		const newUser = await this.prisma.user.create({
			data: {
				...data,
				password,
				discriminator,
				avatar: generateAvatar(data.name)
			}
		});

		return newUser;
	}

	public async login(data: LoginDTO): Promise<User | null> {
		const users = await this.getUsers({ name: data.name });

		for (const user of users) {
			if (await verify(user.password, data.password)) {
				return user;
			}
		}

		return null;
	}

	public async issueToken(user: User): Promise<string> {
		const signer = new SignJWT({ iss: 'passport.jasonxu.dev', sub: user.id.toString() }).setProtectedHeader({ alg: 'ES256K' });

		const token = await signer.sign(this.keys.private);

		await this.prisma.user.update({ where: { id: user.id }, data: { token } });

		return token;
	}

	public async issueAuthorization(user: User, appId: number): Promise<string> {
		const application = await this.prisma.application.findUnique({ where: { id: appId } });

		if (!application) {
			throw new BadRequestException('Invalid App ID');
		}

		const token = randomBytes(32).toString('hex');
		await this.prisma.user.update({ where: { id: user.id }, data: { grants: { create: { token, appId } } } });

		return token;
	}

	public async getUser(where: Prisma.UserWhereUniqueInput) {
		return this.prisma.user.findUnique({ where, ...withGrants });
	}

	public async getUsers(where: Prisma.UserWhereInput) {
		return this.prisma.user.findMany({ where, ...withGrants });
	}

	public toPublic({ id, name, discriminator, avatar }: User): PublicUser {
		return { id, name, discriminator, avatar };
	}

	public async auth(token: string): Promise<User | null> {
		try {
			const { payload } = await jwtVerify(token, this.keys.public);

			if (payload.sub === undefined) {
				return null;
			}

			const user = await this.getUser({ id: payload.sub, token });

			return user;
		} catch {
			return null;
		}
	}
}

