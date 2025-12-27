/**
 * LoginComponent - Password-protected login screen
 */

import { AuthService } from '../services/AuthService';

export class LoginComponent {
  private container: HTMLElement;
  private onLoginSuccess: () => void;

  constructor(onLoginSuccess: () => void) {
    this.container = document.getElementById('app') as HTMLElement;
    this.onLoginSuccess = onLoginSuccess;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="login-screen">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
          <div class="shape shape-6"></div>
        </div>
        
        <div class="login-container">
          <div class="login-header">
            <div class="login-icon-wrapper">
              <div class="login-icon">🔐</div>
              <div class="icon-glow"></div>
            </div>
            <h1>Productivity Hub</h1>
            <p>Your personal command center for tasks, habits, and goals</p>
          </div>
          
          <form id="login-form" class="login-form">
            <div class="login-field">
              <label for="username-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Username
              </label>
              <input 
                type="text" 
                id="username-input" 
                placeholder="Enter your username"
                autocomplete="username"
                required
                autofocus
              />
            </div>

            <div class="login-field">
              <label for="password-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Password
              </label>
              <input 
                type="password" 
                id="password-input" 
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />
            </div>

            <div class="login-field">
              <label for="pin-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
                PIN Code
              </label>
              <input 
                type="password" 
                id="pin-input" 
                placeholder="Enter your PIN"
                autocomplete="off"
                inputmode="numeric"
                maxlength="8"
                required
              />
            </div>
            
            <button type="submit" class="login-btn">
              <span>Sign In</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            
            <div id="error-message" class="error-message" style="display: none;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Incorrect credentials. Please try again.</span>
            </div>
          </form>
          
          <div class="login-footer">
            <div class="security-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Secured with SHA-256 encryption</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const usernameInput = document.getElementById('username-input') as HTMLInputElement;
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    const pinInput = document.getElementById('pin-input') as HTMLInputElement;
    const errorMessage = document.getElementById('error-message') as HTMLElement;
    const submitBtn = form.querySelector('.login-btn') as HTMLButtonElement;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Check if locked out
      const lockoutStatus = AuthService.isLockedOut();
      if (lockoutStatus.locked && lockoutStatus.remainingTime) {
        const minutes = Math.ceil(lockoutStatus.remainingTime / 60000);
        errorMessage.querySelector('span')!.textContent = `Too many failed attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
        errorMessage.style.display = 'flex';
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
        return;
      }
      
      console.log('Login form submitted');
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      const pin = pinInput.value.trim();
      
      console.log('Username:', username);
      console.log('Password length:', password.length);
      console.log('PIN:', pin);
      
      // Disable button during login
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Signing in...</span>';
      
      try {
        const success = await AuthService.login(username, password, pin);
        console.log('Login result:', success);
        
        if (success) {
          errorMessage.style.display = 'none';
          submitBtn.innerHTML = '<span>Success! ✓</span>';
          
          // Small delay for visual feedback
          setTimeout(() => {
            this.onLoginSuccess();
          }, 500);
        } else {
          // Check if now locked out
          const newLockoutStatus = AuthService.isLockedOut();
          if (newLockoutStatus.locked && newLockoutStatus.remainingTime) {
            const minutes = Math.ceil(newLockoutStatus.remainingTime / 60000);
            errorMessage.querySelector('span')!.textContent = `Too many failed attempts. Account locked for ${minutes} minute${minutes > 1 ? 's' : ''}.`;
          } else {
            const remainingAttempts = AuthService.getRemainingAttempts();
            errorMessage.querySelector('span')!.textContent = `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`;
          }
          
          errorMessage.style.display = 'flex';
          passwordInput.value = '';
          pinInput.value = '';
          usernameInput.focus();
          
          // Shake animation
          form.classList.add('shake');
          setTimeout(() => form.classList.remove('shake'), 500);
          
          // Re-enable button
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Sign In</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          `;
        }
      } catch (error) {
        console.error('Login error:', error);
        errorMessage.style.display = 'flex';
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Sign In</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    });
  }
}
