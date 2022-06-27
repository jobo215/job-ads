import { Body, Controller, Delete, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoleGuard } from 'src/guards/role.guard';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { Role } from 'src/user/roles.enum';
import { Ad } from './ad.entity';
import { AdService } from './ad.service';
import { CategoryDTO } from './dto/category.dto';
import { CreateAdDTO } from './dto/create-ad.dto';

@Controller('ad')
@UseInterceptors(CurrentUserInterceptor)
export class AdController {

    constructor(private service: AdService) {}

    @Post('/create')
    @UseGuards(RoleGuard(Role.Employer))
    createAd(@Body() body: CreateAdDTO): Promise<Ad> {
        const { title, description, category, subcategory, employerID } = body;
        return this.service.createAd(title, description, category, subcategory, employerID);
    }

    @Get('/:id')
    getAdById(@Param('id') id: number): Promise<Ad> {
        return this.service.getAdById(id);
    }

    @Get('/employer/:id')
    getAdsByEmployerId(@Param('id') id: number): Promise<Ad []> {
        return this.service.getAdsByEmployerId(id);
    }

    @Delete('/:id')
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(RoleGuard(Role.Employer))
    deleteAd(@Param('id') id: number): Promise<void> {
        return this.service.deleteAd(id);
    }

    @Post('/like/:id')
    increaseLike(@Param('id') id: number): Promise<Object> {
        return this.service.increaseLike(id);
    }

    @Post('/categories')
    async getCategories(): Promise<Object> {
        const categories = await this.service.getCategories();
        return { categories };
    }

    @Post('/by-category')
    getAdsByCategory(@Body() body: CategoryDTO): Promise<any []> {
        return this.service.getAdsByCategory(body.category);
    }

    @Post('/:title')
    getAdsByTitle(@Param('title') title: string): Promise<any []> {
        return this.service.getAdsByTitle(title);
    }

    @Post('/change-remote/:id')
    @UseGuards(RoleGuard(Role.Employer))
    changeRemote(@Param('id') id: number): Promise<Ad> {
        return this.service.changeRemote(id);
    }

    @Post('/remote/:remote')
    getAdsByRemote(@Param('remote') remote: string): Promise<Ad []> {
        let boolRemote = remote === 'true' ? true : false;
        return this.service.getAdsByRemote(boolRemote);
    }

}
