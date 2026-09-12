import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';

import { env } from '../../../config/env';
import { APP_CONFIG } from '../../../config/app';

const bakeryPublicKey = env.BAKERY_PUBLIC_ADDRESS as `0x${string}`;

export async function POST(req: Request) {
  try {
    const { email, signature, stamps } = await req.json();

    if (!email || !signature || stamps === undefined) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const message = `Loyalty Card Update\nUser: ${email}\nStamps: ${stamps}`;
    
    const valid = await verifyMessage({
      address: bakeryPublicKey,
      message,
      signature
    });

    if (valid) {
      return NextResponse.json({
        valid: true,
        message: APP_CONFIG.ui.verificationSuccess
      });
    } else {
      return NextResponse.json({
        valid: false,
        message: APP_CONFIG.ui.verificationError
      });
    }
  } catch (error: any) {
    console.error('Error verifying stamp:', error);
    return NextResponse.json({ error: 'Failed to verify stamp' }, { status: 500 });
  }
}
