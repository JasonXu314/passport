import { BadRequestException, Controller, Get, Headers, Post, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationsService } from 'src/applications/applications.service';
import { Protected } from 'src/auth/protected.decorator';
import { ErrorPage } from 'src/utils/filters/error-page.filter';
import { $each } from 'src/utils/html';
import { $layout, $loginForm } from 'src/utils/templates';
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
	): Promise<string> {
		const toApp = appId !== undefined;
		const app = toApp ? await this.applications.getApplication({ id: Number(appId) }) : null;
		if (!app && toApp) {
			throw new BadRequestException(
				new ErrorPage(
					() => $layout('Passport - Error', user)`
				<h1 class="error"><i class="fa-solid fa-triangle-exclamation"></i> Bad login link</h1>
				<p>Unknown login destination; if you have been given this link by someone else, this may be an attempt to steal your info.</p>`
				)
			);
		}

		return $layout('Passport - Login', user)`
			<h1>Login</h1>
				${$loginForm({
					appId: toApp ? Number(appId) : undefined,
					redirectTo,
					referrer: toApp && referrer !== undefined && referrer.startsWith(app!.baseURL) ? referrer : undefined
				})}
			</form>
		`;
	}

	@Get('/signup')
	@Render('signup')
	public async signup(@ReqUser() user: User): Promise<{ user: User }> {
		return { user };
	}

	@Get('/me')
	@Protected()
	public async profile(@ReqUser() user: User): Promise<string> {
		return $layout(
			'Passport - Profile',
			user,
			`<style>
			.user-card {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 2rem;
			}

			.user-card img {
				border-radius: 50%;
			}

			.user-card .name {
				display: flex;
				flex-direction: row;
				align-items: baseline;
			}
			</style>`
		)`
			<article class="user-card">
				<img src="${user.avatar}" alt="Avatar">
				<hgroup class="name">
					<h1>${user.name}</h1>
					<h6>&#35;${user.discriminator}</h6>
				</hgroup>
			</article>
			<h2>Authorized Applications:</h2>
			${$each(user.grants)(
				({ app }) => `
			<section>
				<h3>${app.name}</h3>
				<img src="${app.icon}" alt="App Icon">
			</section>
			`
			)}
		`;
	}

	@Post('/logout')
	public async logout(@ReqUser() user: User | null, @Res({ passthrough: true }) res: Response): Promise<string> {
		if (user !== null) {
			res.clearCookie('passport::token');
		}

		return $layout('Passport - Logout Success', null)`
			<h1 class="success"><i class="fa-solid fa-info-circle"></i> You have been successfully logged out</h1>
		`;
	}
}

