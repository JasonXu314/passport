import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Application } from '@prisma/client';
import axios from 'axios';
import FormData from 'form-data';
import { memoryStorage } from 'multer';
import { Protected } from 'src/auth/protected.decorator';
import { ReqUser } from 'src/utils/utils';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDTO } from './dtos';

@Controller('/api/apps')
@Protected()
export class ApplicationsAPIController {
	constructor(private readonly service: ApplicationsService) {}

	@Post('/new')
	@UseInterceptors(FileInterceptor('icon', { storage: memoryStorage() }))
	public async newApplicationAPI(
		@ReqUser() user: User,
		@Body() data: CreateApplicationDTO,
		@UploadedFile() file: Express.Multer.File
	): Promise<Application> {
		const form = new FormData();
		form.append('file', file.buffer, { filename: file.originalname });
		const res = await axios.postForm<string>(`${process.env.CDN_URL}`, form);

		return this.service.createApplication(user.id, { ...data, icon: `${process.env.CDN_URL}/${res.data}` });
	}
}

