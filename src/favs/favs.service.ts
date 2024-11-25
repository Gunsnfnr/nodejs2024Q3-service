import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entities';
import { Artist } from 'src/artist/entities/artist.entity';
import { prisma } from 'src/prisma-client';

type FavItem = Track | Album | Artist;
type FavType = 'track' | 'album' | 'artist';

@Injectable()
export class FavsService {
  async findAll() {
    const favArtists = await prisma.fav_artists.findMany();
    const favAlbums = await prisma.fav_albums.findMany();
    const favTracks = await prisma.fav_tracks.findMany();

    return {
      artists: favArtists,
      albums: favAlbums,
      tracks: favTracks,
    };
  }

  private async findOne(id: string, favType: FavType) {
    let newFav: FavItem;
    switch (favType) {
      case 'album':
        newFav = await prisma.albums.findUnique({ where: { id } });
        break;
      case 'artist':
        newFav = await prisma.artists.findUnique({ where: { id } });
        break;
      default:
        newFav = await prisma.tracks.findUnique({ where: { id } });
    }
    return newFav;
  }

  async add(id: string, favType: FavType) {
    const newFav = await this.findOne(id, favType);

    if (newFav) {
      if ('year' in newFav) {
        await prisma.fav_albums.create({ data: newFav });
      } else if ('grammy' in newFav) {
        await prisma.fav_artists.create({ data: newFav });
      } else if ('duration' in newFav) {
        await prisma.fav_tracks.create({ data: newFav });
      }
      return 'Item added to favorites';
    } else {
      throw new UnprocessableEntityException(
        'Item with the given id does not exist.',
      );
    }
  }

  private async findInFavs(id: string, favType: FavType) {
    let itemInFavs: FavItem;
    switch (favType) {
      case 'album':
        itemInFavs = await prisma.fav_albums.findUnique({ where: { id } });
        break;
      case 'artist':
        itemInFavs = await prisma.fav_artists.findUnique({ where: { id } });
        break;
      default:
        itemInFavs = await prisma.fav_tracks.findUnique({ where: { id } });
    }
    return itemInFavs;
  }

  async remove(id: string, favType: FavType) {
    const itemInFavs = await this.findInFavs(id, favType);
    if (itemInFavs) {
      if ('year' in itemInFavs) {
        await prisma.fav_albums.delete({ where: { id: id } });
      } else if ('grammy' in itemInFavs) {
        await prisma.fav_artists.delete({ where: { id: id } });
      } else if ('duration' in itemInFavs) {
        await prisma.fav_tracks.delete({ where: { id: id } });
      }
      return 'Item removed from favorites';
    } else {
      throw new NotFoundException('Item is not in favorites.');
    }
  }
}
