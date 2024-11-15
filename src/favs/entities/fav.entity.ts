import { Album } from 'src/album/entities/album.entities';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class Fav {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}