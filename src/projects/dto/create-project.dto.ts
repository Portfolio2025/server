import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    type: string

    @IsString()
    @IsNotEmpty()
    link: string

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsNotEmpty()
    technologies: string[];
}

export class AddImageDto{
    projectImagePath: string;
}