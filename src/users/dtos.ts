import { IsInt, IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { fi } from 'src/utils/utils';

export class SignupDTO {
	@IsString()
	@MinLength(1)
	name: string = fi();

	@IsString()
	@IsStrongPassword({ minSymbols: 0 })
	password: string = fi();
}

export class LoginDTO {
	@IsString()
	name: string = fi();

	@IsString()
	password: string = fi();

	@IsInt()
	@IsOptional()
	appId?: number;

	@IsString()
	@IsOptional()
	redirectTo?: string;
}

export class AuthorizeApplicationDTO {
	@IsInt()
	appId: number = fi();

	@IsString()
	@IsOptional()
	redirectTo?: string;
}

