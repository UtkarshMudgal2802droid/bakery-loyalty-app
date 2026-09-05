import { NextResponse } from 'next/server';
import { privy } from '../../../lib/privyServer';
import { addStamp } from '../../../lib/db';
import { privateKeyToAccount } from 'viem/accounts';

// Setup the backend bakery wallet for cryptographic signing
const bakeryPrivateKey = (process.env.BAKERY_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') as `0x${string}`;
const bakeryAccount = privateKeyToAccount(bakeryPrivateKey);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing customer email' }, { status: 400 });
    }

    // Lookup the user by email to get their DID (userId)
    const user = await privy.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Award the stamp in the database mapping to userId
    const newRecord = await addStamp(user.id);

    // Cryptographically prove the stamp belongs to them using the Bakery's private key
    // This creates an off-chain attestation that can be verified on-chain or off-chain
    const message = `Loyalty Card Update\nUser: ${email}\nStamps: ${newRecord.stamps}`;
    const signature = await bakeryAccount.signMessage({ message });

    return NextResponse.json({
      success: true,
      stamps: newRecord.stamps,
      serverSignature: signature,
      bakeryAddress: bakeryAccount.address
    });
  } catch (error: any) {
    console.error('Error awarding stamp:', error);
    return NextResponse.json({ error: 'Failed to award stamp' }, { status: 500 });
  }
}
