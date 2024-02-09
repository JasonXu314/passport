import { Controller, Get, Render } from '@nestjs/common';
import { ApplicationsService } from './applications/applications.service';
import { ReqUser, pruneUser } from './utils/utils';

@Controller()
export class AppController {
	constructor(private readonly applications: ApplicationsService) {}

	@Get('/')
	@Render('index')
	public async index(@ReqUser() user?: FullUser): Promise<PageProps<{}>> {
		const applications = user ? await this.applications.getApplications({ ownerId: user.id }) : [];

		return { user: user ? pruneUser(user) : null, __meta: { applications } };
	}
}

