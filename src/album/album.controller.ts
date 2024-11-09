import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumContoller {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const requestedAlbum = this.albumService.findOne(id);
    if (!requestedAlbum) throw new NotFoundException('Album does not exist.');
    return requestedAlbum;
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    }),
  )
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    if (!this.albumService.findOne(id))
      throw new NotFoundException('Album does not exist.');

    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!this.albumService.findOne(id))
      throw new NotFoundException('Album does not exist.');
    return this.albumService.remove(id);
  }
}
