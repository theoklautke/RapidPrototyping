
export function shared(): string {
  return 'shared';
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,}$/;
  return passwordRegex.test(password);
}

export function isValidName(input: string): boolean {
  const nameRegex = /^\s*\S+/;
  return nameRegex.test(input);
}

