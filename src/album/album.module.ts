import { Module } from '@nestjs/common';
import { AlbumContoller } from './album.controller';
import { AlbumService } from './album.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AlbumContoller],
  providers: [AlbumService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
    }),
  ],
})
export class AlbumModule {}
