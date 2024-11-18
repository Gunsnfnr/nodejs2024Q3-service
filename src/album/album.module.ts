import { Module } from '@nestjs/common';
import { AlbumContoller } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  controllers: [AlbumContoller],
  providers: [AlbumService],
})
export class AlbumModule {}
