import path from "path";
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  template: string;
  context: {
    title: string;
    callbackUrl: string;
  };
}


const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: '',
      pass: ''
  }
});
export const sendEmail =  async (recipient:string, url:string)=>{
  // const response = await client.transmissions.send({
  //   options: {
  //     sandbox: true
  //   },
  //   content: {
  //     from: 'testing@sparkpostbox.com',
  //     subject: 'Confirm Email',
  //     html:`<html>
  //           <body>
  //           <p>Testing SparkPost - the world\'s most awesomest email service!</p>
  //           <a href="${url}">confirm email</a>
  //           </body>
  //           </html>`
  //   },
  //   recipients: [
  //     {address: recipient}
  //   ]
  // })

  // console.log(response)


  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, '../views'), 
      defaultLayout: '', 
    },
    viewPath: path.resolve(__dirname, '../views'), 
    extName: ".handlebars",
  };
  
  transporter.use('compile', hbs(handlebarOptions));
  
  const mailOptions: MailOptions = {
    from: 'allanhipolito66@gmail.com',
    to: recipient,
    subject: 'Confirm you email now',
    template: 'email',
    context: {
      title: `The ${recipient} need to be confirmed`,
      callbackUrl: url
    }
  };
  
  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}