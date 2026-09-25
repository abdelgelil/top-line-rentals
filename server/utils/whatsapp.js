// server/utils/whatsapp.js

export const sendWhatsAppToClient = async (clientPhone, bookingDetails) => {
  try {
    console.log(`[WhatsApp Utility] Preparing to send message to: ${clientPhone}`);
    console.log(`[WhatsApp Utility] Booking details:`, bookingDetails);

    // TODO: Connect Meta Cloud API or whatsapp-web.js client here
  } catch (error) {
    console.error('[WhatsApp Utility Error]:', error);
  }
};