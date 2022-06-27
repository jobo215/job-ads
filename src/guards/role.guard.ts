import { CanActivate, ExecutionContext, mixin, Type } from "@nestjs/common";

export const RoleGuard = (role: string): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
      canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const currentRole = request.session.role;
        if(currentRole !== role) {
            return false;
        }
        return true;
      }
    }
   
    return mixin(RoleGuardMixin);
}
