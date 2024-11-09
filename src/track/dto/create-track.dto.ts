import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @ValidateIf((obj, val) => val !== null)
  artistId: string | null;

  @IsUUID()
  @ValidateIf((obj, val) => val !== null)
  albumId: string | null;

  @IsNumber()
  @IsPositive()
  duration: number;
}
