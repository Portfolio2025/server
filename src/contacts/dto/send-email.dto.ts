import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendEmailDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    phone: string

    @IsString()
    wish: string

    @IsNotEmpty()
    @IsString()
    projectType: string

    @IsNotEmpty()
    @IsString()
    budget: string
}
