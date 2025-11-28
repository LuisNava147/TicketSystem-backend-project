import { Injectable, UnauthorizedException,BadRequestException,NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService 
  ){}

    async register(createUserDto:CreateUserDto){
      const {userPassword, ...userData} = createUserDto
      const hashedPassword = bcrypt.hashSync(userPassword,10);
      const userTocreate = {
        ...userData,
        userPassword: hashedPassword,
        roles: userData.roles || ['Client']
      };
      try{
        const user = await this.usersService.create(userTocreate as CreateUserDto);
        return user;
      }catch(error){
        throw error;
      }
    }

    async login(loginDto: LoginDto){
      const {userEmail, userPassword} = loginDto;

      if(!userPassword){
        throw new BadRequestException('La contraseña es obligatoria');
      }

      const user = await this.usersService.findOneByEmail(userEmail)
      if(!user){
        throw new UnauthorizedException('Credenciales inválidas (Email)');
      }

      const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword)
      if(!isPasswordValid){
        throw new UnauthorizedException('Credenciales invalidas(Password)');
      }
      const payload = {sub: user.userId, email: user.userEmail, roles: user.roles};
      return{
        access_token: await this.jwtService.signAsync(payload),
        user:{
          id: user.userId,
          email: user.userEmail,
          fullName: user.userFullName
        }
      }

    }
  }
