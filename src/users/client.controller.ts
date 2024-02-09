import { Controller, Get, Headers, NotFoundException, ParseIntPipe, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationsService } from 'src/applications/applications.service';
import { Protected } from 'src/auth/protected.decorator';
import { ReqUser, pruneUser } from 'src/utils/utils';
import { User } from './models';
import { UsersService } from './users.service';

@Controller()
export class UsersClientController {
	constructor(private readonly service: UsersService, private readonly applications: ApplicationsService) {}

	@Get('/login')
	@Render('login')
	public async login(
		@ReqUser() user: User | null,
		@Headers('Referer') referrer?: string,
		@Query('appId') appId?: string,
		@Query('redirectTo') redirectTo?: string
	): Promise<LoginProps> {
		const toApp = appId !== undefined;
		const app = toApp ? await this.applications.getApplication({ id: Number(appId) }) : null;
		const applications = user !== null ? await this.applications.getApplications({ ownerId: user.id }) : [];

		return {
			user: user ? pruneUser(user) : user,
			app,
			redirectTo: redirectTo === undefined ? null : redirectTo,
			badAppId: !app && toApp,
			__meta: { applications }
		};
	}

	@Get('/authorize')
	@Render('authorize')
	public async authorize(
		@ReqUser() user: User | null,
		@Query('appId', ParseIntPipe) appId: number,
		@Query('redirectTo') redirectTo?: string,
		@Headers('Referer') referrer?: string
	): Promise<AuthorizeProps> {
		const app = await this.applications.getApplication({ id: appId });
		const applications = user !== null ? await this.applications.getApplications({ ownerId: user.id }) : [];

		if (!app) {
			throw new NotFoundException('Invalid app');
		}

		return {
			user: user ? pruneUser(user) : user,
			app,
			redirectTo,
			__meta: { applications }
		};
	}

	@Get('/signup')
	@Render('signup')
	public async signup(@ReqUser() user: User | null): Promise<PageProps> {
		const applications = user !== null ? await this.applications.getApplications({ ownerId: user.id }) : [];

		return { user: user ? pruneUser(user) : user, __meta: { applications } };
	}

	@Get('/me')
	@Render('me')
	@Protected()
	public async profile(@ReqUser() user: User): Promise<MeProps> {
		const applications = await this.applications.getApplications({ ownerId: user.id });

		return {
			user: user ? pruneUser(user) : user,
			grants: user.grants,
			__meta: { applications }
		};
	}

	@Get('/logout')
	@Render('logout')
	public async logout(@ReqUser() user: User | null, @Res({ passthrough: true }) res: Response): Promise<PageProps> {
		if (user !== null) {
			res.clearCookie('passport::token');
			user = null;
		}

		return { user, __meta: { applications: [] } };
	}
}

