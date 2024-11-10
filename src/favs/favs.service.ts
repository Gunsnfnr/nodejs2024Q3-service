import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { favs } from './data';
import { getIndexById } from 'src/utils/get-index-by-id';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entities';
import { Artist } from 'src/artist/entities/artist.entity';

type FavItem = Track | Album | Artist;

@Injectable()
export class FavsService {
  findAll() {
    return favs;
  }

  private findOne<T extends FavItem>(source: T[], id: string) {
    const newFav: FavItem = source.filter((item: FavItem) => item.id === id)[0];
    return newFav;
  }

  add<T extends FavItem>(id: string, base: T[], source: T[]) {
    const newFav = this.findOne(source, id) as T;
    console.log('newFav: ', newFav);

    if (newFav) {
      (base as T[]).push(newFav);
      return 'Item added to favorites';
    }
    {
      throw new UnprocessableEntityException(
        'Track with the given id does not exist.',
      );
    }
  }

  remove<T extends FavItem>(id: string, base: T[]) {
    const indexInFavs = getIndexById(base, id);
    if (indexInFavs) {
      base.forEach((item, index) => {
        if (item.id === id) base.splice(index, 1);
      });
    } else {
      throw new NotFoundException('Item is not in favourites.');
    }
  }
}
