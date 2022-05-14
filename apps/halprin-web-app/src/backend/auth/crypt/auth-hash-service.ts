import { compare, hash } from 'bcryptjs';

export class AuthHashService {
  static readonly defaultSalt = 10;

  constructor(private salt: number | string = AuthHashService.defaultSalt) {}

  hashPassword = (password: string): Promise<string> => {
    return hash(password, this.salt);
  };

  comparePasswords = async (
    password: string,
    hashed: string
  ): Promise<boolean> => {
    return compare(password, hashed);
  };
}
