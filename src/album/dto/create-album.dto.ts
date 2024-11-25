import {
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  year: number;

  @IsUUID()
  @ValidateIf((obj, val) => val !== null)
  artistId: string | null;
}
