import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDTO } from './dtos';

@Injectable()
export class ApplicationsService {
	public constructor(private readonly prisma: PrismaService) {}

	public async getApplications() {
		return this.prisma.application.findMany();
	}

	public async getApplication(where: Prisma.ApplicationWhereUniqueInput) {
		return this.prisma.application.findUnique({ where });
	}

	public async createApplication(ownerId: string, data: CreateApplicationDTO & { icon: string }) {
		return this.prisma.application.create({ data: { ...data, owner: { connect: { id: ownerId } } } });
	}

	public async resolveRedirect(appId: number, to: string | undefined): Promise<string> {
		const application = await this.getApplication({ id: appId });

		if (!application) {
			throw new NotFoundException('Invalid application ID');
		}

		const redirectURL = to === undefined ? application.baseURL : to.startsWith('/') ? application.baseURL + to : to;

		if (!redirectURL.startsWith(application.baseURL)) {
			throw new BadRequestException('Redirect URL must either be a relative path or start with the base URL of the application');
		}

		return redirectURL;
	}
}

