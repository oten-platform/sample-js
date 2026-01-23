import { UserManager } from "oidc-client-ts";

/**
 * Authentication Manager for Vanilla JS
 * Wraps oidc-client-ts UserManager with error handling
 */
export class AuthManager {
  constructor(settings) {
    this.userManager = new UserManager(settings);
    this.user = null;
    this.error = null;
    this.isLoading = true;
    this.listeners = [];
    this._setupEventListeners();
  }

  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Called when auth state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  _notifyListeners() {
    this.listeners.forEach((callback) => callback(this.getState()));
  }

  _setupEventListeners() {
    // User successfully loaded
    this.userManager.events.addUserLoaded((user) => {
      this.user = user;
      this.error = null;
      this._notifyListeners();
    });

    // Access token expired
    this.userManager.events.addAccessTokenExpired(() => {
      this.user = null;
      this.error = new Error("Your session has expired. Please log in again.");
      this._notifyListeners();
    });

    // Silent renew error
    this.userManager.events.addSilentRenewError((err) => {
      this.error = new Error("Session renewal failed");
      this._notifyListeners();
    });

    // User signed out
    this.userManager.events.addUserSignedOut(() => {
      this.user = null;
      this._notifyListeners();
    });
  }

  /**
   * Initialize the auth manager - handle callback and load existing user
   */
  async initialize() {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      // Check for error in URL
      if (urlParams.has("error")) {
        throw new Error(
          urlParams.get("error_description") || "Authentication failed",
        );
      }

      // Handle callback if code is present
      if (urlParams.has("code")) {
        this.user = await this.userManager.signinCallback();
        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }

      // Get existing user if not already set
      if (!this.user) {
        this.user = await this.userManager.getUser();
      }
    } catch (err) {
      this.error =
        err instanceof Error
          ? err
          : new Error("Authentication initialization failed");
    } finally {
      this.isLoading = false;
      this._notifyListeners();
    }
  }

  async login() {
    try {
      this.error = null;
      await this.userManager.signinRedirect();
    } catch (err) {
      this.error = err instanceof Error ? err : new Error(String(err));
      this._notifyListeners();
    }
  }

  async logout() {
    try {
      this.error = null;
      await this.userManager.signoutRedirect();
    } catch (err) {
      this.error = err instanceof Error ? err : new Error(String(err));
      this._notifyListeners();
    }
  }

  clearError() {
    this.error = null;
    this._notifyListeners();
  }

  getState() {
    return {
      user: this.user,
      error: this.error,
      isLoading: this.isLoading,
      isAuthenticated: !!this.user && !this.user.expired,
      token: this.user?.access_token || null,
    };
  }
}
