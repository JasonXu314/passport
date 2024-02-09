import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ApplicationsAPIController } from './api.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationsClientController } from './client.controller';

@Module({
	imports: [forwardRef(() => UsersModule)],
	controllers: [ApplicationsClientController, ApplicationsAPIController],
	providers: [ApplicationsService],
	exports: [ApplicationsService]
})
export class ApplicationsModule {}

