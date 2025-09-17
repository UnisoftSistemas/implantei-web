/**
 * Format phone number input with Brazilian phone mask
 * Handles both 10 and 11 digit phone numbers
 */
export function formatPhoneInput(value: string): string {
  if (!value) return "";

  // Remove all non-digits
  const digits = value.replace(/\D/g, "");

  // Apply formatting based on length
  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    // 11 digits (with 9 in mobile)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(
      3,
      7
    )}-${digits.slice(7, 11)}`;
  }
}

/**
 * Clean phone number removing all formatting
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Validate Brazilian phone number
 */
export function isValidPhone(phone: string): boolean {
  const digits = cleanPhone(phone);
  return digits.length >= 10 && digits.length <= 11;
}
