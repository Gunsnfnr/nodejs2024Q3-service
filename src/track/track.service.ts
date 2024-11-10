import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { tracks } from './data';
import { getIndexById } from 'src/utils/get-index-by-id';
import { removeFavFrom } from 'src/utils/remove-fav';
import { favs } from 'src/favs/data';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    };

    tracks.push(newTrack);

    return newTrack;
  }

  findAll() {
    return tracks;
  }

  findOne(id: string) {
    const requestedTrack: Track = tracks.filter(
      (track: Track) => track.id === id,
    )[0];
    return requestedTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const processedTrack: Track = tracks.filter(
      (artist: Track) => artist.id === id,
    )[0];
    if ('name' in updateTrackDto) {
      processedTrack.name = updateTrackDto.name;
    }
    if ('artistId' in updateTrackDto) {
      processedTrack.artistId = updateTrackDto.artistId;
    }
    if ('albumId' in updateTrackDto) {
      processedTrack.albumId = updateTrackDto.albumId;
    }
    if ('duration' in updateTrackDto) {
      processedTrack.duration = updateTrackDto.duration;
    }

    return processedTrack;
  }

  remove(id: string) {
    const indexOfTrack = getIndexById(tracks, id);
    tracks.splice(indexOfTrack, 1);
    removeFavFrom(favs.tracks, id);
  }
}
