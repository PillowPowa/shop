import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto, LoginDto } from '../dto';
import { TokenService } from './token.service';
import { userSelect } from '../prisma.partials';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly token: TokenService,
  ) {}
  public async register(dto: CreateUserDto) {
    const { name, email, password } = dto;
    const userData = await this.prisma.user.findFirst({
      where: { OR: [{ name }, { email }] },
    });
    if (userData) {
      throw new BadRequestException(
        'A user with that name or email already exists',
      );
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: await hash(password),
      },
    });

    const tokens = await this.token.generate(user.id);
    return { user, ...tokens };
  }
  public async refresh(refreshToken: string) {
    const userId = await this.token.validate(refreshToken);
    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    const tokens = await this.token.generate(userId);
    return { user: userData, ...tokens };
  }
  public async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.token.generate(user.id);
    return { user, ...tokens };
  }
  private async validateUser({ email, name, password }: LoginDto) {
    const userData = await this.prisma.user.findFirst({
      where: { OR: [{ name }, { email }] },
    });

    if (!userData) {
      throw new NotFoundException('User not found!');
    }

    const isPasswordValid = await verify(userData.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // TEMP =(
    delete userData.password;
    return userData;
  }
}
