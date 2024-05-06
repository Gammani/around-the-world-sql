import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailManager {
  constructor(private configService: ConfigService) {}
  async sendEmail(email: string, subject: string, message: string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'), // generated ethereal user
        pass: this.configService.get('EMAIL_PASS'), // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transport.sendMail({
      from: 'Moroz comparation <shtucer343test@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      // text: "Hello world?", // plain text body
      html: message, // html body
    });

    return info;
  }
}
