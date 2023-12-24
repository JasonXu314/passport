import { Prisma } from '@prisma/client';

export const withGrants = Prisma.validator<Prisma.UserDefaultArgs>()({
	include: {
		grants: {
			include: {
				app: true
			}
		}
	}
});

export const onlyPublic = Prisma.validator<Prisma.UserDefaultArgs>()({
	select: {
		id: true,
		name: true,
		discriminator: true,
		avatar: true
	}
});

export type User = Prisma.UserGetPayload<typeof withGrants>;
export type PublicUser = Prisma.UserGetPayload<typeof onlyPublic>;

