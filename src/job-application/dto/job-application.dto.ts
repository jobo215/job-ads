import { IsNumber } from "class-validator";

export class JobApplicationDTO {

    @IsNumber()
    workerID: number;

    @IsNumber()
    adID: number;

}