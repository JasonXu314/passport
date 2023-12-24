import { IsString, MinLength } from 'class-validator';
import { fi } from 'src/utils/utils';

export class CreateApplicationDTO {
	@IsString()
	@MinLength(1)
	name: string = fi();

	@IsString()
	@MinLength(1)
	baseURL: string = fi();

	@IsString()
	@MinLength(1)
	revokeURL: string = fi();
}

