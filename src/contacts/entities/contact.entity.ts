import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Enum for contact types
export enum ContactsType {
    text = "text",
    link = "link"
}

@Entity()
export class Contacts {
    @PrimaryGeneratedColumn()
    id: number; // Primary key

    @Column({
        type: 'enum',
        enum: ContactsType,
        default: ContactsType.text,
        nullable: false
    })
    type: ContactsType; // Type of the contact (text or link)

    @Column({ type: "text", nullable: false })
    label: string; // Link associated with the contact

    @Column({ type: "text", nullable: false })
    icon: string; // Icon associated with the contact

    @Column({ default: 0 })
    order: number; // Order of the contact

    @CreateDateColumn()
    createdAt: Date; // Timestamp of when the contact was created

    @UpdateDateColumn()
    updatedAt: Date; // Timestamp of when the contact was last updated
}
