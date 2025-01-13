import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {

    @IsString()
    @IsNotEmpty()
    projectName: string

    @IsString()
    @IsNotEmpty()
    projectLink: string

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsNotEmpty()
    technologies: string[];

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}
