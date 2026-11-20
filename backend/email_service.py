import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

log = logging.getLogger("email_service")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "saisubodh6@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "stxf kcaa dmyn rczq")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USERNAME)
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() in ("true", "1", "yes")


def send_otp_email(to_email: str, otp_code: str, user_name: Optional[str] = None) -> bool:
    """
    Sends an OTP verification email using SMTP credentials.
    """
    display_name = user_name or "Researcher"
    subject = f"IndianMatter — Your Verification Code: {otp_code}"

    text_content = f"""Hello {display_name},

Your verification code to sign in to IndianMatter is:

{otp_code}

This code is valid for 10 minutes. If you did not request this verification code, please ignore this email.

Best regards,
The IndianMatter Team
Materials for a Brighter Tomorrow
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>IndianMatter Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF4EE; margin: 0; padding: 40px 20px;">
  <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; padding: 36px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #F0E5D9;">
    <div style="text-align: center; margin-bottom: 28px;">
      <h1 style="color: #1E2227; font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
        Indian<span style="color: #E8590C;">Matter</span>
      </h1>
      <p style="color: #8C929C; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; font-weight: 600;">
        Materials for a Brighter Tomorrow
      </p>
    </div>

    <div style="margin-bottom: 24px;">
      <h2 style="color: #1E2227; font-size: 18px; font-weight: 600; margin: 0 0 10px;">
        Sign In Verification Code
      </h2>
      <p style="color: #5F6771; font-size: 14px; line-height: 1.6; margin: 0;">
        Hello <strong>{display_name}</strong>, use the single-use 6-digit code below to complete your authentication:
      </p>
    </div>

    <div style="background-color: #FAF4EE; border: 1.5px dashed #E8590C; border-radius: 14px; text-align: center; padding: 22px; margin: 26px 0;">
      <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #E8590C; font-family: 'Courier New', monospace;">
        {otp_code}
      </div>
      <p style="color: #8C929C; font-size: 12px; margin: 8px 0 0; font-weight: 500;">
        Valid for 10 minutes
      </p>
    </div>

    <p style="color: #8C929C; font-size: 12px; line-height: 1.5; margin: 0 0 20px;">
      If you did not request this verification code, please ignore this email or review your account credentials.
    </p>

    <hr style="border: none; border-top: 1px solid #F0E5D9; margin: 24px 0 16px;">

    <p style="color: #A0A6AF; font-size: 11px; text-align: center; margin: 0;">
      IndianMatter Research &middot; Computational Materials Intelligence Platform
    </p>
  </div>
</body>
</html>
"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"IndianMatter Support <{SMTP_FROM_EMAIL}>"
    msg["To"] = to_email

    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=12)
        if SMTP_USE_TLS:
            server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM_EMAIL, [to_email], msg.as_string())
        server.quit()
        log.info(f"[Email] Successfully sent OTP to {to_email}")
        return True
    except Exception as e:
        log.error(f"[Email] Failed to send OTP to {to_email}: {e}")
        return False

