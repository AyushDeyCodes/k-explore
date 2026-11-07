export interface RegistrationFormValues {
  name: string;
  email: string;
  phone: string;
  organization: string;
}

export type RegistrationFormErrors = Partial<Record<keyof RegistrationFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

export function normalizeIndianMobile(value: string): string {
  const digits = value.replace(/[\s()-]/g, '');
  if (digits.startsWith('+91')) return digits.slice(3);
  if (digits.startsWith('91') && digits.length === 12) return digits.slice(2);
  if (digits.startsWith('0') && digits.length === 11) return digits.slice(1);
  return digits;
}

export function isValidIndianMobile(value: string): boolean {
  return INDIAN_MOBILE_PATTERN.test(normalizeIndianMobile(value));
}

export function validateRegistrationForm(values: RegistrationFormValues): RegistrationFormErrors {
  const errors: RegistrationFormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const organization = values.organization.trim();

  if (name.length < 2) errors.name = 'Enter your full name (at least 2 characters).';
  else if (name.length > 120) errors.name = 'Name must be 120 characters or fewer.';

  if (!email) errors.email = 'Email address is required.';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email, for example name@example.com.';

  if (!values.phone.trim()) errors.phone = 'Mobile number is required.';
  else if (!isValidIndianMobile(values.phone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number starting with 6 to 9.';
  }

  if (organization.length > 120) errors.organization = 'Organization must be 120 characters or fewer.';

  return errors;
}
