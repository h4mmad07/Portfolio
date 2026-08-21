// Enhanced High-Security Cryptography & Locked Email OTP Verification Engine

const PASSCODE_HASH_KEY = 'portfolio_admin_passcode_hash_v1';
const AUTH_TOKEN_KEY = 'portfolio_admin_auth_token_v1';
const RECOVERY_STATE_KEY = 'portfolio_recovery_state_secure_v2';

// Master Passcode: default hammad2026
const DEFAULT_PASSCODE = 'hammad2026';

// STRICT AUTHORIZED OWNER EMAIL - ONLY THIS RECIPIENT CAN RECEIVE CODES
export const STRICT_OWNER_EMAIL = 'mh9456605@gmail.com';

interface RecoveryState {
  codeHash: string;
  salt: string;
  expiresAt: number;
  attemptsLeft: number;
  lockoutUntil: number;
  lastSentAt: number;
}

/**
 * High-entropy SHA-256 computation
 */
export async function hashString(input: string, salt = ''): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    let hash = 0;
    const combined = input + salt;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `fallback_${Math.abs(hash).toString(16)}`;
  }
}

/**
 * Initializes default passcode hash
 */
export async function initializePasscode(): Promise<string> {
  let storedHash = localStorage.getItem(PASSCODE_HASH_KEY);
  if (!storedHash) {
    storedHash = await hashString(DEFAULT_PASSCODE);
    localStorage.setItem(PASSCODE_HASH_KEY, storedHash);
  }
  return storedHash;
}

/**
 * Verifies passcode against stored hash
 */
export async function verifyPasscode(enteredPasscode: string): Promise<boolean> {
  const currentHash = await initializePasscode();
  const enteredHash = await hashString(enteredPasscode.trim());
  return currentHash === enteredHash;
}

/**
 * Updates master passcode
 */
export async function updatePasscode(newPasscode: string): Promise<boolean> {
  if (!newPasscode || newPasscode.length < 4) {
    throw new Error('Passcode must be at least 4 characters long.');
  }
  const newHash = await hashString(newPasscode.trim());
  localStorage.setItem(PASSCODE_HASH_KEY, newHash);
  return true;
}

/**
 * Generates a cryptographically secure 6-digit OTP
 * Never stores plain text - stores only SHA-256(code + salt)
 */
export async function generateSecureRecoveryOTP(emailInput: string): Promise<{ code: string; cooldownSeconds: number }> {
  const normalizedEmail = emailInput.toLowerCase().trim();
  if (normalizedEmail !== STRICT_OWNER_EMAIL.toLowerCase()) {
    throw new Error(`Security Violation: Verification codes can ONLY be delivered to the authorized owner (${STRICT_OWNER_EMAIL}).`);
  }

  const now = Date.now();
  const rawState = localStorage.getItem(RECOVERY_STATE_KEY);
  if (rawState) {
    try {
      const prev = JSON.parse(rawState) as RecoveryState;
      if (prev.lockoutUntil && now < prev.lockoutUntil) {
        const remainingMin = Math.ceil((prev.lockoutUntil - now) / 60000);
        throw new Error(`Account temporarily locked due to excessive failed attempts. Please wait ${remainingMin} minute(s).`);
      }
      // 60-second anti-spam cooldown
      if (prev.lastSentAt && now - prev.lastSentAt < 60000) {
        const remainingSec = Math.ceil((60000 - (now - prev.lastSentAt)) / 1000);
        throw new Error(`Please wait ${remainingSec}s before requesting another verification code.`);
      }
    } catch (e: any) {
      if (e.message.startsWith('Security Violation') || e.message.startsWith('Account temporarily') || e.message.startsWith('Please wait')) {
        throw e;
      }
    }
  }

  // Cryptographically secure 6-digit random code
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  const code = (100000 + (randomArray[0] % 900000)).toString();

  // Generate random salt and hash the code
  const salt = Math.random().toString(36).substring(2, 15);
  const codeHash = await hashString(code, salt);

  const state: RecoveryState = {
    codeHash,
    salt,
    expiresAt: now + 10 * 60 * 1000, // 10 minutes
    attemptsLeft: 3,                 // Maximum 3 attempts
    lockoutUntil: 0,
    lastSentAt: now
  };

  localStorage.setItem(RECOVERY_STATE_KEY, JSON.stringify(state));
  return { code, cooldownSeconds: 60 };
}

/**
 * Verifies the 6-digit OTP against the salted cryptographic hash
 * Implements strict attempt limiting and lockout
 */
export async function verifySecureRecoveryOTP(enteredCode: string): Promise<boolean> {
  const raw = localStorage.getItem(RECOVERY_STATE_KEY);
  if (!raw) {
    throw new Error('No active verification session found. Please request a new code.');
  }

  const now = Date.now();
  const state = JSON.parse(raw) as RecoveryState;

  if (state.lockoutUntil && now < state.lockoutUntil) {
    const remainingMin = Math.ceil((state.lockoutUntil - now) / 60000);
    throw new Error(`Too many incorrect attempts. System locked for ${remainingMin} minute(s).`);
  }

  if (now > state.expiresAt) {
    localStorage.removeItem(RECOVERY_STATE_KEY);
    throw new Error('Verification code expired (10 min limit). Please request a new code.');
  }

  const computedHash = await hashString(enteredCode.trim(), state.salt);

  if (computedHash === state.codeHash) {
    // Valid code!
    localStorage.removeItem(RECOVERY_STATE_KEY);
    return true;
  } else {
    state.attemptsLeft -= 1;
    if (state.attemptsLeft <= 0) {
      state.lockoutUntil = now + 15 * 60 * 1000; // 15 min lockout
      localStorage.setItem(RECOVERY_STATE_KEY, JSON.stringify(state));
      throw new Error('Maximum verification attempts exceeded. Locked for 15 minutes.');
    }
    localStorage.setItem(RECOVERY_STATE_KEY, JSON.stringify(state));
    throw new Error(`Incorrect code. ${state.attemptsLeft} attempt(s) remaining.`);
  }
}

/**
 * Dispatches the OTP securely to mh9456605@gmail.com
 * Attempts background HTTP email dispatch via FormSubmit / Webhook with secure mailto carrier
 */
export async function dispatchOTPEmail(code: string): Promise<{ success: boolean; method: string }> {
  const subject = `Portfolio Security Verification PIN: ${code}`;
  const messageBody = `Hello Muhammad Hammad,\n\nYour secure 6-digit verification code to reset your Portfolio Admin Passcode is:\n\n👉  ${code}  👈\n\n- Valid for: 10 minutes\n- Maximum attempts: 3\n- Security lock: Strictly assigned to ${STRICT_OWNER_EMAIL}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nPortfolio Security Engine`;

  try {
    // Background REST dispatch attempt via FormSubmit service
    const response = await fetch(`https://formsubmit.co/ajax/${STRICT_OWNER_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        name: 'Portfolio Security Engine',
        email: 'security-no-reply@portfolio.system',
        message: messageBody,
        verification_code: code,
        authorized_recipient: STRICT_OWNER_EMAIL
      })
    });

    if (response.ok) {
      return { success: true, method: 'direct_api' };
    }
  } catch (err) {
    // Network or CORS fallback handled below
  }

  // Backup carrier dispatch
  const mailtoUrl = `mailto:${STRICT_OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;
  window.open(mailtoUrl, '_blank');

  return { success: true, method: 'mail_carrier' };
}

/**
 * Session verification
 */
export function isSessionAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'authenticated_active_session';
}

export function setSessionAuthenticated(auth: boolean): void {
  if (auth) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'authenticated_active_session');
  } else {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
