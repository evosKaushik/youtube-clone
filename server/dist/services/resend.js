import "dotenv/config";
import { Resend } from "resend";
function getResendClient() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("RESEND_API_KEY is not set — email features will be disabled");
        return null;
    }
    return new Resend(apiKey);
}
export const sendInvoiceEmail = async (email, userName, planName, amount, isYearly, paymentId, expiryDate) => {
    const priceLabel = isYearly ? "Yearly" : "Monthly";
    const formattedAmount = `₹${amount}`;
    const formattedExpiry = expiryDate.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body
    style="
      margin:0;
      padding:0;
      background:#f4f7fb;
      font-family:Arial,Helvetica,sans-serif;
    "
  >
    <div
      style="
        max-width:600px;
        margin:40px auto;
        background:#ffffff;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,0.08);
      "
    >
      <div
        style="
          background:#2563eb;
          color:white;
          padding:30px;
          text-align:center;
        "
      >
        <h1 style="margin:0; font-size:24px;">Payment Confirmation</h1>
        <p style="margin:8px 0 0; opacity:0.9;">YouTube Clone</p>
      </div>

      <div style="padding:40px">
        <h2 style="margin-top:0; color:#111827;">
          Thank you, ${userName}!
        </h2>

        <p style="color:#4b5563; line-height:1.7;">
          Your payment has been successfully processed. Below are your subscription details:
        </p>

        <table
          style="
            width:100%;
            margin:24px 0;
            border-collapse:collapse;
            background:#f9fafb;
            border-radius:12px;
            overflow:hidden;
          "
        >
          <tr>
            <td style="padding:14px 20px; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:14px;">
              Plan
            </td>
            <td style="padding:14px 20px; border-bottom:1px solid #e5e7eb; color:#111827; font-weight:600; font-size:14px; text-align:right;">
              ${planName} (${priceLabel})
            </td>
          </tr>
          <tr>
            <td style="padding:14px 20px; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:14px;">
              Amount Paid
            </td>
            <td style="padding:14px 20px; border-bottom:1px solid #e5e7eb; color:#111827; font-weight:600; font-size:14px; text-align:right;">
              ${formattedAmount}
            </td>
          </tr>
          <tr>
            <td style="padding:14px 20px; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:14px;">
              Payment ID
            </td>
            <td style="padding:14px 20px; border-bottom:1px solid #e5e7eb; color:#111827; font-size:14px; text-align:right; word-break:break-all;">
              ${paymentId}
            </td>
          </tr>
          <tr>
            <td style="padding:14px 20px; color:#6b7280; font-size:14px;">
              Valid Until
            </td>
            <td style="padding:14px 20px; color:#111827; font-weight:600; font-size:14px; text-align:right;">
              ${formattedExpiry}
            </td>
          </tr>
        </table>

        <p style="color:#6b7280; font-size:14px; line-height:1.6;">
          You can now enjoy all the benefits of your ${planName} plan. If you have any questions, feel free to reach out to our support team.
        </p>

        <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

        <p style="color:#9ca3af; font-size:12px; text-align:center;">
          This is an automated invoice from YouTube Clone. Please do not reply to this email.
        </p>
      </div>

      <div
        style="
          background:#f9fafb;
          padding:20px;
          text-align:center;
          color:#6b7280;
          font-size:12px;
        "
      >
        © 2026 YouTube Clone
      </div>
    </div>
  </body>
  </html>
  `;
    const resend = getResendClient();
    if (!resend) {
        console.warn("Invoice email skipped: RESEND_API_KEY not configured");
        return null;
    }
    const { data, error } = await resend.emails.send({
        from: "YouTube Clone <youtube@kaushik.bond>",
        to: [email],
        subject: `Invoice - ${planName} Plan Subscription`,
        html,
    });
    if (error) {
        console.error("Failed to send invoice email:", error);
        return null;
    }
    return data;
};
export const sendOTP = async (email, otp) => {
    const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body
    style="
      margin:0;
      padding:0;
      background:#f4f7fb;
      font-family:Arial,Helvetica,sans-serif;
    "
  >
    <div
      style="
        max-width:600px;
        margin:40px auto;
        background:#ffffff;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,0.08);
      "
    >
      <div
        style="
          background:#2563eb;
          color:white;
          padding:30px;
          text-align:center;
        "
      >
        <h1 style="margin:0">
          Your App Name
        </h1>
      </div>
  
      <div style="padding:40px">
        <h2
          style="
            margin-top:0;
            color:#111827;
          "
        >
          Verify Your Email
        </h2>
  
        <p
          style="
            color:#4b5563;
            line-height:1.7;
          "
        >
          Use the verification code below to complete your sign in.
        </p>
  
        <div
          style="
            margin:30px 0;
            text-align:center;
          "
        >
          <div
            style="
              display:inline-block;
              background:#f3f4f6;
              border:2px dashed #2563eb;
              padding:20px 40px;
              border-radius:12px;
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#2563eb;
            "
          >
            ${otp}
          </div>
        </div>
  
        <p style="color:#6b7280">
          This code expires in 10 minutes.
        </p>
  
        <p style="color:#ef4444">
          Never share this code with anyone.
        </p>
      </div>
  
      <div
        style="
          background:#f9fafb;
          padding:20px;
          text-align:center;
          color:#6b7280;
          font-size:12px;
        "
      >
        © 2026 Your App Name
      </div>
    </div>
  </body>
  </html>
  `;
    const resend = getResendClient();
    if (!resend) {
        console.warn("OTP email skipped: RESEND_API_KEY not configured");
        return null;
    }
    const { data, error } = await resend.emails.send({
        from: "Acme <youtube@kaushik.bond>",
        to: [email],
        subject: "Your Verification Code",
        html
    });
    if (error) {
        throw error;
    }
    return data;
};
