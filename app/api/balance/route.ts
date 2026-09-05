import { NextResponse } from 'next/server';
import { privy } from '../../../lib/privyServer';
import { getUserData } from '../../../lib/db';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const verifiedClaims = await privy.verifyAuthToken(token);
    const userId = verifiedClaims.userId;

    const record = await getUserData(userId);

    return NextResponse.json({
      success: true,
      stamps: record.stamps,
    });
  } catch (error: any) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Unauthorized or failed to fetch balance' }, { status: 401 });
  }
}
