export interface User {
  name: string;
  surname: string;
  login: string;
  avatarPath?: string;
}

export interface EditUser {
  login?: string;
  password?: string;
  name?: string;
  surname?: string;
  avatarPath?: string;
}
