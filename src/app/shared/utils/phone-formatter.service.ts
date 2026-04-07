export class PhoneFormatter {
  public static formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^0-9]/g, '');
  }
}
