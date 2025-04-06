import { Comment } from "./comment";
import { User } from "./user";

export interface Photo {
  id: string;
  path: string;
  userDto: User;
  likesCount: number;
  commentDtos: Comment[];
}

export interface UploadPhoto {
  path: string;
}
