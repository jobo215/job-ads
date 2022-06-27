import { IsString, IsEmail } from 'class-validator';

export class CreateUserDTO {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    role: string;

}