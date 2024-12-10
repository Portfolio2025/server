import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ContactsType {
    text = "text",
    link = "link"
}

@Entity()
export class Contacts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({
        type: 'enum',
        enum: ContactsType,
        default: ContactsType.text,
        nullable: false
    })
    type: ContactsType

    @Column({ type: "text", nullable: false })
    link: string;

    @Column({ type: "text", nullable: false })
    icon: string;

    @Column({ default: 0 })
    order: number

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
