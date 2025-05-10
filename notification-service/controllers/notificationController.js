const axios = require("axios");
const { sendSMS } = require("../utils/sms");
const { sendEmail } = require("../utils/email");

const notifyCustomer = async (req, res) => {
  const { customerId, orderId, type } = req.body;

  try {
    const userRes = await axios.get(`http://user-service:5006/api/customers/${customerId}`); // Change to actual User Service URL
    const customer = userRes.data.customer;

    const smsMessage = `AMBULA.LK\n\nHello ${customer.first_name} ${customer.last_name},\n\nYour order ${orderId} has been confirmed.\n\nThank you for ordering with us!`;
    const emailSubject = "Order Confirmation";
    const emailBody = `AMBULA.LK\n\nHello ${customer.first_name} ${customer.last_name},\n\nYour order ${orderId} has been confirmed.\n\nThank you for ordering with us!`;

    await sendSMS(customer.phone, smsMessage);
    await sendEmail(customer.email, emailSubject, emailBody);

    res.status(200).json({ message: "Notifications sent" });
  } catch (err) {
    console.error("❌ Notification error:", err.message);
    res.status(500).json({ error: "Failed to send notifications" });
  }
};

module.exports = { notifyCustomer };