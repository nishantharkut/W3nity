const express = require('express');
const router = express.Router();
const Payment= require("../models/Payment")
const { ObjectId } = require('mongodb');
const { getMongoClient } = require('../utils/mongoClient.js');

const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create-stripe-checkout', async (req, res) => {
  try {
    const {
      userId,
      amount,
      currency,
      paymentType,
      referenceId,
      metadata, // should include eventId
    } = req.body;

    const { eventId, title, description } = metadata;

    const payment = await Payment.create({
      userId,
      paymentType,
      referenceId,
      amount,
      currency,
      paymentMethod: 'stripe',
      status: 'pending',
      metadata,
    });

    const baseUrl = process.env.CLIENT_URL; // Use Vercel frontend URL in prod

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: title,
            description,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/events/${eventId}/payment/success?payment_id=${payment._id}`,
      cancel_url: `${baseUrl}/events/${eventId}/payment/cancel?payment_id=${payment._id}`,
      metadata: {
        paymentId: payment._id.toString(),
      },
    });

    payment.stripeSessionId = session.id;
    payment.status = 'processing';
    await payment.save();

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/payments/verify-stripe-payment
router.post('/verify-stripe-payment', async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id in request body' });
  }

  try {
    // Retrieve Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // Update your payment record status in DB
      await Payment.findOneAndUpdate(
        { stripe_session_id: session_id },
        { status: 'completed' }
      );

      return res.json({ status: 'completed' });
    }

    // Payment not completed yet
    return res.json({ status: session.payment_status });
  } catch (error) {
    console.error('Stripe verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

router.put('/:paymentId/cancel', async (req, res) => {
  const { paymentId } = req.params;
  const { status, updated_at } = req.body;

  if (status !== 'cancelled') {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    const client = await getMongoClient();
    const db = client.db('your-db-name');
    const payments = db.collection('payments');

    const result = await payments.updateOne(
      { _id: new ObjectId(paymentId) },
      { $set: { status, updated_at } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.status(200).json({ message: 'Payment cancelled successfully' });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports= router;
