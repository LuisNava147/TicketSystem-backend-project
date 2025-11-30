import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
    const requeridedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
        context.getHandler(),
        context.getClass(),
    ]);
    if(!requeridedRoles){
        return true;
    }
    const {user} = context.switchToHttp().getRequest();
    return requeridedRoles.some((role)=> user.roles?.includes(role));
    }
}