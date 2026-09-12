# Cryptographic Loyalty POS System

A secure, zero-trust Point-of-Sale (POS) and loyalty protocol designed for physical retail environments. This architecture bridges the gap between frictionless consumer UX and rigorous backend cryptography, eliminating the vulnerabilities of legacy loyalty programs (e.g., receipt forging, payload manipulation) without requiring end-users to manage seed phrases or browser extensions.

## Architecture & The Trust Model

At the core of this system is a mathematically enforced trust model that guarantees state integrity. 

For auditing and accounting purposes, the trust model operates on two strictly separated verification axes whenever a state change (awarding a loyalty stamp) is requested:

1. **The Operator (Staff) Authorization**
   - The frontend never dictates backend state. When an operator attempts to award a stamp, the client transmits a secure JSON Web Token (JWT).
   - The server decodes and cryptographically verifies this JWT against the identity provider (Privy) to confirm the caller's immutable identifier (DID).
   - Strict **Role-Based Access Control (RBAC)** is enforced: if the decoded identity does not strictly match the authorized environment variables, the transaction is rejected with a `403 Forbidden` response. It is impossible for a customer to intercept network traffic and award themselves stamps.

2. **The Cryptographic Attestation (Customer)**
   - Upon successful staff authorization, the server queries the identity provider for the target customer's DID.
   - The server executes the state transition (incrementing the loyalty balance) and generates an off-chain attestation.
   - This attestation is signed using the protocol's master Private Key (via `viem`), generating a cryptographic signature that proves the exact state synchronization. 
   - Customers can independently verify this signature against the protocol's public address to guarantee their balance has not been tampered with.

## Infrastructure Stack

- **Framework**: Next.js 16 (App Router) / React 19
- **Authentication**: Privy (Email OTP & Embedded Wallets)
- **Cryptography**: Viem (Off-chain signature generation & verification)
- **Styling**: Tailwind CSS (Bento Grid, Glassmorphism primitives)
- **Environment Validation**: Zod
- **QA Automation**: Playwright (E2E), Vitest (Unit)

## Getting Started

### 1. Environment Configuration
Strict zero-hardcoding principles are enforced across the codebase. All secrets must be injected at runtime and are validated upon startup. 

Copy the example configuration:
```bash
cp .env.example .env.local
```

Ensure the following variables are populated:
- `NEXT_PUBLIC_PRIVY_APP_ID`: Your Privy Application ID
- `PRIVY_APP_SECRET`: Your Privy Secret Key
- `BAKERY_PRIVATE_KEY`: A funded Base Sepolia ECDSA private key (must start with `0x`)
- `NEXT_PUBLIC_BAKERY_PUBLIC_ADDRESS`: The public address derived from the private key
- `AUTHORIZED_STAFF_EMAIL`: The strict email address permitted to execute state changes

### 2. Initialization
Install dependencies and initialize the development server:

```bash
pnpm install
pnpm run dev
```

### 3. Verification Protocol
To execute the End-to-End (E2E) cryptographic verification suite:

```bash
pnpm test
pnpm exec playwright test
```

## Security Posture
This repository strictly adheres to secure credential management. Fallback credentials have been stripped from the execution paths, and the application will fail to compile if the runtime environment does not satisfy the `envSchema` defined in `config/env.ts`.
