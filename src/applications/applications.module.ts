import { Module } from '@nestjs/common';
import { ApplicationsClientController } from './applications.client.controller';
import { ApplicationsService } from './applications.service';

@Module({
	imports: [],
	controllers: [ApplicationsClientController],
	providers: [ApplicationsService],
	exports: [ApplicationsService]
})
export class ApplicationsModule {}

