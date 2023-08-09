import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as PDFKit from 'pdfkit';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'email-smtp.us-east-2.amazonaws.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'AKIA2ELD3VL2VJSJMQ67',
        pass: 'BDBMjPovYWZAmIL4m60jkN+vO8UIqozdRjP7Y8ImN5D+',
      },
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
      from: 'chatis@afrointelligence.com', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: 'Please find the attached PDF.', // plain text body
      attachments: [
        {
          filename: 'attachment.pdf',
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
