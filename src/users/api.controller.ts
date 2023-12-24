import { BadRequestException, Body, ConflictException, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationsService } from 'src/applications/applications.service';
import { Protected } from 'src/auth/protected.decorator';
import { AUTH_COOKIE_OPTIONS } from 'src/utils/constants';
import { Redirect } from 'src/utils/filters/redirect.filter';
import { ReqUser } from 'src/utils/utils';
import { AuthorizationResponseDTO, AuthorizeApplicationDTO, LoginDTO, SignupDTO } from './dtos';
import { User } from './models';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
	constructor(private readonly service: UsersService, private readonly applications: ApplicationsService) {}

	@Post('/signup')
	public async signup(@Body() data: SignupDTO): Promise<void> {
		await this.service.signup(data);
	}

	@Post('/login')
	public async login(@Body() data: LoginDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
		if (data.appId === undefined) {
			// Logging into Passport itself
			if (data.redirectTo !== undefined && !data.redirectTo.startsWith('/')) {
				throw new BadRequestException('When logging into Passport itself, must use relative redirect');
			}

			const user = await this.service.login(data);

			if (!user) {
				throw new UnauthorizedException('Invalid username or password.');
			} else {
				if (user.token !== null) {
					res.cookie('passport::token', user.token, AUTH_COOKIE_OPTIONS);
				} else {
					const token = await this.service.issueToken(user);

					res.cookie('passport::token', token, AUTH_COOKIE_OPTIONS);
				}
			}

			if (data.redirectTo !== undefined) {
				throw new Redirect(data.redirectTo);
			} else {
				throw new Redirect('/me');
			}
		} else {
			const application = await this.applications.getApplication({ id: data.appId }); // TODO: i wonder if i can move this further down

			if (!application) {
				throw new BadRequestException('Invalid application ID');
			}

			const redirectURL = await this.applications.resolveRedirect(data.appId, data.redirectTo);
			const preppedRedirectURL = redirectURL.includes('?') ? redirectURL + '&' : redirectURL + '?';

			if (!redirectURL.startsWith(application.baseURL)) {
				throw new BadRequestException('Redirect URL must either be a relative path or start with the base URL of the application');
			}

			const user = await this.service.login(data);

			if (!user) {
				throw new UnauthorizedException('Invalid username or password.');
			} else {
				if (user.token !== null) {
					res.cookie('passport::token', user.token, AUTH_COOKIE_OPTIONS);
				} else {
					const token = await this.service.issueToken(user);

					res.cookie('passport::token', token, AUTH_COOKIE_OPTIONS);
				}
			}

			const grant = user.grants.find(({ appId }) => appId === data.appId);

			if (!grant) {
				throw new ConflictException('Requires application grant.');
			}

			throw new Redirect(`${preppedRedirectURL}token=${encodeURIComponent(grant.token)}`);
		}
	}

	@Post('/authorize')
	@Protected()
	public async authorize(@ReqUser() user: User, @Body() data: AuthorizeApplicationDTO): Promise<AuthorizationResponseDTO> {
		const token = await this.service.issueAuthorization(user, data.appId);

		const redirectURL = await this.applications.resolveRedirect(data.appId, data.redirectTo);

		return {
			redirectURL,
			token
		};
	}
}

