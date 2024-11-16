import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { albums } from 'src/album/data';
import { tracks } from 'src/track/data';
import { favs } from 'src/favs/data';
import { removeFavFrom } from 'src/utils/remove-fav';
import { prisma } from 'prisma/prisma-client';

@Injectable()
export class ArtistService {
  async create(createArtistDto: CreateArtistDto) {
    const newArtist: Artist = {
      id: crypto.randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    await prisma.artists.create({ data: newArtist });

    return newArtist;
  }

  async findAll() {
    return await prisma.artists.findMany();
  }

  async findOne(id: string) {
    const requestedArtist: Artist = await prisma.artists.findUnique({
      where: { id },
    });
    if (!requestedArtist) throw new NotFoundException('Artist does not exist.');
    return requestedArtist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const processedArtist: Artist = await this.findOne(id);
    if (!processedArtist) throw new NotFoundException('Artist does not exist.');

    if ('grammy' in updateArtistDto) {
      processedArtist.grammy = updateArtistDto.grammy;
    }
    if ('name' in updateArtistDto) {
      processedArtist.name = updateArtistDto.name;
    }
    await prisma.artists.update({ where: { id: id }, data: processedArtist });

    return processedArtist;
  }

  async remove(id: string) {
    const processedArtist: Artist = await this.findOne(id);
    if (!processedArtist) throw new NotFoundException('Artist does not exist.');

    await prisma.artists.delete({ where: { id: id } });

    albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
    tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    removeFavFrom(favs.artists, id);
  }
}
