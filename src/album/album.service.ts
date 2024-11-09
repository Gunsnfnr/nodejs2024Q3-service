import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entities';
import { albums } from './data';
import { artists } from 'src/artist/data';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { getIndexById } from 'src/utils/get-index-by-id';

@Injectable()
export class AlbumService {
  create(createAlbumtDto: CreateAlbumDto) {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      name: createAlbumtDto.name,
      year: createAlbumtDto.year,
      artistId: createAlbumtDto.artistId,
    };

    albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return albums;
  }

  findOne(id: string) {
    const requestedAlbum: Album = albums.filter(
      (album: Album) => album.id === id,
    )[0];
    return requestedAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const processedAlbum: Album = albums.filter((album) => album.id === id)[0];
    if ('name' in updateAlbumDto) {
      processedAlbum.name = updateAlbumDto.name;
    }
    if ('year' in updateAlbumDto) {
      processedAlbum.year = updateAlbumDto.year;
    }
    if ('artistId' in updateAlbumDto) {
      processedAlbum.artistId = updateAlbumDto.artistId;
    }

    return processedAlbum;
  }

  remove(id: string) {
    const indexOfAlbum = getIndexById(albums, id);
    albums.splice(indexOfAlbum, 1);
  }
}
