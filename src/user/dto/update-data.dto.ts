import { IsString, IsEmail } from 'class-validator';

export class UpdateDataDTO {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

}