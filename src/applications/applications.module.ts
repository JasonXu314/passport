import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsClientController } from './client.controller';

@Module({
	imports: [],
	controllers: [ApplicationsClientController],
	providers: [ApplicationsService],
	exports: [ApplicationsService]
})
export class ApplicationsModule {}

