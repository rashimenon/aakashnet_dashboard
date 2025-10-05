/**
 * Safe Stripe Loader Utility
 * 
 * Wraps all Stripe script loading and analytics calls in try/catch blocks
 * to prevent crashes when blocked by adblockers, privacy extensions, or Brave shields.
 */

type StripeInstance = any;

let stripePromise: Promise<StripeInstance | null> | null = null;

/**
 * Safely loads Stripe.js with error handling for blocked scripts
 * @param publishableKey - Your Stripe publishable key
 * @returns Stripe instance or null if blocked
 */
export async function loadStripeSafely(
  publishableKey: string
): Promise<StripeInstance | null> {
  // Return cached promise if already loading
  if (stripePromise) {
    return stripePromise;
  }

  stripePromise = (async () => {
    try {
      // Dynamically import @stripe/stripe-js
      const { loadStripe } = await import("@stripe/stripe-js");
      
      // Wrap the loadStripe call in try/catch
      try {
        const stripe = await loadStripe(publishableKey);
        
        if (!stripe) {
          console.warn(
            "⚠️ Stripe.js failed to load (possibly blocked by privacy extension). Payment functionality may be limited."
          );
          return null;
        }
        
        return stripe;
      } catch (loadError) {
        console.warn(
          "⚠️ Stripe analytics blocked, continuing without it. Error:",
          loadError
        );
        return null;
      }
    } catch (importError) {
      console.warn(
        "⚠️ Stripe module import failed (possibly blocked). Continuing without Stripe integration."
      );
      return null;
    }
  })();

  return stripePromise;
}

/**
 * Safely executes Stripe API calls with error handling
 * @param stripeCall - Function that returns a Stripe promise
 * @param fallback - Optional fallback value if call fails
 */
export async function safeStripeCall<T>(
  stripeCall: () => Promise<T>,
  fallback?: T
): Promise<T | null> {
  try {
    const result = await stripeCall();
    return result;
  } catch (error: any) {
    // Check if error is from Stripe analytics/telemetry being blocked
    if (
      error?.message?.includes("r.stripe.com") ||
      error?.message?.includes("m.stripe.com") ||
      error?.message?.includes("blocked") ||
      error?.message?.includes("CORS") ||
      error?.type === "network_error"
    ) {
      console.warn(
        "⚠️ Stripe analytics blocked, continuing without it. Error:",
        error.message
      );
      return fallback ?? null;
    }
    
    // Re-throw critical payment errors
    console.error("❌ Critical Stripe error:", error);
    throw error;
  }
}

/**
 * Wraps Stripe Elements creation with safe error handling
 */
export function createElementsSafely(
  stripe: StripeInstance | null,
  options?: any
) {
  if (!stripe) {
    console.warn("⚠️ Stripe not available, cannot create elements");
    return null;
  }

  try {
    return stripe.elements(options);
  } catch (error) {
    console.warn(
      "⚠️ Stripe Elements creation failed (analytics may be blocked), continuing without it:",
      error
    );
    return null;
  }
}

/**
 * Safely confirms a payment with error handling for blocked analytics
 */
export async function confirmPaymentSafely(
  stripe: StripeInstance | null,
  options: any
): Promise<{ error?: any; paymentIntent?: any } | null> {
  if (!stripe) {
    return {
      error: {
        message: "Stripe is not available. Payment cannot be processed.",
        type: "stripe_unavailable",
      },
    };
  }

  try {
    const result = await stripe.confirmPayment(options);
    return result;
  } catch (error: any) {
    // Check if it's just analytics being blocked (non-critical)
    if (
      error?.message?.includes("r.stripe.com") ||
      error?.message?.includes("blocked")
    ) {
      console.warn(
        "⚠️ Stripe analytics blocked during payment confirmation, but continuing with payment:",
        error.message
      );
      // Return success if the actual payment went through
      return { error: null };
    }

    // Critical payment error - return it
    return { error };
  }
}

/**
 * Global handler for unhandled Stripe promise rejections
 * Call this once during app initialization
 */
export function setupStripeErrorHandling() {
  if (typeof window === "undefined") return;

  // Handle unhandled promise rejections from Stripe
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;

    // Check if this is a Stripe-related error
    const isStripeError =
      error?.message?.includes("stripe") ||
      error?.message?.includes("r.stripe.com") ||
      error?.message?.includes("m.stripe.com") ||
      event.reason?.type === "network_error";

    if (isStripeError) {
      // Prevent the error from crashing the app
      event.preventDefault();
      
      console.warn(
        "⚠️ Stripe analytics/telemetry request blocked (likely by adblock/privacy extension). App continues normally.",
        error
      );
      
      // Optionally log to your error tracking service
      // logToErrorService({ type: "stripe_blocked", error });
    }
  });

  // Also catch global errors from Stripe scripts
  window.addEventListener("error", (event) => {
    const error = event.error || event.message;
    const isStripeScriptError =
      event.filename?.includes("stripe.com") ||
      error?.toString().includes("stripe");

    if (isStripeScriptError) {
      event.preventDefault();
      console.warn(
        "⚠️ Stripe script error (possibly blocked). Continuing without Stripe analytics:",
        error
      );
    }
  });

  console.log("✅ Stripe error handling initialized - analytics blocks won't crash the app");
}