import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entities';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { prisma } from 'src/prisma-client';

@Injectable()
export class AlbumService {
  async create(createAlbumtDto: CreateAlbumDto) {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      name: createAlbumtDto.name,
      year: createAlbumtDto.year,
      artistId: createAlbumtDto.artistId,
    };

    await prisma.albums.create({ data: newAlbum });

    return newAlbum;
  }

  async findAll() {
    return await prisma.albums.findMany();
  }

  async findOne(id: string) {
    const requestedAlbum: Album = await prisma.albums.findUnique({
      where: { id: id },
    });
    if (!requestedAlbum) throw new NotFoundException('Album does not exist.');

    return requestedAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const processedAlbum: Album = await this.findOne(id);
    if (!processedAlbum) throw new NotFoundException('Album does not exist.');

    if ('name' in updateAlbumDto) {
      processedAlbum.name = updateAlbumDto.name;
    }
    if ('year' in updateAlbumDto) {
      processedAlbum.year = updateAlbumDto.year;
    }
    if ('artistId' in updateAlbumDto) {
      processedAlbum.artistId = updateAlbumDto.artistId;
    }

    await prisma.albums.update({ where: { id: id }, data: processedAlbum });

    return processedAlbum;
  }

  async remove(id: string) {
    const processedAlbum: Album = await this.findOne(id);
    if (!processedAlbum) throw new NotFoundException('Album does not exist.');

    await prisma.albums.delete({ where: { id: id } });

    const albumInFav = await prisma.fav_albums.findUnique({ where: { id } });
    if (albumInFav) await prisma.fav_albums.delete({ where: { id } });
  }
}
