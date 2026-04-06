import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

    // Validate user credentials and return user data if valid
    async validateUser(email: string, password: string) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (user && await bcrypt.compare(password, user.passwordHash)) {
            const { passwordHash: _, ...result } = user;
            return result;
        }
        return null;
    }

    // Register a new user and return the user data along with an access token
    async register(registerUserDto: RegisterUserDto) {
        // Implemented registration logic here
        const { name, email, password, role } = registerUserDto;


        // Check if the user already exists
        const existingUser = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { message: 'User with this email already exists. Please login instead.' };
        }

        // Hash the password before saving to the database
        const saultRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saultRounds);


        // Save the user to the database
        const user = await this.prismaService.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role,
            },
        });

        const payload = { sub: user.id, role: user.role };

        const token = await this.jwtService.signAsync(
            payload,
            {
                secret: process.env.JWT_SECRET_KEY,
                expiresIn: '1h'
            }
        );

        console.log("User Token : ", token);

        const { passwordHash: _, ...result } = user;
        return { ...result, accessToken: token };
    }


    // Validate user credentials and return an access token if valid
    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload = { sub: user.id, role: user.role };
        const token = await this.jwtService.signAsync(
            payload,
            {
                secret: process.env.JWT_SECRET_KEY,
                expiresIn: '1h'
            }
        );
        return token;
    }

    async getUserById(userId: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        return user;
    }

}
