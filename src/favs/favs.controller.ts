import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entities';
import { Artist } from 'src/artist/entities/artist.entity';
import { favs } from './data';
import { tracks } from 'src/track/data';
import { albums } from 'src/album/data';
import { artists } from 'src/artist/data';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.add<Track>(id, favs.tracks, tracks);
  }

  @Post('album/:id')
  addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.add<Album>(id, favs.albums, albums);
  }

  @Post('artist/:id')
  addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.add<Artist>(id, favs.artists, artists);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.remove(id, favs.tracks);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.remove(id, favs.albums);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favsService.remove(id, favs.artists);
  }
}
