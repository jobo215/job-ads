import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

export function UserSerialize(dto: any) {
    return UseInterceptors(new UserInterceptor(dto));
} 


export class UserInterceptor implements NestInterceptor {
    
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map((data: any) => {
            return plainToClass(this.dto, data, {
                excludeExtraneousValues: true,
            });
        }));
    };

}