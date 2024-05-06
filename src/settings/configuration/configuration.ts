import * as process from 'process';

export const getConfiguration = () => ({
  BlABLA: process.env.BLABLA,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ADMIN_LOGIN: process.env.ADMIN_LOGIN,
  ADMIN_PASS: process.env.ADMIN_PASS,
});
