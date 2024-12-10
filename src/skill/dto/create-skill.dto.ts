import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSkillGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string
}
export class CreateSkillDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    explanation: string

    @IsNotEmpty()
    @IsNumber()
    skill_point: number
}
export class CreateProjectLinkDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    link: string
}
