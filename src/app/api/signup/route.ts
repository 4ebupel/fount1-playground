import { NextRequest, NextResponse } from 'next/server';
import { XanoNodeClient } from '@xano/js-sdk';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName, isTermsAccepted, isPrivacyAccepted } = await request.json();

  // Generate a verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    const xano = new XanoNodeClient({
      apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL,
    });

    // Create user in Xano
    const response = await xano.post('/auth/signup/employers', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      verification_token: verificationToken,
      is_verified: false,
      is_terms_accepted: isTermsAccepted,
      is_privacy_accepted: isPrivacyAccepted,
    });

    const responseBody = response.getBody();

    if (response.getStatusCode() >= 400) {
      return NextResponse.json(
        { error: responseBody?.message || 'Failed to sign up' },
        { status: response.getStatusCode() }
      );
    }

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${verificationToken}`;
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

    const msg = {
      to: email,
      from: 'noreply@fount.one',
      subject: 'Please Confirm Your Email Address',
      text: `Hi ${firstName},
        Thank you for registering with us! We're excited to have you on board.
        To complete your registration and start using our services, please verify your email address by clicking the link below:
        ${verificationUrl}
        If you did not sign up for this account, please disregard this email.
        Thanks again, and we look forward to having you with us!
        Best regards,
        The Fount One Team
        `,
      html: 
        `<p>Hi ${firstName},</p>
        <p>Thank you for registering with us! We're excited to have you on board.</p>
        <p>To complete your registration and start using our services, please verify your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>If you did not sign up for this account, please disregard this email.</p>
        <p>Thanks again, and we look forward to having you with us!</p>
        <p>Best regards,<br>The Fount One Team</p>`,
    };

    // send verification email
    await sgMail.send(msg);
    console.log('Verification email sent');

    return NextResponse.json({ message: 'Signup successful. Verification email sent.' }, { status: 200 });
  } catch (error: any) {
    const isXanoError = Boolean(error?.getResponse?.());
    console.log("isXanoError:", isXanoError);
    console.error('Signup error:', isXanoError ? error.getResponse().getBody()?.message + " " + error.getResponse().getBody()?.payload : error);
    return NextResponse.json({ error: isXanoError ? error.getResponse().getBody()?.message + " " + error.getResponse().getBody()?.payload : error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
