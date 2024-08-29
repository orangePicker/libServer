import { config } from 'dotenv';

export const objToString = (obj: object) => JSON.stringify(obj);

export const filterObject = (obj: object) => {
  const data = {};
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (obj[key] || obj[key] === 0) {
      data[key] = obj[key];
    }
  });
  return data;
};

export const serviceReturn = (
  message: string = '',
  success: boolean = false,
  data?: any,
): { message: string; success: boolean; data?: any } => {
  return {
    message,
    success,
    data,
  };
};

export const myEnv = config().parsed;
