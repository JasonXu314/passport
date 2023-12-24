import { BadRequestException, Body, ConflictException, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ApplicationsService } from 'src/applications/applications.service';
import { Protected } from 'src/auth/protected.decorator';
import { AUTH_COOKIE_OPTIONS } from 'src/utils/constants';
import { ReqUser } from 'src/utils/utils';
import { AuthorizationResponseDTO, AuthorizeApplicationDTO, LoginDTO, LoginSuccessDTO, SignupDTO } from './dtos';
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
	public async login(@Body() data: LoginDTO, @Res({ passthrough: true }) res: Response): Promise<LoginSuccessDTO> {
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

					user.token = token;
					res.cookie('passport::token', token, AUTH_COOKIE_OPTIONS);
				}
			}

			return {
				token: user.token,
				redirectURL: data.redirectTo ?? '/me'
			};
		} else {
			const application = await this.applications.getApplication({ id: data.appId }); // TODO: i wonder if i can move this further down

			if (!application) {
				throw new BadRequestException('Invalid application ID');
			}

			const redirectURL = await this.applications.resolveRedirect(data.appId, data.redirectTo);

			const user = await this.service.login(data);

			if (!user) {
				throw new UnauthorizedException('Invalid username or password.');
			} else {
				if (user.token !== null) {
					res.cookie('passport::token', user.token, AUTH_COOKIE_OPTIONS);
				} else {
					const token = await this.service.issueToken(user);

					user.token = token;
					res.cookie('passport::token', token, AUTH_COOKIE_OPTIONS);
				}
			}

			const grant = user.grants.find(({ appId }) => appId === data.appId);

			if (!grant) {
				throw new ConflictException('Requires application grant.');
			}

			return {
				token: user.token,
				redirectURL
			};
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

