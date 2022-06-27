import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Ad {

    @PrimaryGeneratedColumn()
    adID: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    subcategory: string;

    @ManyToOne(type => User, employerID => employerID.id)
    employerID: User;

    @Column({ default: 0 })
    likes: number;

    @Column({ default: false })
    remote: boolean;

}