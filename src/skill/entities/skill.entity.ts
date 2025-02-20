import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SkillGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: 0 })
    order: number;

    @OneToMany(() => Skill, skills => skills.group, { cascade: true })
    skills: Skill[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity()
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    explanation: string

    @Column()
    skill_point: number

    @OneToMany(() => SkillProjectLink, links => links.skill, { cascade: true })
    links: SkillProjectLink[];

    @ManyToOne(() => SkillGroup, group => group.skills, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'skill_group_id' })
    group: SkillGroup;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
@Entity()
export class SkillProjectLink {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    link: string

    @ManyToOne(() => Skill, skill => skill.links, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'skill_id' })
    skill: Skill;
}