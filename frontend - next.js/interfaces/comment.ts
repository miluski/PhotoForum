import { User } from "./user";

export interface Comment {
  content: string;
  date: string;
  userDto: User;
}
