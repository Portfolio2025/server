import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ContentType {
    list = "list",
    text = "text",
}

@Entity('hobbies')
export class Hobby {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    name: string;

    @Column({ nullable: true, type: 'text' })
    explanation: string

    @Column({
        default: 0
    })
    order: number

    @OneToMany(() => Section, section => section.hobby, { cascade: true })
    sections: Section[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('sections')
export class Section {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: 0 })
    order: number

    @ManyToOne(() => Hobby, hobby => hobby.sections, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hobby_id' })
    hobby: Hobby;

    @OneToMany(() => Content, content => content.section, { cascade: true })
    content: Content[];

    @OneToMany(() => Picture, picture => picture.section, { cascade: true })
    pictures: Picture[]; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('content')
export class Content {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ContentType,
        default: ContentType.text,
    })
    type: ContentType;

    @Column({ default: 0 })
    order: number

    @ManyToOne(() => Section, section => section.content, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'section_id' })
    section: Section;

    @OneToMany(() => TextBlock, text => text.content, { cascade: true })
    details: TextBlock[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('texts')
export class TextBlock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"text"})
    text: string;

    @Column({ default: 0 })
    order: number

    @ManyToOne(() => Content, content => content.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'content_id' })
    content: Content;
}

@Entity('pictures')
export class Picture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @ManyToOne(() => Section, hobbySection => hobbySection.pictures, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'section_id' })
    section: Section;
}
