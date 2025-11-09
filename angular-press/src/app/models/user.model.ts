export interface User {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'administrator' | 'editor' | 'author' | 'subscriber';
  dateCreated: Date;
  lastLogin?: Date;
  isActive: boolean;
  avatar?: string;
  bio?: string;
}