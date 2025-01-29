import { IsAlpha, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ContentType } from '../entities/hobby.entity';

// DTO for creating a hobby
export class CreateHobbyDto {
    @IsNotEmpty() // Ensures the name is not empty
    @IsString() // Ensures the name is a string
    name: string

    @IsNotEmpty() // Ensures the explanation is not empty
    @IsString() // Ensures the explanation is a string
    explanation: string
}

// DTO for creating a hobby section
export class CreateHobbySectionDto {
    @IsNotEmpty() // Ensures the title is not empty
    @IsString() // Ensures the title is a string
    title: string

    @IsOptional()
    @IsNumber() // Ensures the order is a number
    order?: number
}

// DTO for creating section content
export class CreateSectionContentDto {
    @IsNotEmpty() // Ensures the type is not empty
    @IsEnum(ContentType) // Ensures the type is a valid enum value
    type: ContentType

    @IsOptional()
    @IsNumber() // Ensures the order is a number
    order?: number

    @IsNotEmpty() // Ensures the sectionId is not empty
    @IsNumber() // Ensures the sectionId is a number
    sectionId: number
}

// DTO for creating content text
export class CreateContentTextDto {
    @IsNotEmpty() // Ensures the text is not empty
    @IsString() // Ensures the text is a string
    text: string

    @IsOptional()
    @IsNumber() // Ensures the order is a number
    order?: number

    @IsNotEmpty() // Ensures the contentId is not empty
    @IsNumber() // Ensures the contentId is a number
    contentId: number
}

// DTO for creating section images
export class CreateSectionImagesDto {
    @IsNotEmpty() // Ensures the path is not empty
    @IsAlpha() // Ensures the path contains only alphabetic characters
    path: string

    @IsNotEmpty() // Ensures the sectionId is not empty
    @IsNumber() // Ensures the sectionId is a number
    sectionId: number
}