import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository, Like } from 'typeorm';
import { Ad } from './ad.entity';

@Injectable()
export class AdService {

    constructor(@InjectRepository(Ad) private repository: Repository<Ad>, private userService: UserService) {}

    private getUser(id: number): Promise<User> {
        return this.userService.getUserById(id);
    }
    
    async createAd(title: string, description: string, category: string, subcategory: string, employerID: number): Promise<Ad> {
        const user = await this.getUser(employerID);
        const ad = this.repository.create({ title, description, category, subcategory, employerID: user });
        return this.repository.save(ad);
    }

    async getAdsByEmployerId(employerID: number): Promise<Ad[]> {
        const user = await this.getUser(employerID);
        return this.repository.findBy({ employerID: user });
    }
    
    getAdById(adID: number): Promise<Ad> {
        return this.repository.findOneBy({ adID });
    }

    async deleteAd(adID: number): Promise<void> {
        const ad = await this.repository.findOneBy({ adID });
        if(!ad) {
            throw new NotFoundException();
        }
        this.repository.delete(ad);
        throw new HttpException('Ad deleted successfully!', HttpStatus.OK);
    }

    async increaseLike(adID: number): Promise<Object> {
        const ad = await this.repository.findOneBy({ adID });
        let newLikeNum = ad.likes + 1;
        this.repository.update({ adID }, { likes: newLikeNum });
        return { adID, 'likes' : newLikeNum };
    }

    async getCategories(): Promise<any []> {
        const ads = await this.repository.find({});
        let categories = [];
        for(let ad of ads) {
            if(!categories.includes(ad.category)) {
                categories.push(ad.category);
            }
        }
        return categories;
    }

    async getAdsByCategory(category: string): Promise<any []> {
        const ads = await this.repository.findBy({ category});
        console.log(ads);
        return ads;
    }

    async getAdsByTitle(title: string): Promise<any []> {
        const ads = await this.repository.find({});
        let selectedAds = []
        for(let ad of ads) {
            if(ad.title.toLowerCase().includes(title.toLowerCase())){
                selectedAds.push(ad);
            }
        }
        return selectedAds;
    }

    async changeRemote(adID: number): Promise<Ad> {
        const ad = await this.repository.findOneBy({ adID });
        if(!ad) {
            throw new NotFoundException();
        }
        const isAffected =  (await this.repository.update({ adID }, { remote: !ad.remote })).affected;
        if(isAffected === 1) {
            return this.repository.findOneBy({ adID });
        }
    }

    getAdsByRemote(remote: boolean): Promise<Ad[]> {
        return this.repository.findBy({ remote });
    }

}
