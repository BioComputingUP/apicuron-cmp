import { Module } from '@nestjs/common';
import { OrcidController } from './orcid.controller';
import { OrcidService } from './orcid.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [OrcidController],
  providers: [OrcidService],
  exports: [],
})
export class OrcidModule {}
