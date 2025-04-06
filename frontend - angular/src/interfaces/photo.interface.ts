import { Comment } from '../types/comment';
import { User } from '../types/user';
import { PhotoDto } from './photodto.interface';

export interface Photo extends PhotoDto {
  author: User;
  comments: Comment[];
}
