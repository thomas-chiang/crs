const nodemailer = require("nodemailer");
require("dotenv").config()

class EmailService {
    constructor(config){
        const { clientUrl, emailFromAddress, applicationName } = config;
        const transport = nodemailer.createTransport({
            service: process.env.NODE_MAILER_SERVICE,
            auth: {
                user: process.env.EMAIL_FROM_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        this.transport = transport
        this.clientUrl = clientUrl
        this.emailFromAddress = emailFromAddress
        this.applicationName = applicationName
    }

    async sendEmail(email) {
        try {
            await this.transport.sendMail(email, function(error, info) {
                if (error) {
                  throw error;
                } else {
                  console.log('Email successfully sent!');
                  
                }
            });
            
        } catch (error) {
            console.error(`Errors with email occured: ${String(error)}`)
            const errors = error?.response?.body?.errors

            return { status: 400, email, error: errors || [error]}
        }
    
    }

    constructPasswordResetUrl(resetToken){
        return `${this.clientUrl}/password-reset?token=${resetToken.token}`
    }

    async sendPasswordResetEmail(user, token) {
        
        const resetPasswordUrl = this.constructPasswordResetUrl(token);
        const email = {
            to: user.email,
            from: this.emailFromAddress,
            subject: `Reset your password for ${this.applicationName}`,
            html: `
                <html>
                    <body>
                        <h1>Password Reset Notificaiton</h1>
                        <br />
                        <p>Click the link below</p>
                        <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
                    </body>
                </html>
             `
        }

        return await this.sendEmail(email);
    }

    async sendPasswordResetConfirmationEmail(user) {
        
        const email = {
            to: user.email,
            from: this.emailFromAddress,
            subject: `Your ${this.applicationName} password has been reset`,
            html: `
                <html>
                    <body>
                        <h1>Password Reset Notificaiton<h1>
                        <br />
                        <p>This is a comfirmation of password reset</p>
                    </body>
                </html>
             `
        }

        return await this.sendEmail(email);
    }

    async sendMakeIntoClassEmail(user, courseInfo) {
        
        const email = {
            to: user.user_email,
            from: this.emailFromAddress,
            subject: `${this.applicationName} Notification: You just made it into the class from waiting list!`,
            html: `
                <html>
                    <body>
                        <h1>Class Info:<h1>
                        <p>Class: ${courseInfo.course_name}</p>
                        <p>Time: ${courseInfo.course_time.toString().substr(0, 21)}</p>
                    </body>
                </html>
             `
        }

        return await this.sendEmail(email);
    }

    async sendDegradedToRsvpEmail(user, courseInfo) {
        
        const email = {
            to: user.user_email,
            from: this.emailFromAddress,
            subject: `${this.applicationName} Notification: You are moved into the waiting list due to the decreased class size`,
            html: `
                <html>
                    <body>
                        <h1>Class Info:<h1>
                        <p>Class: ${courseInfo.course_name}</p>
                        <p>Time: ${courseInfo.course_time.toString().substr(0, 21)}</p>
                        <p>Please contact your gym if you have any questions regarding the decreased class size</p>
                    </body>
                </html>
             `
        }

        return await this.sendEmail(email);
    }

    async sendCourseCancelingEmail(user, courseInfo) {
        
        const email = {
            to: user.user_email,
            from: this.emailFromAddress,
            subject: `${this.applicationName} Notification: the course you joined or waited to join has been canceled`,
            html: `
                <html>
                    <body>
                        <h1>Class Info:<h1>
                        <p>Class: ${courseInfo.course_name}</p>
                        <p>Time: ${courseInfo.course_time.toString().substr(0, 21)}</p>
                        <p>Please contact your gym if you have any questions</p>
                    </body>
                </html>
             `
        }

        return await this.sendEmail(email);
    }


    async sendCourseUpdatingEmail(user, courseInfo) {
        
        const email = {
            to: user.user_email,
            from: this.emailFromAddress,
            subject: `${this.applicationName} Notification: the course you joined or waited to join has been updated`,
            html: `
                <html>
                    <body>
                        <h1>Class Info:<h1>
                        <p>Class: ${courseInfo.course_name}</p>
                        <p>Coach: ${courseInfo.coach}</p>
                        <p>Size: ${courseInfo.course_capacity}</p>
                        <p>Time: ${courseInfo.course_time.toString().substr(0, 21)}</p>
                        <p>Deadline for quiting: ${courseInfo.quit_deadline.toString().substr(0, 21)}</p>
                        <p>Please contact your gym if you have any questions</p>
                    </body>
                </html>
             `
        }

        return await this.sendEmail(email);
    }
}

module.exports = EmailService