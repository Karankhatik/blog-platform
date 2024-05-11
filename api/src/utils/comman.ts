import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

interface User {
  _id: string;
  email: string;
}

const generateJWTAccessToken = (user: User): string => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.TOKEN_SECRET as string
  );
}

const generateOTP = (): string => {
  const digits = '123456789';
  let otp = '';
  for (let i = 1; i <= 6; i++) {
    let index = Math.floor(Math.random() * digits.length);
    otp += digits[index];
  }
  return otp;
}

const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const decryptPassword = async (enteredPassword: string, userPassword: string): Promise<boolean> => {
  const result = await bcrypt.compare(enteredPassword, userPassword);
  return result;
};

export {
  generateJWTAccessToken,
  generateOTP,
  encryptPassword,
  decryptPassword
};
