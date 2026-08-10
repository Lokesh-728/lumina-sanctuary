import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JournalModule } from './modules/journal/journal.module';
import { HabitsModule } from './modules/habits/habits.module';
import { ProfileModule } from './modules/profile/profile.module';
import { VisionBoardModule } from './modules/vision-board/vision-board.module';
import { AffirmationsModule } from './modules/affirmations/affirmations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JournalModule,
    HabitsModule,
    ProfileModule,
    VisionBoardModule,
    AffirmationsModule,
  ],
})
export class AppModule {}
