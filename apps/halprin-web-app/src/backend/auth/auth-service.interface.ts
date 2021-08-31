export type AuthUserInfo = {
  userId: number;
  email: string;
};

export type AuthSuccess = {
  success: true;
  user: AuthUserInfo;
};

export type AuthErrorReason =
  | 'USER_NOT_FOUND'
  | 'PASSWORD_INVALID'
  | 'USER_NO_PASSWORD_EXIST'
  | 'SYSTEM_ERROR';

export type AuthError = {
  success: false;
  reason: AuthErrorReason;
};

export type AuthResult = AuthSuccess | AuthError;

export interface AuthServiceInterface {
  authenticate(email: string, password: string): Promise<AuthResult>;
}
