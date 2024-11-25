import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import ApiClientServer from '@/lib/apiClientServer';
import basicErrorHandler from '@/lib/basicErrorHandler';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const apiClient = await ApiClientServer();

    // Find the user by email
    const response = await apiClient.get(`/users?email=${encodeURIComponent(email)}`);
    const users = response.data;

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
    await apiClient.patch('/users/updateVerificationToken', {
      id: user.id,
      verification_token: verificationToken,
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${verificationToken}`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

    const msg = {
      to: email,
      from: 'noreply@fount.one',
      subject: 'Resend Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    await sgMail.send(msg);
    console.log('Verification email resent');
    return NextResponse.json({ message: 'Verification email resent' }, { status: 200 });
  } catch (error: any) {
    return basicErrorHandler(error, "Error resending verification email");
  }
}
