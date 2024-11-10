import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { artists } from './data';
import { getIndexById } from 'src/utils/get-index-by-id';
import { albums } from 'src/album/data';
import { tracks } from 'src/track/data';
import { favs } from 'src/favs/data';
import { removeFavFrom } from 'src/utils/remove-fav';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto) {
    const newArtist: Artist = {
      id: crypto.randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    artists.push(newArtist);

    return newArtist;
  }

  findAll() {
    return artists;
  }

  findOne(id: string) {
    const requestedArtist: Artist = artists.filter(
      (artist: Artist) => artist.id === id,
    )[0];
    return requestedArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const processedArtist: Artist = artists.filter(
      (artist: Artist) => artist.id === id,
    )[0];
    if ('grammy' in updateArtistDto) {
      processedArtist.grammy = updateArtistDto.grammy;
    }
    if ('name' in updateArtistDto) {
      processedArtist.name = updateArtistDto.name;
    }

    return processedArtist;
  }

  remove(id: string) {
    const indexOfArtist = getIndexById(artists, id);
    artists.splice(indexOfArtist, 1);
    albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
    tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    removeFavFrom(favs.artists, id);
  }
}
