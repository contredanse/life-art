import { PrismaClientDbMain } from '@contredanse/db-main';
import {
  AuthError,
  AuthErrorReason,
  AuthResult,
  AuthServiceInterface,
} from '@/backend/auth/auth-service.interface';
import { AuthHashService } from '@/backend/auth/crypt/auth-hash-service';

export class AuthServiceDb implements AuthServiceInterface {
  private hashService: AuthHashService;

  constructor(private prisma: PrismaClientDbMain) {
    this.hashService = new AuthHashService();
  }

  authenticate = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: { password: true, id: true, email: true },
    });
    if (user === null) {
      return this.createError('USER_NOT_FOUND');
    }
    if (user.password === null) {
      return this.createError('USER_NO_PASSWORD_EXIST');
    }

    const passOk = await this.hashService.comparePasswords(
      password,
      user.password
    );

    if (passOk) {
      return {
        success: true,
        user: {
          userId: user.id,
          email: user.email,
        },
      };
    } else {
      return this.createError('PASSWORD_INVALID');
    }
  };

  private createError = (authErrorReason: AuthErrorReason): AuthError => {
    return {
      success: false,
      reason: authErrorReason,
    };
  };
}
