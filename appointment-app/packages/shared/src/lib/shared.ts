
export function shared(): string {
  return 'shared';
}

/**
 * Checks if the given email address is valid.
 * A valid email must match the following pattern:
 * - Starts with a combination of letters, numbers, periods, or hyphens.
 * - Followed by an @ symbol.
 * - After the @ symbol, a domain part must follow consisting of letters, numbers, periods, or hyphens.
 * - Ends with a top-level domain (TLD) consisting of at least two letters.
 *
 * @param email - The email address to validate.
 * @returns true if the email address is valid, otherwise false.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Checks if the given password is valid.
 * A valid password must meet the following criteria:
 * - Contains at least one uppercase letter.
 * - Contains at least one lowercase letter.
 * - Contains at least one number.
 * - Has a minimum length of 4 characters.
 *
 * @param password - The password to validate.
 * @returns true if the password meets the criteria, otherwise false.
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{4,}$/;
  return passwordRegex.test(password);
}

/**
 * Checks if the given input is a valid name.
 * A valid name is considered one that is not just whitespace and contains at least one non-whitespace character.
 *
 * @param input - The name to validate.
 * @returns true if the name is valid, otherwise false.
 */
export function isValidName(input: string): boolean {
  const nameRegex = /^\s*\S+/;
  return nameRegex.test(input);
}

