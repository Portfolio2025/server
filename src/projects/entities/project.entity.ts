import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    projectName: string

    @Column({
        type: "text"
    })
    projectLink: string

    @Column({
        type: "text",
        nullable: true,
    })
    description: string;

    @Column({
        type: "simple-array",
        nullable: true,
    })
    technologies: string[];

    @Column()
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
