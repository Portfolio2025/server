import { PartialType } from '@nestjs/mapped-types';
import { CreateContentTextDto, CreateHobbyDto, CreateHobbySectionDto, CreateSectionContentDto, CreateSectionImagesDto } from './create-hobby.dto';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ContentType } from '../entities/hobby.entity';

export class UpdateHobbyDto extends PartialType(CreateHobbyDto) { }
export class UpdateHobbySectionDto extends PartialType(CreateHobbySectionDto) { }

export class UpdateSectionContentDto {

    @IsNotEmpty()
    groupId: number

    @IsNotEmpty()
    @IsEnum(ContentType)
    contentType: ContentType

    @IsNotEmpty()
    @IsArray()
    details: { id?: number, text: string }[]

    @IsOptional()
    @IsNumber()
    order?: number
}