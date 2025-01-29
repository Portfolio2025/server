import { group } from 'console';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Enum for content types
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

    // One-to-many relationship with Section
    @OneToMany(() => Section, section => section.hobby, { cascade: true })
    sections: Section[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('hobby_sections')
export class Section {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: 0 })
    order: number

    // Many-to-one relationship with Hobby
    @ManyToOne(() => Hobby, hobby => hobby.sections, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hobby_id' })
    hobby: Hobby;

    // One-to-many relationship with Content
    @OneToMany(() => TextGroups, group => group.section, { cascade: true })
    content: TextGroups[];

    // One-to-many relationship with Picture
    @OneToMany(() => Picture, picture => picture.section, { cascade: true })
    pictures: Picture[]; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('text_groups')
export class TextGroups {
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

    // Many-to-one relationship with Section
    @ManyToOne(() => Section, section => section.content, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'section_id' })
    section: Section;

    // One-to-many relationship with TextBlock
    @OneToMany(() => TextBlock, text => text.content, { cascade: true })
    details: TextBlock[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('group_text')
export class TextBlock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"text"})
    text: string;

    @Column({ default: 0 })
    order: number

    // Many-to-one relationship with Content
    @ManyToOne(() => TextGroups, group => group.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'details_id' })
    content: TextGroups;
}

@Entity('section_pictures')
export class Picture {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    path: string;

    // Many-to-one relationship with Section
    @ManyToOne(() => Section, hobbySection => hobbySection.pictures, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'section_id' })
    section: Section;
}
