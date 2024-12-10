import { IsAlpha, IsEnum, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ContentType } from '../entities/hobby.entity';

export class CreateHobbyDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    explanation: string
}

export class CreateHobbySectionDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNumber()
    order?: number
}

export class CreateSectionContentDto {
    @IsNotEmpty()
    @IsEnum(ContentType)
    type: ContentType

    @IsNumber()
    order?: number

    @IsNotEmpty()
    @IsNumber()
    sectionId: number
}

export class CreateContentTextDto {
    @IsNotEmpty()
    @IsString()
    text: string

    @IsNumber()
    order?: number

    @IsNotEmpty()
    @IsNumber()
    contentId: number
}

export class CreateSectionImagesDto {
    @IsNotEmpty()
    @IsAlpha()
    path: string

    @IsNotEmpty()
    @IsNumber()
    sectionId: number
}