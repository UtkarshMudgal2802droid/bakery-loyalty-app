import { PrivyClient } from '@privy-io/server-auth';

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const appSecret = process.env.PRIVY_APP_SECRET;

if (!appId || !appSecret) {
  throw new Error('Privy App ID or App Secret is missing in environment variables.');
}

export const privy = new PrivyClient(appId, appSecret);
