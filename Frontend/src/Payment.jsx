import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const amount = location.state?.amount || 0; // rupees
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!amount) return;
    // load razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, [amount]);

  const startPayment = async () => {
    if (!amount) return alert('Invalid amount');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100) }) // paise
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || 'Failed to create order');

      const options = {
        key: order.key_id || process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_your_key', // use server-provided key_id
        amount: order.amount,
        currency: order.currency,
        name: 'Mahaveer Tools (Test)',
        description: 'Order Payment',
        order_id: order.id,
        handler: function (response) {
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          alert('Payment successful (test). Payment ID: ' + response.razorpay_payment_id);
          navigate('/');
        },
        prefill: {
          name: '',
          email: ''
        },
        theme: { color: '#1a2640' }
      };

      // Ensure Razorpay script has loaded
      if (!window.Razorpay) {
        // Wait up to a short time for the script to load
        await new Promise((resolve, reject) => {
          let waited = 0;
          const interval = setInterval(() => {
            if (window.Razorpay) {
              clearInterval(interval);
              resolve(true);
            }
            waited += 50;
            if (waited > 5000) { clearInterval(interval); reject(new Error('Razorpay script failed to load')); }
          }, 50);
        });
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '3rem auto', padding: '1rem' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Payment (Razorpay test)</h2>
        <p>Amount: ₹{amount}</p>
        <p>This is a sample payment page wired to Razorpay test order creation. Make sure your backend has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.</p>
        <button onClick={startPayment} style={{ padding: '12px 18px', background: '#1a2640', color: '#fff', borderRadius: 8, border: 'none' }} disabled={loading || !amount}>{loading ? 'Starting...' : 'Pay Now'}</button>
      </div>
    </div>
  );
}
