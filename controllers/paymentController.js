const { Cashfree } = require('cashfree-pg');
const { Order, Users } = require('../models');
const path = require('path');
require('dotenv').config();

const cf = new Cashfree(
  Cashfree.SANDBOX, // or Cashfree.PROD
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const orderId = `ORD_${Date.now()}`;
  const orderAmount = 499;

  try {
    const expiry = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      const orderRequest = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `user_${userId}`,
        customer_phone: req.user.phone || '9876543210',
        customer_email: req.user.email,
      },
      order_meta: {
        return_url: `http://localhost:3000/api/payment/status/${orderId}`
      },
      order_expiry_time: expiry
    };

    // Call Cashfree to create order
    const response = await cf.PGCreateOrder(orderRequest);

    // Save order to DB
    await Order.create({
      order_id: orderId,
      userId,
      amount: orderAmount,
      status: 'PENDING'
    });

    // Respond with session ID
    res.status(200).json({
      paymentSessionId: response.data.payment_session_id,
      orderId
    });


  } catch (err) {
    console.error("Create Order Error:", err.response?.data || err.message || err);
    res.status(500).json({ message: 'Could not create order' });
  }
};

exports.paymentStatus = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const response = await cf.PGFetchOrder(orderId);
    const status = response.data.order_status;

    const order = await Order.findOne({ where: { order_id: orderId } });
    if (!order) return res.status(404).send('Order not found');

    order.status = status;
    await order.save();

    if (status === 'PAID') {
      const user = await Users.findByPk(order.userId);
      if (user) {
        user.isPremium = true;
        await user.save();
      }

      // ✅ Send the success HTML file
      return res.sendFile(path.join(__dirname, '../public/paymentsuccess.html'));
    } else {
      res.send('❌ Payment not completed yet. Please try again.');
    }

  } catch (err) {
    console.error("Payment Status Check Error:", err.response?.data || err);
    res.status(500).send('Payment verification failed');
  }
};
