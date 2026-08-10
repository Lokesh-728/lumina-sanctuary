import { Module } from '@nestjs/common';
import { AffirmationsService } from './affirmations.service';
import { AffirmationsController } from './affirmations.controller';

@Module({
  controllers: [AffirmationsController],
  providers: [AffirmationsService],
  exports: [AffirmationsService],
})
export class AffirmationsModule {}
