interface UserInfoType {
  id: number;
  account: string;
  username?: string;
  email?: string;
  auth: number;
}

declare global {
  namespace Express {
    export interface Request {
      user: UserInfoType;
    }
  }
}

export {};
