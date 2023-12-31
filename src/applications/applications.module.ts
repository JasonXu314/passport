import { Module } from '@nestjs/common';
import { ApplicationsAPIController } from './api.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationsClientController } from './client.controller';

@Module({
	imports: [],
	controllers: [ApplicationsClientController, ApplicationsAPIController],
	providers: [ApplicationsService],
	exports: [ApplicationsService]
})
export class ApplicationsModule {}

