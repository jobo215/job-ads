import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdService } from 'src/ad/ad.service';
import { Role } from 'src/user/roles.enum';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { JobApplication } from './job-application.entity';

@Injectable()
export class JobApplicationService {

    constructor(@InjectRepository(JobApplication) private repository: Repository<JobApplication>, 
    private userService: UserService, private adService: AdService) {}

    async createJobApplication(workerID: number, adID: number): Promise<JobApplication> {
        const worker = await this.userService.getUserById(workerID);
        if(!worker || worker.role !== Role.Worker) {
            throw new NotFoundException('Worker not found!');
        }

        const ad = await this.adService.getAdById(adID);
        if(!ad) {
            throw new NotFoundException('Ad not found!');
        }

        return this.repository.save({ workerID: worker, adID: ad });
    }

    async getWorkersByAdId(adID: number): Promise<any []> {
        const ad = await this.adService.getAdById(adID);
        if(!ad) {
            throw new NotFoundException('Ad not found!');
        }
        const jobApplications = await this.repository.findBy({ adID: ad });
        let workers = [];
        for(let job of jobApplications) {
            workers.push(job.workerID);
        }
        return workers;
    }

    async getAdsByWorkerId(workerID: number): Promise<any []> {
        const worker = await this.userService.getUserById(workerID);
        if(!worker) {
            throw new NotFoundException('Worker not found!');
        }
        const jobApplication = await this.repository.findBy({ workerID: worker });
        let jobs = []
        for(let job of jobApplication) {
            jobs.push(job.adID);
        }
        return jobs;
    }

    async deleteJobApplication(workerID: number, adID: number): Promise<void> {
        const worker = await this.userService.getUserById(workerID);
        if(!worker) {
            throw new NotFoundException('Worker not found!');
        }
        
        const ad = await this.adService.getAdById(adID);
        if(!ad) {
            throw new NotFoundException('Ad not found!');
        }

        this.repository.delete({ workerID: worker, adID: ad });
        throw new HttpException('Job application deleted successfully!', HttpStatus.OK);
    }

    async getJobApplicationCount(adID: number): Promise<number> {
        const ad = await this.adService.getAdById(adID);
        return this.repository.count({ where: {adID: ad } });
    }

}
