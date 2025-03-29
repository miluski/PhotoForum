import { User } from "./user";

export interface Photo {
  id: string;
  path: string;
  userDto: User;
  likesCount: number;
  commentDtos: any[];
}

export interface UploadPhoto {
  path: string;
}
