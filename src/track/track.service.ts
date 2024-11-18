import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { prisma } from 'src/prisma-client';

@Injectable()
export class TrackService {
  async create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    };

    await prisma.tracks.create({ data: newTrack });

    return newTrack;
  }

  async findAll() {
    return await prisma.tracks.findMany();
  }

  async findOne(id: string) {
    const requestedTrack: Track = await prisma.tracks.findUnique({
      where: { id },
    });
    if (!requestedTrack) throw new NotFoundException('Track does not exist.');
    return requestedTrack;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const processedTrack: Track = await this.findOne(id);
    if (!processedTrack) throw new NotFoundException('Track does not exist.');

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
    await prisma.tracks.update({ where: { id: id }, data: processedTrack });

    return processedTrack;
  }

  async remove(id: string) {
    const processedTrack: Track = await this.findOne(id);
    if (!processedTrack) throw new NotFoundException('Track does not exist.');

    await prisma.tracks.delete({ where: { id: id } });

    const trackInFav = await prisma.fav_tracks.findUnique({ where: { id } });
    if (trackInFav) await prisma.fav_tracks.delete({ where: { id } }).catch();
  }
}
