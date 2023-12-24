import { Module } from '@nestjs/common';
import { ApplicationsModule } from 'src/applications/applications.module';
import { UsersController } from './api.controller';
import { UsersClientController } from './client.controller';
import { UsersService } from './users.service';

@Module({
	imports: [ApplicationsModule],
	controllers: [UsersController, UsersClientController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {}

