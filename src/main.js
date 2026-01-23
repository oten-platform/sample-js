import { AuthManager } from "./auth.js";
import "./styles.css";

const DEFAULT_PROFILE_PICTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110' viewBox='0 0 110 110'%3E%3Ccircle cx='55' cy='55' r='55' fill='%23667eea'/%3E%3Cpath d='M55 50c8.28 0 15-6.72 15-15s-6.72-15-15-15-15 6.72-15 15 6.72 15 15 15zm0 7.5c-10 0-30 5.02-30 15v3.75c0 2.07 1.68 3.75 3.75 3.75h52.5c2.07 0 3.75-1.68 3.75-3.75V72.5c0-9.98-20-15-30-15z' fill='%23fff'/%3E%3C/svg%3E";

// OIDC Settings from environment variables
const oidcSettings = {
  authority: import.meta.env.VITE_OTEN_IDP_AUTH_DOMAIN,
  client_id: import.meta.env.VITE_OTEN_IDP_CLIENT_ID,
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  scope: "openid profile email",
};

// Create auth manager instance
const auth = new AuthManager(oidcSettings);

const root = document.getElementById("root");

function renderLoading() {
  root.innerHTML = `
        <div class="app-container">
            <div class="loading-state">
                <div class="loading-text">Loading...</div>
            </div>
        </div>
    `;
}

function renderError(error) {
  root.innerHTML = `
        <div class="app-container">
            <div class="main-card-wrapper">
                <div class="error-section">
                    <div class="error-icon">⚠️</div>
                    <h1 class="error-title">Authentication Error</h1>
                    <p class="error-message">${error.message}</p>
                    <div class="error-actions">
                        <button id="dismiss-btn" class="button logout">Dismiss</button>
                        <button id="retry-btn" class="button login">Try Again</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("dismiss-btn").addEventListener("click", () => {
    auth.clearError();
  });

  document.getElementById("retry-btn").addEventListener("click", () => {
    auth.clearError();
    auth.login();
  });
}

function renderLoggedOut() {
  root.innerHTML = `
        <div class="app-container">
            <div class="main-card-wrapper">
                <h1 class="main-title">Welcome to Oten IDP Sample</h1>
                <div class="action-card">
                    <p class="action-text">Get started by signing in to your account</p>
                    <button id="login-btn" class="button login">Log In</button>
                </div>
            </div>
        </div>
    `;

  document.getElementById("login-btn").addEventListener("click", () => {
    auth.login();
  });
}

function renderLoggedIn(user) {
  const profile = user.profile;
  const name = profile.name || profile.preferred_username || "User";
  const email = profile.email || "";
  const picture = profile.picture || DEFAULT_PROFILE_PICTURE;

  root.innerHTML = `
        <div class="app-container">
            <div class="main-card-wrapper">
                <h1 class="main-title">Welcome to Oten IDP Sample</h1>
                <div class="logged-in-section">
                    <div class="logged-in-message">✅ Successfully authenticated!</div>
                    <h2 class="profile-section-title">Your Profile</h2>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                        <img
                            id="profile-img"
                            src="${picture}"
                            alt="${name}"
                            class="profile-picture"
                            style="object-fit: cover;"
                        />
                        <div style="text-align: center;">
                            <div class="profile-name">${name}</div>
                            ${email ? `<div class="profile-email">${email}</div>` : ""}
                        </div>
                    </div>
                    <button id="logout-btn" class="button logout">Log Out</button>
                </div>
            </div>
        </div>
    `;

  // Handle image error (fallback to default)
  document.getElementById("profile-img").addEventListener("error", (e) => {
    e.target.src = DEFAULT_PROFILE_PICTURE;
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    auth.logout();
  });
}

/**
 * Update UI based on auth state
 */
function render(state) {
  if (state.isLoading) {
    renderLoading();
    return;
  }

  if (state.error) {
    renderError(state.error);
    return;
  }

  if (state.isAuthenticated && state.user) {
    renderLoggedIn(state.user);
  } else {
    renderLoggedOut();
  }
}

// Subscribe to auth state changes
auth.subscribe(render);

// Initial render
renderLoading();

// Initialize auth manager
auth.initialize();
