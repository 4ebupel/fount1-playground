import { NextRequest, NextResponse } from 'next/server';
import { XanoNodeClient } from '@xano/js-sdk';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const xano = new XanoNodeClient({
      apiGroupBaseUrl: process.env.XANO_API_GROUP_BASE_URL,
    });

    // Find the user by email
    const response = await xano.get(`/users?email=${encodeURIComponent(email)}`);
    const users = response.getBody();

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const user = users[0];

    if (user.is_verified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Update user with new token
    await xano.put(`/users/${user.id}`, {
      verification_token: verificationToken,
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${verificationToken}`;

    const mailOptions = {
      from: 'fount1support',
      to: email,
      subject: 'Resend Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Verification email resent' }, { status: 200 });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
