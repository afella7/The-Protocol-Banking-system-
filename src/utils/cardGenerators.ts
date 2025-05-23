// Generates a 16-digit card number as a string
export function generateCardNumber(): string {
  let cardNumber = '';
  for (let i = 0; i < 16; i++) {
    cardNumber += Math.floor(Math.random() * 10).toString();
  }
  return cardNumber;
}

// Generates expiry date in MM/YY format, 3 years from now
export function generateExpiryDate(): string {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = (now.getFullYear() + 3).toString().slice(-2);
  return `${month}/${year}`;
}

// Generates a 3-digit CVV as string
export function generateCVV(): string {
  let cvv = '';
  for (let i = 0; i < 3; i++) {
    cvv += Math.floor(Math.random() * 10).toString();
  }
  return cvv;
}
