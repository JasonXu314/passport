import { Controller, Get, NotFoundException, Param, ParseIntPipe, Render } from '@nestjs/common';
import { Protected } from 'src/auth/protected.decorator';
import { ReqUser } from 'src/utils/utils';
import { ApplicationsService } from './applications.service';

@Controller('/apps')
@Protected()
export class ApplicationsClientController {
	constructor(private readonly service: ApplicationsService) {}

	@Get('/')
	@Render('apps/index')
	public async dashboard(@ReqUser() user: User): Promise<AppsProps> {
		const applications = await this.service.getApplications({ ownerId: user.id });

		return {
			user,
			applications,
			__meta: { applications }
		};
	}

	@Get('/new')
	@Render('apps/new')
	public async newApplication(@ReqUser() user: User): Promise<PageProps> {
		const applications = await this.service.getApplications({ ownerId: user.id });

		return { user, __meta: { applications } };
	}

	@Get('/:id')
	@Render('apps/id')
	public async appDashboard(@ReqUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<AppProps> {
		const app = await this.service.getApplication({ id, ownerId: user.id });

		if (!app) {
			throw new NotFoundException('App not found');
		}

		const applications = await this.service.getApplications({ ownerId: user.id });

		return { user, app, __path: `/apps/${id}`, __meta: { applications } };
	}
}

