const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = `Omar Essam <${process.env.EMAIL_FROM}>`;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //sendgrid
      return this.url;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //
  async send(subject, emailText) {
    //2) define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: emailText,
    };

    //3)create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    let emailText = `Welcome ${this.firstName} to our website, we glad to see you \n go to ${this.url}`;
    await this.send('Welcome to Our Website', emailText);
  }

  async resetPassword() {
    let emailText = `Welcome ${this.firstName} \ngo to: ${this.url} \nto reset your password`;
    await this.send('Reset Your Password', emailText);
  }
};
