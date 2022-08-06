import { UserModel } from '../models/user';

export interface IUserRepository {
  create(user: UserModel): Promise<UserModel>;
  findOneByEmail(email: string): Promise<UserModel | null>;
  exists(email: string): Promise<boolean>;
}
