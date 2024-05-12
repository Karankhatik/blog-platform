import bcrypt from 'bcryptjs';


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
  generateOTP,
  encryptPassword,
  decryptPassword
};
