import { IsString } from 'class-validator'

export class ChangePasswordDTO {

    @IsString()
    password: string;

}