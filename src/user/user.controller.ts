import { Controller, Post, Body, Delete, Param, Session, Get, UseInterceptors, UseGuards, UploadedFile, Req, HttpException, HttpStatus, Put } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateUserDTO } from './dto/createUser.dto';
import { SignInDTO } from './dto/sign-in.dto';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { UserSerialize } from '../interceptors/user.interceptor';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { editFileName } from './utils/file-upload.utils';
import { RoleGuard } from '../guards/role.guard';
import { Role } from './roles.enum';
import { UpdateDataDTO } from './dto/update-data.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';

@Controller('user')
@UserSerialize(UserDTO)
@UseInterceptors(CurrentUserInterceptor)
export class UserController {

    constructor(private service: UserService) {}

    @Post('/register')
    async createUser(@Body() body: CreateUserDTO): Promise<User>  {
        const { firstName, lastName, email, password, role } = body;
        return this.service.createUser(firstName, lastName, email, password, role);
    }

    @Delete('/:id')
    @UseGuards(RoleGuard(Role.Admin))
    deleteUser(@Param('id') id: number): Promise<void> {
        return this.service.deleteUser(id);
    }

    @Post('/login')
    async signIn(@Body() body: SignInDTO, @Session() session: any): Promise<User> {
        const { email, password } = body;
        const user = await this.service.signIn(email, password);
        session.userID = user.id;
        session.role = user.role;
        return user;
    }

    @Get('/me')
    @UseGuards(AuthGuard)
    getMyData(@CurrentUser() user: User): User {
        return user;
    }

    @Post('/logout')
    logout(@Session() session: any): void {
        session.userID = null;
        session.role = null;
    }
    
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: editFileName,
        })
    }))
    @UseGuards(AuthGuard)
    @Post('/upload-image')
    async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Session() session: any): Promise<void> {
        const profileImage = file.filename;
        const id = session.userID;
        const functionResponse = await this.service.setProfileImage(profileImage, id);
        if(functionResponse.affected === 1) {
            throw new HttpException('Profile image updated successfully!', HttpStatus.OK);
        } 
    }

    @Put('/update-data/:id')
    @UseGuards(AuthGuard)
    async updateUser(@Body() body: UpdateDataDTO, @Param('id') id: number) {
        const { firstName, lastName, email } = body;
        const functionResponse = await this.service.updateUserData(id, firstName, lastName, email);
        if(functionResponse.affected === 1) {
            throw new HttpException('User data changed successfully!', HttpStatus.OK);
        }
    }

    @Put('/change-password/:id')
    @UseGuards(AuthGuard)
    async changePassword(@Body() body: ChangePasswordDTO, @Param('id') id: number) {
        const { password } = body;
        const functionResponse = await this.service.changePassword(id, password);
        if(functionResponse.affected === 1) {
            throw new HttpException('Password changed successfully!', HttpStatus.OK);
        } 
    }

    @Get('/:id')
    getUserById(@Param('id') id: number) {
        return this.service.getUserById(id);
    }

}
