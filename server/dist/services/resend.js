import "dotenv/config";
import { Resend } from "resend";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY)
    throw new Error("Resend api key is missing");
const resend = new Resend(RESEND_API_KEY);
export const sendMail = async () => {
    const { data, error } = await resend.emails.send({
        from: "kaushik <youtube@kaushik.bond>",
        to: ["kaushik.lf07@gmail.com"],
        subject: "hello world",
        html: "<strong>it works!</strong>",
    });
    console.log(data);
    console.log(error);
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
