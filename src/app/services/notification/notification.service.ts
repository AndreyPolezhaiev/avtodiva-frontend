import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public static showError(message: string, error?: HttpErrorResponse): void {
    const fullMessage = error?.message ? `${message}: ${error.message}` : message;
    console.error('Помилка при створенні заняття', error);
    alert(`❌ Помилка: ${fullMessage}`);
  }

  public static showSuccess(message: string): void {
    alert(`✅ Успіх: ${message}`);
  }

  public static showWarn(message: string): void {
    alert(`⚠️ Попередження: ${message}`);
  }
}