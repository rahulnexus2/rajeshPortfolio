import nodemailer from 'nodemailer';

export const sendContactNotification = async ({ name, email, subject, message }) => {
  const mailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const mailPort = parseInt(process.env.EMAIL_PORT || '587');
  const mailUser = process.env.EMAIL_USER;
  const mailPass = process.env.EMAIL_PASS;
  const mailTo = process.env.EMAIL_TO || mailUser;

  // Check if email configuration variables are present
  if (!mailUser || !mailPass) {
    console.warn('Nodemailer warning: EMAIL_USER and EMAIL_PASS environment variables are not configured.');
    console.warn('Mail notification skipped. Inquiries will still be saved to the database.');
    return { sent: false, reason: 'unconfigured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailPort === 465, // True for port 465, false for other ports
      auth: {
        user: mailUser,
        pass: mailPass
      }
    });

    const mailOptions = {
      from: `"Portfolio CMS Alert" <${mailUser}>`,
      to: mailTo,
      replyTo: email,
      subject: `⚡ Portfolio Contact: ${subject || 'New Message'}`,
      text: `You received a new message from ${name} (${email}):\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
          <h2 style="color: #4f46e5; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">⚡ New Portfolio Message</h2>
          <p style="font-size: 14px; color: #475569;">You have received a new contact submission from your portfolio site.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #334155; width: 100px;">Sender Name:</td>
              <td style="padding: 8px 0; color: #475569;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #334155;">Email Address:</td>
              <td style="padding: 8px 0; color: #475569;"><a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #334155;">Subject:</td>
              <td style="padding: 8px 0; color: #475569;">${subject || 'No Subject Provided'}</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; padding: 15px; border-radius: 8px; background-color: #ffffff; border: 1px solid #cbd5e1;">
            <h4 style="margin: 0 0 10px 0; color: #334155;">Message Content:</h4>
            <p style="margin: 0; color: #475569; line-height: 1.5; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            This email was sent automatically by the Rajesh Rautela Portfolio CMS backend server.
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email message sent successfully: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Nodemailer error: Failed to send notification email: ${error.message}`);
    return { sent: false, error: error.message };
  }
};
