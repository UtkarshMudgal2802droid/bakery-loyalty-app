import { NextResponse } from 'next/server';
import { privy } from '../../../lib/privyServer';
import { addStamp } from '../../../lib/db';
import { privateKeyToAccount } from 'viem/accounts';

import { env } from '../../../config/env';
import { APP_CONFIG } from '../../../config/app';

const bakeryPrivateKey = env.BAKERY_PRIVATE_KEY as `0x${string}`;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let verifiedClaims;
    try {
      verifiedClaims = await privy.verifyAuthToken(token);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!verifiedClaims || !verifiedClaims.userId) {
      return NextResponse.json({ error: 'Invalid token claims' }, { status: 401 });
    }

    if (!bakeryPrivateKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    const bakeryAccount = privateKeyToAccount(bakeryPrivateKey);

    // STAFF AUTHORIZATION CHECK (RBAC)
    // 1. Fetch the user profile of the CALLER (the person logged into the browser)
    const staffUser = await privy.getUserById(verifiedClaims.userId);
    const staffEmail = staffUser?.email?.address;

    // 2. Verify the caller is an Authorized Staff Member
    if (!staffEmail || staffEmail.toLowerCase() !== env.AUTHORIZED_STAFF_EMAIL.toLowerCase()) {
      return NextResponse.json({ 
        error: 'Forbidden: Only authorized staff can mint stamps. You are not authorized.' 
      }, { status: 403 });
    }

    // 3. The caller IS authorized staff. Now fetch the CUSTOMER being stamped.
    const customerUser = await privy.getUserByEmail(email);
    if (!customerUser) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // 4. Award the stamp to the CUSTOMER's DID
    const newRecord = await addStamp(customerUser.id);
    const emailStr = customerUser.email?.address || email;

    // Cryptographically prove the stamp belongs to them using the Bakery's private key
    // This creates an off-chain attestation that can be verified on-chain or off-chain
    const message = `Loyalty Card Update\nUser: ${emailStr}\nStamps: ${newRecord.stamps}`;
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
