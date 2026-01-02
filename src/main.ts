/**
 * Main entry point for the Categorized To-Do List application
 */

import { App } from './App';
import { FloatingDotsBackground } from './utils/floatingDots';
import { AuthService } from './services/AuthService';
import { LoginComponent } from './components/LoginComponent';

// Initialize floating dots background
const floatingDots = new FloatingDotsBackground();
floatingDots.start();

// Unregister any existing service workers to prevent caching issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('Service Worker unregistered');
    }
  });
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, checking authentication...');
  
  // Check authentication
  if (!AuthService.isAuthenticated()) {
    console.log('Not authenticated, showing login screen');
    // Show login screen
    const loginComponent = new LoginComponent(() => {
      console.log('Login successful, reloading page...');
      // On successful login, do a full page reload to get fresh HTML
      window.location.reload();
    });
    loginComponent.render();
  } else {
    console.log('Already authenticated, loading app...');
    // Already authenticated, extend session and load app
    AuthService.extendSession();
    
    // Check if the app HTML structure exists
    const navHub = document.getElementById('nav-hub');
    const calendarContainer = document.getElementById('calendar-container');
    
    if (!navHub || !calendarContainer) {
      console.error('App HTML structure not found, this may be a caching issue');
      // Force a hard reload to get fresh HTML
      window.location.href = window.location.pathname + '?refresh=' + Date.now();
      return;
    }
    
    initializeApp();
  }
});

async function initializeApp() {
  console.log('Initializing app...');
  
  try {
    // Create and initialize the app
    const app = new App();
    app.setFloatingDots(floatingDots);
    await app.initialize();
    
    console.log('App initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}
