/**
 * Toast - Simple toast notification system
 */

export type ToastType = 'success' | 'error' | 'info';

export class Toast {
  private container: HTMLElement;

  constructor() {
    this.container = document.getElementById('toast-container') as HTMLElement;
  }

  show(message: string, type: ToastType = 'info', duration: number = 3000): void {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }
}

export default Toast;
