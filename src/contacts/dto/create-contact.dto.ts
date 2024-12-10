import { IsAlphanumeric, IsEnum, IsNotEmpty, IsNumber, Matches } from "class-validator";
import { ContactsType } from "../entities/contact.entity";

export class CreateContactDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    title: string;

    @IsNotEmpty()
    @IsEnum(ContactsType)
    type: ContactsType;

    @IsNotEmpty()
    @Matches(/^[\w.+\-@:/]+$/, { message: "Invalid format for link or value" })
    link:string

    @IsNumber()
    order:number
}
