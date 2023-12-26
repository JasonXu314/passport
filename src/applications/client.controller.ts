import { Controller, Get, Render } from '@nestjs/common';
import { Protected } from 'src/auth/protected.decorator';
import { ReqUser } from 'src/utils/utils';
import { ApplicationsService } from './applications.service';

@Controller('/apps')
@Protected()
export class ApplicationsClientController {
	constructor(private readonly service: ApplicationsService) {}

	@Get('/')
	@Render('apps/index')
	public async dashboard(@ReqUser() user: User): Promise<AppsProps> {
		const applications = await this.service.getApplications();

		return {
			user,
			applications
		};
	}

	@Get('/new')
	@Render('apps/new')
	public async newApplication(@ReqUser() user: User): Promise<PageProps> {
		return { user };
	}

	// @Post('/new')
	// @UseInterceptors(FileInterceptor('icon', { storage: memoryStorage() }))
	// public async newApplicationAPI(@Body() data: CreateApplicationDTO, @UploadedFile() file: Express.Multer.File): Promise<void> {
	// 	const form = new FormData();
	// 	form.append('file', file.buffer, { filename: file.originalname });
	// 	const res = await axios.postForm<string>(`${process.env.CDN_URL}`, form);

	// 	await this.service.createApplication({ ...data, icon: `${process.env.CDN_URL}/${res.data}` });
	// 	throw new Redirect('/admin/apps');
	// }

	// @Get('/:id')
	// public async appDashboard(@ReqUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<string> {
	// 	const app = await this.service.getApplication({ id });

	// 	if (!app) {
	// 		throw new NotFoundException(
	// 			new ErrorPage(
	// 				() => $layout('Passport - Apps Admin', user)`
	// 		<h1>App not found</h1>
	// 		<a href="/admin/apps">Back</a>`
	// 			)
	// 		);
	// 	}

	// 	return $layout(
	// 		'Passport - Apps Admin',
	// 		user,
	// 		`<style>
	// 			.icon {
	// 				max-height: 8em;
	// 			}
	// 		</style>`
	// 	)`
	// 		<h1>${app.name}</h1>
	// 		<a href="/admin/apps">Back</a>
	// 		<a href="/admin/apps/${id}/key" role="button" download>Download Key</a>
	// 	`;
	// }

	// @Get('/:id/key')
	// public async appKey(@ReqUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<StreamableFile> {
	// 	const app = await this.service.getApplication({ id });

	// 	if (!app) {
	// 		throw new NotFoundException(
	// 			new ErrorPage(
	// 				() => $layout('Passport - Apps Admin', user)`
	// 		<h1>App not found</h1>
	// 		<a href="/admin/apps">Back</a>`
	// 			)
	// 		);
	// 	}

	// 	return new StreamableFile(Uint8Array.from(Buffer.from(app.publicKey)), {
	// 		disposition: 'attachment; filename="key.pem"',
	// 		type: 'application/x-pem-file'
	// 	});
	// }
}

