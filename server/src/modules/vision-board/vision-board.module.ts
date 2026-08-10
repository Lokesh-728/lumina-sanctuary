import { Module } from '@nestjs/common';
import { VisionBoardService } from './vision-board.service';
import { VisionBoardController } from './vision-board.controller';

@Module({
  controllers: [VisionBoardController],
  providers: [VisionBoardService],
})
export class VisionBoardModule {}
