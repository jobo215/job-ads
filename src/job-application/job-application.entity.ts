import { Ad } from 'src/ad/ad.entity';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class JobApplication {

    @PrimaryGeneratedColumn()
    jobApplicationID: number;

    @ManyToOne(type => User, workerID => workerID.id)
    workerID: User;

    @ManyToOne(type => Ad, employerID => employerID.adID)
    adID: Ad;

}