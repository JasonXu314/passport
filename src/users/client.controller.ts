import { Controller, Get, Headers, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationsService } from 'src/applications/applications.service';
import { Protected } from 'src/auth/protected.decorator';
import { ReqUser } from 'src/utils/utils';
import { User } from './models';
import { UsersService } from './users.service';

@Controller()
export class UsersClientController {
	constructor(private readonly service: UsersService, private readonly applications: ApplicationsService) {}

	@Get('/login')
	@Render('login')
	public async login(
		@ReqUser() user: User,
		@Headers('Referer') referrer?: string,
		@Query('appId') appId?: string,
		@Query('redirectTo') redirectTo?: string
	): Promise<LoginProps> {
		const toApp = appId !== undefined;
		const app = toApp ? await this.applications.getApplication({ id: Number(appId) }) : null;

		return {
			user,
			app,
			referrer: referrer === undefined ? null : referrer,
			redirectTo: redirectTo === undefined ? null : redirectTo,
			badAppId: !app && toApp
		};
	}

	@Get('/signup')
	@Render('signup')
	public async signup(@ReqUser() user: User): Promise<PageProps> {
		return { user };
	}

	@Get('/me')
	@Render('me')
	@Protected()
	public async profile(@ReqUser() user: User): Promise<MeProps> {
		return {
			user,
			grants: user.grants
		};
	}

	@Get('/logout')
	@Render('logout')
	public async logout(@ReqUser() user: User | null, @Res({ passthrough: true }) res: Response): Promise<PageProps> {
		if (user !== null) {
			res.clearCookie('passport::token');
			user = null;
		}

		return { user };
	}
}

