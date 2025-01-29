import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    slug: string

    @Column()
    type: string

    @Column()
    link: string

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

    @OneToMany(() => ProjectImage, img => img.project, { cascade: true })
    imgs: ProjectImage[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}


@Entity('projects_images')
export class ProjectImage {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "text"
    })
    imgPath: string

    @ManyToOne(() => Project, project => project.imgs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;
} 