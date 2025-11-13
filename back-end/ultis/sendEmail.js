import nodemailer from 'nodemailer';

const sendOrderEmail = async (order) => {
  try {
    // 1. Cấu hình người gửi (Transporter)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Tạo nội dung HTML cho Email (Hóa đơn điện tử)
    // Chúng ta sẽ tạo một bảng danh sách sản phẩm
    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <img src="${item.image}" alt="${item.name}" width="50" style="border-radius: 5px;" />
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}
          ${item.selectedColor ? `<br><small>Color: ${item.selectedColor}</small>` : ''}
          ${item.selectedStorage ? `<br><small>Size: ${item.selectedStorage}</small>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">x${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: `"Exclusive Shop" <${process.env.EMAIL_USER}>`, // Tên người gửi
      to: order.billingDetails.email, // Gửi đến email khách hàng nhập lúc checkout
      subject: `Order Confirmed #${order._id} - Thank you for your purchase!`, // Tiêu đề
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Exclusive.</h1>
            <p>Order Confirmation</p>
          </div>
          
          <div style="padding: 20px;">
            <p>Hi <strong>${order.billingDetails.firstName}</strong>,</p>
            <p>Thank you for your order! We've received it and will begin processing it right away.</p>
            
            <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-top: 30px;">Order Summary</h3>
            <p><strong>Order ID:</strong> #${order._id}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f9f9f9; text-align: left;">
                  <th style="padding: 10px;">Image</th>
                  <th style="padding: 10px;">Product</th>
                  <th style="padding: 10px;">Qty</th>
                  <th style="padding: 10px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: right; margin-top: 20px;">
              <p>Subtotal: <strong>$${order.subtotal.toFixed(2)}</strong></p>
              <p>Shipping: <strong>${order.shipping === 0 ? 'Free' : `$${order.shipping}`}</strong></p>
              <h2 style="color: #DB4444;">Total: $${order.total.toFixed(2)}</h2>
            </div>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 30px;">
              <h4 style="margin-top: 0;">Shipping Address</h4>
              <p style="margin: 0; color: #555;">
                ${order.billingDetails.streetAddress}, ${order.billingDetails.apartment ? order.billingDetails.apartment + ', ' : ''}
                ${order.billingDetails.townCity}
              </p>
              <p style="margin: 5px 0 0; color: #555;">Phone: ${order.billingDetails.phoneNumber}</p>
            </div>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            <p>If you have any questions, reply to this email or contact us at support@exclusive.com</p>
            <p>&copy; ${new Date().getFullYear()} Exclusive Shop. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // 3. Gửi mail
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${order.billingDetails.email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default sendOrderEmail;