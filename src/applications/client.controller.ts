import { Controller, Get, NotFoundException, Param, ParseIntPipe, Render } from '@nestjs/common';
import { Protected } from 'src/auth/protected.decorator';
import { UsersService } from 'src/users/users.service';
import { ReqUser, pruneUser } from 'src/utils/utils';
import { ApplicationsService } from './applications.service';

@Controller('/apps')
@Protected()
export class ApplicationsClientController {
	constructor(private readonly service: ApplicationsService, private readonly users: UsersService) {}

	@Get('/')
	@Render('apps/index')
	public async dashboard(@ReqUser() user: FullUser): Promise<AppsProps> {
		const applications = await this.service.getApplications({ ownerId: user.id });

		return {
			user: pruneUser(user),
			applications,
			__meta: { applications }
		};
	}

	@Get('/new')
	@Render('apps/new')
	public async newApplication(@ReqUser() user: FullUser): Promise<PageProps> {
		const applications = await this.service.getApplications({ ownerId: user.id });

		return { user: pruneUser(user), __meta: { applications } };
	}

	@Get('/:id')
	@Render('apps/id')
	public async appDashboard(@ReqUser() user: FullUser, @Param('id', ParseIntPipe) id: number): Promise<AppProps> {
		const app = await this.service.getApplication({ id, ownerId: user.id });

		if (!app) {
			throw new NotFoundException('App not found');
		}

		const applications = await this.service.getApplications({ ownerId: user.id });
		const users = (await this.users.getUsers({ grants: { some: { appId: id } } })).map((user) => pruneUser(user));

		return { user: pruneUser(user), app, users, __path: `/apps/${id}`, __meta: { applications } };
	}
}

