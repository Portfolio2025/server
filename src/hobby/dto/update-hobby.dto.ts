import { PartialType } from '@nestjs/mapped-types';
import { CreateContentTextDto, CreateHobbyDto, CreateHobbySectionDto, CreateSectionContentDto, CreateSectionImagesDto } from './create-hobby.dto';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ContentType } from '../entities/hobby.entity';

export class UpdateHobbyDto extends PartialType(CreateHobbyDto) {
}

export class UpdateSectionContentDto {
    @IsNotEmpty()
    @IsNumber()
    sectionId: number

    @IsNotEmpty()
    contentId: number

    @IsNotEmpty()
    @IsEnum(ContentType)
    contentType: ContentType

    @IsNotEmpty()
    @IsArray()
    details: { id?: number, text: string }[]

    @IsNumber()
    order?: number
}