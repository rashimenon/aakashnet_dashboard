# Stripe Integration Guide - Safe Analytics Handling

This project includes built-in protection against Stripe analytics/telemetry blocking by adblockers, privacy extensions, and Brave shields.

## 🛡️ Protection Features

- **Global error handling** for Stripe script loading failures
- **Safe wrappers** for all Stripe API calls
- **Graceful degradation** when analytics are blocked
- **Console warnings** instead of crashes
- **Unhandled promise rejection** catching for Stripe errors

## 📦 Already Configured

The following components are already active in your app:

1. **`StripeErrorHandler`** - Added to root layout, catches all Stripe-related errors globally
2. **`stripe-safe-loader.ts`** - Utility functions for safe Stripe integration

## 🚀 How to Integrate Stripe (Future Development)

### Step 1: Install Stripe Dependencies

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Step 2: Use Safe Stripe Loader

**❌ DON'T do this (unsafe):**
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(publishableKey); // Can crash if blocked!
```

**✅ DO this instead (safe):**
```typescript
import { loadStripeSafely } from '@/lib/stripe-safe-loader';

const stripe = await loadStripeSafely(process.env.NEXT_PUBLIC_STRIPE_KEY!);

if (!stripe) {
  // Handle gracefully - show alternative payment method or message
  console.warn('Stripe unavailable, showing alternative payment');
  return;
}
```

### Step 3: Safe Payment Confirmation

**❌ DON'T do this:**
```typescript
const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: { return_url: '/success' }
});
```

**✅ DO this instead:**
```typescript
import { confirmPaymentSafely } from '@/lib/stripe-safe-loader';

const result = await confirmPaymentSafely(stripe, {
  elements,
  confirmParams: { return_url: '/success' }
});

if (result?.error) {
  // Handle payment error
  console.error('Payment failed:', result.error);
}
```

### Step 4: Safe Elements Creation

**❌ DON'T do this:**
```typescript
const elements = stripe.elements(options);
```

**✅ DO this instead:**
```typescript
import { createElementsSafely } from '@/lib/stripe-safe-loader';

const elements = createElementsSafely(stripe, options);

if (!elements) {
  // Show fallback payment form
  return <AlternativePaymentForm />;
}
```

### Step 5: Safe API Calls

For any custom Stripe API calls, use the `safeStripeCall` wrapper:

```typescript
import { safeStripeCall } from '@/lib/stripe-safe-loader';

const paymentIntent = await safeStripeCall(
  () => stripe.createPaymentIntent({ amount: 1000, currency: 'usd' }),
  null // fallback value if blocked
);

if (!paymentIntent) {
  // Analytics blocked, but continue with alternative flow
  console.warn('Stripe API blocked, using fallback');
}
```

## 🧪 Example: Payment Form Component

Here's a complete example of a safe Stripe payment form:

```typescript
'use client'

import { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripeSafely, confirmPaymentSafely } from '@/lib/stripe-safe-loader';

// Safe Stripe promise
const stripePromise = loadStripeSafely(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system unavailable. Please try again later.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Payment form not loaded. Please refresh.');
      return;
    }

    // Safe payment confirmation
    const result = await confirmPaymentSafely(stripe, {
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`
      }
    });

    if (result?.error) {
      setError(result.error.message || 'Payment failed');
    } else {
      // Payment succeeded!
      console.log('Payment confirmed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    stripePromise.then((stripe) => {
      setStripeReady(!!stripe);
      if (!stripe) {
        console.warn('Stripe blocked - showing alternative payment');
      }
    });
  }, []);

  if (!stripeReady) {
    return <div>Loading payment system...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
```

## 🔍 Error Types Handled

The safe loader automatically handles these error scenarios:

1. **Script Blocking**: When Stripe's JS file is blocked
2. **Analytics Blocking**: When `r.stripe.com` or `m.stripe.com` telemetry is blocked
3. **CORS Errors**: When cross-origin requests are denied
4. **Network Errors**: Generic network failures
5. **Unhandled Promise Rejections**: Background Stripe tasks that fail

## 🎯 Console Messages

When Stripe analytics are blocked, you'll see these warnings (not errors):

```
⚠️ Stripe analytics blocked, continuing without it
⚠️ Stripe.js failed to load (possibly blocked by privacy extension)
⚠️ Stripe script error (possibly blocked). Continuing without Stripe analytics
```

These are **warnings only** - the app will continue to function normally.

## 📝 Testing with Adblockers

To test the error handling:

1. Install **uBlock Origin** or **Brave Browser**
2. Visit your payment page
3. Check browser console for warning messages
4. Verify the app doesn't crash
5. Confirm alternative payment flows work

## ⚡ Key Principles

1. **Never assume Stripe will load** - always check for null
2. **Always provide fallbacks** - alternative payment methods or messages
3. **Use safe wrappers** - never call Stripe APIs directly
4. **Handle errors gracefully** - show user-friendly messages
5. **Log warnings, not errors** - analytics blocking is expected behavior

## 🛠️ Already Active

The `StripeErrorHandler` component is already included in your root layout and will automatically:

- Catch all unhandled Stripe promise rejections
- Prevent Stripe script errors from crashing the app
- Log warnings to console for debugging
- Continue app operation normally when analytics are blocked

No additional setup needed! Just follow the safe usage patterns above when integrating Stripe.

## 📞 Need Help?

If you encounter issues with Stripe integration, check:

1. Are you using the safe wrappers from `stripe-safe-loader.ts`?
2. Do you have fallback UI for when Stripe is blocked?
3. Are you checking for `null` before using Stripe objects?
4. Are you handling errors in payment confirmation?

For more details, see: https://stripe.com/docs/js