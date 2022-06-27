import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/user/user.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    
    constructor(private userService: UserService) {}
    
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const { userID } = request.session || {};
        if(userID) {
            const user = await this.userService.getUserById(userID);
            request.currentUser = user;
        }
        return next.handle();
    }

}