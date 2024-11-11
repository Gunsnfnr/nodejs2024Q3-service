import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entities';
import { albums } from './data';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { getIndexById } from 'src/utils/get-index-by-id';
import { tracks } from 'src/track/data';
import { removeFavFrom } from 'src/utils/remove-fav';
import { favs } from 'src/favs/data';

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
    if (!requestedAlbum) throw new NotFoundException('Album does not exist.');

    return requestedAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const processedAlbum: Album = this.findOne(id);
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

    return processedAlbum;
  }

  remove(id: string) {
    const processedAlbum: Album = this.findOne(id);
    if (!processedAlbum) throw new NotFoundException('Album does not exist.');

    const indexOfAlbum = getIndexById(albums, id);
    albums.splice(indexOfAlbum, 1);
    tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
    removeFavFrom(favs.albums, id);
  }
}
