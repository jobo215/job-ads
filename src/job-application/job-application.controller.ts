import { Body, Controller, Delete, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoleGuard } from 'src/guards/role.guard';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { Role } from 'src/user/roles.enum';
import { JobApplicationDTO } from './dto/job-application.dto';
import { JobApplicationService } from './job-application.service';

@Controller('job-application')
@UseInterceptors(CurrentUserInterceptor)
export class JobApplicationController {

    constructor(private service: JobApplicationService) {}

    @Post('/')
    @UseGuards(RoleGuard(Role.Worker))
    createJobApplication(@Body() body: JobApplicationDTO) {
        const { workerID, adID } = body;
        return this.service.createJobApplication(workerID, adID);
    }

    @Post('/ad/:id')
    @UseGuards(RoleGuard(Role.Employer))
    getWorkersByAdId(@Param('id') id: number): Promise<any []> {
        return this.service.getWorkersByAdId(id);
    }

    @Post('/worker/:id')
    @UseGuards(RoleGuard(Role.Worker))
    getAdsByWorkerID(@Param('id') id: number): Promise<any []> {
        return this.service.getAdsByWorkerId(id);
    }

    @Delete('/')
    @UseGuards(RoleGuard(Role.Worker))
    deleteJobApplication(@Body() body: JobApplicationDTO): Promise<void> {
        const { workerID, adID } = body;
        return this.service.deleteJobApplication(workerID, adID);
    }

    @Post('/appliance-number/:id')
    @UseGuards(RoleGuard(Role.Employer))
    getJobApplicationCount(@Param('id') id: number): Promise<number> {
        return this.service.getJobApplicationCount(id);
    }

}
