export const APP_CONFIG = {
  routes: {
    home: '/',
    staff: '/staff',
    api: {
      mintStamp: '/api/mint-stamp',
      verifyStamp: '/api/verify-stamp',
    }
  },
  timeouts: {
    apiRequest: 10000,
    toastDuration: 5000,
    rpcPolling: 5000,
  },
  ui: {
    siteName: 'Loyalty Protocol',
    tagline: 'Cryptographically secured POS architecture.',
    stampsRequired: 10,
    stampUnit: 'Stamps',
    awardSuccess: 'Cryptographic attestation successful. Stamp awarded.',
    awardError: 'Attestation failed. Potential interference detected.',
    verificationSuccess: 'Signature Verified.',
    verificationError: 'Signature Invalid. State mismatch.',
  }
};
