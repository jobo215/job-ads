import { IsString, IsNumber } from 'class-validator';

export class CreateAdDTO {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsString()
    subcategory: string;

    @IsNumber()
    employerID: number;

}