import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import * as FormData from 'form-data';
import { memoryStorage } from 'multer';
import { Protected } from 'src/auth/protected.decorator';
import { User } from 'src/users/models';
import { ErrorPage } from 'src/utils/filters/error-page.filter';
import { Redirect } from 'src/utils/filters/redirect.filter';
import { $table } from 'src/utils/html';
import { $layout } from 'src/utils/templates';
import { ReqUser } from 'src/utils/utils';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDTO } from './dtos';

@Controller('/admin/apps')
@Protected({ requireAdmin: true })
export class ApplicationsClientController {
	constructor(private readonly service: ApplicationsService) {}

	@Get('/')
	public async dashboard(@ReqUser() user: User): Promise<string> {
		const applications = await this.service.getApplications();

		return $layout(
			'Passport - Apps Admin',
			user,
			`<style>
				.icon {
					max-height: 4em;
				}
			</style>`
		)`
			<h1>Applications</h1>
			${$table(applications)`<th scope="col">${['ID', 'Name', 'Icon', 'Base URL', 'Revokation Endpoint']}</th>`(
				({ id, name, icon, baseURL, revokationEndpoint }) => `
				<tr>
					<td>${id}</td>
					<td><a href="/admin/apps/${id}">${name}</a></td>
					<td><img class="icon" src="${icon}" alt="Icon"></td>
					<td>${baseURL}</td>
					<td>${revokationEndpoint}</td>
				</tr>
			`
			)}
			<a href="/admin/apps/new" role="button">New Application</a>
		`;
	}

	@Get('/new')
	public async newApplication(@ReqUser() user: User): Promise<string> {
		return $layout('Passport - New App', user)`
			<h1>New Application</h1>
			<form action="/admin/apps/new" method="POST" enctype="multipart/form-data">
				<label>
					Name
					<input type="text" name="name">
				</label>
				<label>
					Base URL
					<input type="text" name="baseURL">
				</label>
				<label>
					Icon
					<input type="file" name="icon">
				</label>
				<label>
					Revokation Endpoint
					<input type="text" name="revokationEndpoint">
				</label>
				<button type="submit">Create</button>
			</form>
		`;
	}

	@Post('/new')
	@UseInterceptors(FileInterceptor('icon', { storage: memoryStorage() }))
	public async newApplicationAPI(@Body() data: CreateApplicationDTO, @UploadedFile() file: Express.Multer.File): Promise<void> {
		const form = new FormData();
		form.append('file', file.buffer, { filename: file.originalname });
		const res = await axios.postForm<string>(`${process.env.CDN_URL}`, form);

		await this.service.createApplication({ ...data, icon: `${process.env.CDN_URL}/${res.data}` });
		throw new Redirect('/admin/apps');
	}

	@Get('/:id')
	public async appDashboard(@ReqUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<string> {
		const app = await this.service.getApplication({ id });

		if (!app) {
			throw new NotFoundException(
				new ErrorPage(
					() => $layout('Passport - Apps Admin', user)`
			<h1>App not found</h1>
			<a href="/admin/apps">Back</a>`
				)
			);
		}

		return $layout(
			'Passport - Apps Admin',
			user,
			`<style>
				.icon {
					max-height: 8em;
				}
			</style>`
		)`
			<h1>${app.name}</h1>
			<a href="/admin/apps">Back</a>
			<a href="/admin/apps/${id}/key" role="button" download>Download Key</a>
		`;
	}

	@Get('/:id/key')
	public async appKey(@ReqUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<StreamableFile> {
		const app = await this.service.getApplication({ id });

		if (!app) {
			throw new NotFoundException(
				new ErrorPage(
					() => $layout('Passport - Apps Admin', user)`
			<h1>App not found</h1>
			<a href="/admin/apps">Back</a>`
				)
			);
		}

		return new StreamableFile(Uint8Array.from(Buffer.from(app.publicKey)), {
			disposition: 'attachment; filename="key.pem"',
			type: 'application/x-pem-file'
		});
	}
}

