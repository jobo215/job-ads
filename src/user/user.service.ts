import { ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {

    private bcrypt = require('bcrypt');

    constructor(@InjectRepository(User) private repository: Repository<User>) {}

    private hashPassword(password: String): string {
        const salt = this.bcrypt.genSaltSync(10);
        return this.bcrypt.hashSync(password, salt);
    }

    async createUser(firstName: string, lastName: string, email: string, password: string, role: string): Promise<User> {
        const userExists = await this.repository.findOneBy({ email });
        console.log(password);
        if(!userExists) {
            const hashedPassword = this.hashPassword(password);
            const user = await this.repository.save({ firstName, lastName, email, password: hashedPassword, role });
            return this.repository.save(user);
        } else {
            throw new ConflictException();
        }
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.repository.findOneBy({ id });
        if(user) {
            await this.repository.delete({ id });
            throw new HttpException('User deleted successfuly!', HttpStatus.OK);
        } else {
            throw new NotFoundException();
        }
    }

    async signIn(email: string, password: string): Promise<User> {
        const user = await this.repository.findOneBy({ email });
        if(!user) {
            throw new ForbiddenException();
        }
        this.bcrypt.compare(password, user.password, (err: any, result: boolean) => {
            if(!result) {
                throw new ForbiddenException();
            }
        });
        return user;
    } 

    getUserById(id: number): Promise<User> {
        if(!id) {
            return null;
        }
        return this.repository.findOneBy({ id });
    }

    async setProfileImage(profileImage: string, id: number): Promise<any> {
        if(!id) {
            throw new UnauthorizedException();
        }
        return this.repository.update({ id }, { profileImage });
    }

    updateUserData(id: number, firstName: string, lastName: string, email: string): Promise<any> {
        return this.repository.update({ id }, { firstName, lastName, email});
    }

    changePassword(id: number, password: string) {
        const hashedPassword = this.hashPassword(password);
        return this.repository.update({ id }, { password: hashedPassword });
    }

}
