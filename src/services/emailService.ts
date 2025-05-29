import transporter from '../config/email';

/**
 * Email service
 * Handles all email sending functionality
 */
export class EmailService {
  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string, username: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Blog App!</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>Thank you for registering with Blog App. To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This verification link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>If you didn't create an account with Blog App, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Verify Your Email - Blog App', htmlContent);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, username: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>We received a request to reset your password for your Blog App account. Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>For security reasons, this link will only work once.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Reset Your Password - Blog App', htmlContent);
  }

  /**
   * Send welcome email after verification
   */
  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Blog App</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Blog App!</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>Your email has been successfully verified! You can now:</p>
            <ul>
              <li>Create and publish blog posts</li>
              <li>Comment on other posts</li>
              <li>Manage your profile</li>
              <li>Connect with other bloggers</li>
            </ul>
            <p>Start sharing your thoughts and ideas with the world!</p>
          </div>
          <div class="footer">
            <p>Happy blogging!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, 'Welcome to Blog App!', htmlContent);
  }

  /**
   * Send email notification for new comment
   */
  async sendCommentNotification(
    authorEmail: string,
    authorName: string,
    postTitle: string,
    commenterName: string,
    commentContent: string
  ): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Comment on Your Post</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .comment { background: white; padding: 15px; border-left: 4px solid #17a2b8; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Comment on Your Post</h1>
          </div>
          <div class="content">
            <h2>Hi ${authorName},</h2>
            <p><strong>${commenterName}</strong> left a comment on your post "<strong>${postTitle}</strong>":</p>
            <div class="comment">
              <p>${commentContent}</p>
            </div>
            <p>Log in to your account to view and respond to this comment.</p>
          </div>
          <div class="footer">
            <p>Keep the conversation going!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(authorEmail, 'New Comment on Your Post - Blog App', htmlContent);
  }

  /**
   * Generic email sending method
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: `"Blog App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`✅ Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error(`❌ Error sending email to ${to}:`, error);
      throw new Error('Failed to send email');
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();