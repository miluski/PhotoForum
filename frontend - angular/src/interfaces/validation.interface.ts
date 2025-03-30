import { User } from '../types/user';

export interface ValidationInterface {
  user: User;
  validateUserObject: () => boolean;
}
