const { sendEmail } = require('../utils/emailService');

exports.sendNotification = async (req, res) => {
    try {
        const { type, message, recipientEmail, subject } = req.body;

        // Basic validation
        if (!message || !recipientEmail) {
            return res.status(400).json({ error: 'Message and recipient email are required' });
        }
                                                                             
        // Construct email content
        const emailSubject = subject || 'New Notification from MilestoneNest';
        const emailText = `You have a new notification:\n\n${message}`;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #333;">New Notification</h2>
                    <p style="font-size: 16px; color: #555;">${message}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">MilestoneNest Project Management</p>
                </div>
            </div>
        `;

        // Send email
        await sendEmail({
            to: recipientEmail,
            subject: emailSubject,
            text: emailText,
            html: emailHtml
        });

        res.status(200).json({ message: 'Notification sent successfully' });

    } catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
};
