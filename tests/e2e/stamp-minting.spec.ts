import { test, expect } from '@playwright/test';
import { APP_CONFIG } from '../../config/app';

test.describe('Cryptographic Minting (Operator Console)', () => {
  test('should reject unauthorized access (Missing JWT)', async ({ request }) => {
    // Attempting to hit the backend directly without an access token
    const response = await request.post(APP_CONFIG.routes.api.mintStamp, {
      data: { email: 'test@domain.com' },
    });
    
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Missing or invalid Authorization header');
  });

  test('should render Operator Console correctly', async ({ page }) => {
    await page.goto(APP_CONFIG.routes.staff);
    await expect(page.locator('text=Operator Console')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Mint Cryptographic Attestation' })).toBeVisible();
  });
});
