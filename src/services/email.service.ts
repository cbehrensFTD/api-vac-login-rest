import nodemailer from "nodemailer";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!process.env.NODEMAILER_USER) {
      throw new Error("NODEMAILER_USER not found");
    }

    if (!process.env.NODEMAILER_PASS) {
      throw new Error("NODEMAILER_PASS not found");
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const emailService = new EmailService();
