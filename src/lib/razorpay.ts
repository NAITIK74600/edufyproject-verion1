import Razorpay from "razorpay";
import { createHmac } from "node:crypto";

// Razorpay credentials live in env only — never ship the secret to the client.
// Add these to .env.local (and your host's env) when keys are ready:
//   RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET        (server — order creation + verify)
//   NEXT_PUBLIC_RAZORPAY_KEY_ID                   (client — opens the checkout)
const keyId = process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";

/** True once real keys are configured — lets routes fail cleanly until then. */
export const isRazorpayConfigured = Boolean(keyId && keySecret);

let client: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!isRazorpayConfigured) {
    throw new Error("Razorpay keys are not configured.");
  }
  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return client;
}

/**
 * Verifies the checkout signature Razorpay returns to the browser.
 * signature === HMAC_SHA256(`${orderId}|${paymentId}`, keySecret).
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!keySecret) return false;
  const expected = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  // Both are hex strings of equal length; a plain compare is sufficient here.
  return expected === signature;
}
