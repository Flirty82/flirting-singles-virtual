const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment setup
const Environment = process.env.NODE_ENV === 'production' 
  ? paypal.core.LiveEnvironment 
  : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

class PayPalService {
  // Create order
  async createOrder(amount, description, customId) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: description,
        custom_id: customId
      }],
      application_context: {
        brand_name: 'Flirting Singles',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      }
    });

    const order = await paypalClient.execute(request);
    return order.result;
  }

  // Capture order
  async captureOrder(orderId) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    
    const capture = await paypalClient.execute(request);
    return capture.result;
  }

  // Get order details
  async getOrder(orderId) {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const order = await paypalClient.execute(request);
    return order.result;
  }

  // Refund payment
  async refundPayment(captureId, amount) {
    const request = new paypal.payments.CapturesRefundRequest(captureId);
    request.requestBody({
      amount: {
        value: amount.toString(),
        currency_code: 'USD'
      }
    });

    const refund = await paypalClient.execute(request);
    return refund.result;
  }
}

module.exports = new PayPalService();