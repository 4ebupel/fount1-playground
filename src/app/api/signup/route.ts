import { NextRequest, NextResponse } from 'next/server';
import { XanoNodeClient } from '@xano/js-sdk';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Generate a verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    const xano = new XanoNodeClient({
      apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL,
    });

    // Create user in Xano
    const response = await xano.post('/auth/signup', {
      email,
      password,
      verification_token: verificationToken,
      is_verified: false,
    });

    const responseBody = response.getBody();

    if (response.getStatusCode() >= 400) {
      return NextResponse.json(
        { error: responseBody?.message || 'Failed to sign up' },
        { status: response.getStatusCode() }
      );
    }

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${verificationToken}`;

    const mailOptions = {
      from: 'fount1support',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Signup successful. Verification email sent.' }, { status: 200 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
