const nodemailer = require('nodemailer');

// Create a transporter
// For production, you would use real SMTP credentials from process.env
// For development/demo, we can use Ethereal or just log
const createTransporter = async () => {
    // Check if we have credentials
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const config = {
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        };

        if (process.env.SMTP_SERVICE) {
            config.service = process.env.SMTP_SERVICE;
        } else {
            config.host = process.env.SMTP_HOST;
            config.port = process.env.SMTP_PORT || 587;
            config.secure = false;
        }

        return nodemailer.createTransport(config);
    }

    // Fallback for demo: Generate test account or just log
    // For this specific user request, we'll try to use a test account if possible,
    // but to avoid async issues in module loading, we'll handle it in the send function.
    return null;
};

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        let transporter = await createTransporter();

        if (!transporter) {
            // If no real config, create a test account
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log("Using Ethereal Test Account for email sending. To use real email, set SMTP_USER and SMTP_PASS in backend/.env");
        }

        const info = await transporter.sendMail({
            from: '"MilestoneNest Notification" <noreply@milestonenest.com>',
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return info;

    } catch (error) {
        console.error("Error sending email:", error);
        // Don't throw, just return null so app doesn't crash
        return null;
    }
};

module.exports = { sendEmail };
