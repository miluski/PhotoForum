import { Comment } from '../types/comment';
import { User } from '../types/user';

export interface PhotoDto {
  id: number;
  path: string;
  userDto: User;
  likesCount: number;
  commentDtos: Comment[];
}
