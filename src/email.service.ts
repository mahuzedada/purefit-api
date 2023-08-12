import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as PDFKit from 'pdfkit';
import env from './env';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: env.email,
    });
  }

  private generatePDF(text: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFKit();
      const chunks: Uint8Array[] = [];

      doc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      doc.on('error', reject);

      doc.text(text);
      doc.end();
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const pdfBuffer = await this.generatePDF(text);

    const mailOptions = {
      from: 'admin@procamp.dev',
      to: to,
      subject: subject,
      text: 'Please find the attached PDF.',
      attachments: [
        {
          filename: 'MealPlan.pdf',
          content: pdfBuffer,
        },
      ],
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
