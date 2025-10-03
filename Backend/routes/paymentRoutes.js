const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Use env vars: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret'
});

// Create an order (amount in paise)
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'rcptid_11' } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount required (in INR paise)' });

    const options = {
      amount: amount, // amount in smallest currency unit (paise)
      currency,
      receipt,
      payment_capture: 1
    };

  const order = await razorpay.orders.create(options);
  // Return order fields and include the public key id so frontend can open Checkout
  return res.json({ ...order, key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key' });
  } catch (err) {
    console.error('create-order error', err);
    return res.status(500).json({ error: 'failed to create order', details: err.message });
  }
});

// Verify signature (simple placeholder)
router.post('/verify', (req, res) => {
  // In production verify the signature using razorpay.utils.verifySignature
  // For now accept the payload and return success for test integration
  return res.json({ success: true, received: req.body });
});

module.exports = router;
