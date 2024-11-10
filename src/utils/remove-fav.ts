import { Album } from 'src/album/entities/album.entities';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

const removeFavFrom = (base: Artist[] | Album[] | Track[], id: string) => {
  base.forEach((item: Artist | Album | Track, index: number) => {
    if (item.id === id) base.splice(index, 1);
  });
};
export { removeFavFrom };
