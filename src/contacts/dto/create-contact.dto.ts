import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ContactsType } from "../entities/contact.entity";
import { Transform } from "class-transformer";

// Data Transfer Object for creating a contact
export class CreateContactDto {

    // Type of the contact, must be a valid enum value from ContactsType
    @IsNotEmpty()
    @IsEnum(ContactsType)
    type: ContactsType;

    // Link or value of the contact, must match the specified regex pattern
    @IsNotEmpty()
    link: string;

    // Order of the contact, must be a number
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
    order?: number;
}
