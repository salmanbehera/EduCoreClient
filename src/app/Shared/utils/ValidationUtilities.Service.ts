import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationUtilsService {

  // Check if a value is a valid email address
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Check if a value is a valid phone number
  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/; // Adapt the regex to your needs
    return phoneRegex.test(phone);
  }

  // Check if a password meets complexity criteria
  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  }

  // Check if a string is a valid URL
  isValidUrl(url: string): boolean {
    const urlRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}\/?.*$/i;
    return urlRegex.test(url);
  }

  // Check if a string is a valid date
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  // Check if a username meets specific criteria
  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Alphanumeric and underscores, 3-15 characters
    return usernameRegex.test(username);
  }

  // Validate credit card numbers using the Luhn algorithm
  isValidCreditCard(cardNumber: string): boolean {
    const regex = /^[0-9]{13,19}$/; // Visa, MasterCard, etc. 
    if (!regex.test(cardNumber)) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Check if a ZIP code is valid
  isValidZipCode(zip: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/; // US ZIP code format
    return zipRegex.test(zip);
  }

  // Check if a password is strong
  isStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,}$/; // At least 10 characters, one upper, one lower, one digit, one special char
    return strongPasswordRegex.test(password);
  }
}
