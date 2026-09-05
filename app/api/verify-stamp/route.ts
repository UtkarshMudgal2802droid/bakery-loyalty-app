import { NextResponse } from 'next/server';
import { verifyMessage } from 'viem';

const bakeryPublicKey = (process.env.BAKERY_PUBLIC_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266') as `0x${string}`;

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
        message: 'The signature matches the server cryptographic attestation for this customer.'
      });
    } else {
      return NextResponse.json({
        valid: false,
        message: 'Invalid signature! Potential photocopy or tampering detected.'
      });
    }
  } catch (error: any) {
    console.error('Error verifying stamp:', error);
    return NextResponse.json({ error: 'Failed to verify stamp' }, { status: 500 });
  }
}
