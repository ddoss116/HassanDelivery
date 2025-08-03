export interface WhatsAppMessage {
  customerName: string;
  customerLocation: string;
  customerWhatsApp: string;
  orderDescription: string;
  estimatedCost: number;
  deliveryFee: number;
  totalCost: number;
  estimatedTime: string;
}

export async function sendWhatsAppNotification(
  message: WhatsAppMessage
): Promise<boolean> {
  try {
    // In a real implementation, you would integrate with WhatsApp Business API
    // For now, we'll format the message and log it
    // The actual implementation would depend on the WhatsApp API service you choose
    
    const whatsappMessage = formatWhatsAppMessage(message);
    
    // TODO: Replace with actual WhatsApp API call
    // Example with WhatsApp Business API:
    // const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: '966557808626', // Target number (0557808626 formatted for international)
    //     type: 'text',
    //     text: { body: whatsappMessage }
    //   })
    // });
    
    console.log("WhatsApp message to be sent to 0557808626:");
    console.log(whatsappMessage);
    
    // For development, we'll return true to simulate success
    return true;
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    return false;
  }
}

function formatWhatsAppMessage(message: WhatsAppMessage): string {
  return `🚚 *HassanDelivery - طلب جديد*

📋 *تفاصيل الطلب:*
👤 اسم الطالب: ${message.customerName}
📍 موقع الطالب: ${message.customerLocation}
📱 رقم واتساب الطالب: ${message.customerWhatsApp}
🛒 الطلب المطلوب: ${message.orderDescription}

💰 *التكلفة المحسوبة:*
• تكلفة المشتريات: ${message.estimatedCost} ريال
• رسوم التوصيل: ${message.deliveryFee} ريال
• *المجموع: ${message.totalCost} ريال*

⏰ *الوقت المتوقع:* ${message.estimatedTime}

تم الحساب بالذكاء الاصطناعي 🤖`;
}
