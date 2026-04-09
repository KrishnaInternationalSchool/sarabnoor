const upiId = "9811227938@pthdfc";
const payeeName = "Mehar Marwah";

const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}`;

export const donationConfig = {
  upiId,
  payeeName,
  upiUri,
  qrImageUrl:
    process.env.NEXT_PUBLIC_DONATION_QR_URL ||
    `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(upiUri)}`
};
