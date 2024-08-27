import { Request } from 'express'
import bcrypt from 'bcrypt';

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // You can adjust the number of salt rounds if needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare a password with a hashed password
export const compareHashPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};


interface User {
  name: string;
  email: string;
  // Add any other properties your user object has
}

export interface AuthenticatedRequest extends Request {
  user?: User; // or just `user: User;` if you know `user` will always be there
}
