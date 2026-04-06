import { IsString, IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password!: string;

    @IsString()
    role?: UserRole.VIEWER;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    ANALYST = 'ANALYST',
    VIEWER = 'VIEWER',
}