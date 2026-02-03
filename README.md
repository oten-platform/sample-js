# Oten IDP Vanilla JS Sample

[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES6+-f7df1e?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)](https://vitejs.dev/)
[![oidc-client-ts](https://img.shields.io/badge/oidc--client--ts-3.4.1-green)](https://github.com/authts/oidc-client-ts)

A sample Vanilla JavaScript application demonstrating authentication with **Oten IDP** using OpenID Connect (OIDC) and OAuth 2.0.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Code Examples](#-code-examples)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#-security-best-practices)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [Support](#-support)

## 🎯 Overview

This sample application demonstrates how to:

- ✅ Authenticate users with Oten IDP using Authorization Code Flow with PKCE
- ✅ Handle login and logout flows with redirects
- ✅ Manage authentication state with a custom AuthManager
- ✅ Store and retrieve user tokens securely
- ✅ Handle token expiration and session management
- ✅ Make authenticated API calls using access tokens

### Why oidc-client-ts?

This sample uses [`oidc-client-ts`](https://github.com/authts/oidc-client-ts), a certified OpenID Connect client library that provides:

- 🎯 **Standards Compliant** - Certified OpenID Connect implementation
- 🔄 **Automatic Token Renewal** - Handles token refresh automatically
- 📦 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
- 🛡️ **Type Safe** - Full TypeScript support out of the box
- ⚡ **Lightweight** - Minimal dependencies and small bundle size
- 🧪 **Well Tested** - Battle-tested in production applications

## ✨ Features

- **🔐 Secure Authentication** - OAuth 2.0 / OpenID Connect with PKCE
- **📦 Vanilla JavaScript** - No framework dependencies, pure ES6+
- **🎨 Beautiful UI** - Modern design with smooth animations
- **🔄 Session Management** - Automatic token storage and expiration handling
- **⚡ Fast Development** - Hot module replacement with Vite
- **📦 Minimal Dependencies** - Uses `oidc-client-ts` for seamless authentication
- **🛡️ Error Handling** - Comprehensive error handling and user feedback

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- An **Oten IDP account** with a configured application

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/oten-platform/sample-js.git
cd sample-js
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Oten IDP Application

1. Log in to your [Oten Developer Portal](https://developer.oten.com)
2. Create a new application or select an existing one
3. Configure the following settings:
   - **Application Type**: Single Page Application (SPA)
   - **Redirect URIs**: `http://localhost:5173`
   - **Logout URIs**: `http://localhost:5173`
   - **Allow Origins (CORS):**: `http://localhost:5173`
   - **Allowed Scopes**: `openid`, `profile`, `email`

4. Save your configuration and note your:
   - **Authority URL** (`https://account.oten.com/`)
   - **Client ID**

### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
VITE_OTEN_IDP_AUTH_DOMAIN=https://account.oten.com/
VITE_OTEN_IDP_CLIENT_ID=your_client_id_here
```

> ⚠️ **Important**: Never commit your `.env` file to version control. Add it to `.gitignore`.

### 5. Run the Application

```bash
npm run dev
```

The application will start at **http://localhost:5173**

### 6. Test the Authentication Flow

1. Open http://localhost:5173 in your browser
2. Click the **"Log In"** button
3. You'll be redirected to Oten IDP login page
4. Enter your credentials
5. After successful authentication, you'll be redirected back to the app
6. Your profile information will be displayed

## ⚙️ Configuration

### Environment Variables

| Variable                    | Required | Description                  | Example                     |
| --------------------------- | -------- | ---------------------------- | --------------------------- |
| `VITE_OTEN_IDP_AUTH_DOMAIN` | ✅ Yes   | Oten IDP authority URL       | `https://account.oten.com/` |
| `VITE_OTEN_IDP_CLIENT_ID`   | ✅ Yes   | Your application's client ID | `abc123xyz...`              |

### OIDC Configuration

The OIDC settings are configured in `src/main.js`:

```javascript
import { AuthManager } from "./auth.js";

const oidcSettings = {
  authority: import.meta.env.VITE_OTEN_IDP_AUTH_DOMAIN,
  client_id: import.meta.env.VITE_OTEN_IDP_CLIENT_ID,
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  scope: "openid profile email",
};

// Create auth manager instance
const auth = new AuthManager(oidcSettings);
```

## 📂 Project Structure

```
sample-js/
├── src/
│   ├── auth.js                  # AuthManager class wrapping oidc-client-ts
│   ├── main.js                  # Application entry point and UI rendering
│   └── styles.css               # Application styles
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment variables template
├── index.html                   # HTML entry point
├── package.json
├── vite.config.js
├── CONTRIBUTING.md              # Contributing guidelines
├── QUICK_START.md               # Quick start guide
└── README.md
```

## 🔍 How It Works

### Authentication Flow

```
┌─────────┐              ┌──────────────┐              ┌──────────────┐
│  User   │              │  Vanilla JS  │              │  Oten IDP    │
└────┬────┘              └──────┬───────┘              └──────┬───────┘
     │                          │                             │
     │  1. Click "Log In"       │                             │
     ├─────────────────────────>│                             │
     │                          │                             │
     │                          │  2. Redirect to /authorize  │
     │                          │     (with PKCE)             │
     │                          ├────────────────────────────>│
     │                          │                             │
     │  3. Redirected to Oten IDP login page                  │
     │<───────────────────────────────────────────────────────┤
     │                          │                             │
     │  4. Enter credentials    │                             │
     ├────────────────────────────────────────────────────────>
     │                          │                             │
     │  5. Redirect back with auth code                       │
     │<───────────────────────────────────────────────────────┤
     │                          │                             │
     │  6. Callback to app      │                             │
     ├─────────────────────────>│                             │
     │                          │                             │
     │                          │  7. Exchange code for tokens│
     │                          ├────────────────────────────>│
     │                          │                             │
     │                          │  8. Return access_token &   │
     │                          │     id_token                │
     │                          │<────────────────────────────┤
     │                          │                             │
     │                          │  9. Store tokens in         │
     │                          │     sessionStorage          │
     │                          │                             │
     │  10. Show profile        │                             │
     │<─────────────────────────┤                             │
     │                          │                             │
```

### Key Components

#### **AuthManager Class**

A custom wrapper around `oidc-client-ts` UserManager that:

- Manages user authentication state
- Handles login/logout flows
- Processes OAuth callbacks
- Manages token lifecycle
- Handles authentication errors
- Provides event-driven state updates via subscriber pattern

#### **UI Rendering Functions**

The `main.js` file contains functions to render different states:

- `renderLoading()` - Loading state during initialization
- `renderError(error)` - Error state for authentication failures
- `renderLoggedOut()` - Logged out state with login button
- `renderLoggedIn(user)` - Logged in state with user profile

### Automatic Features

`oidc-client-ts` automatically handles:

- **Token Storage** - Securely stores tokens in session/local storage
- **Token Renewal** - Automatically renews tokens before expiration
- **Callback Processing** - Handles OAuth callback parameters
- **Error Management** - Provides error events for authentication failures

## 📚 API Reference

### AuthManager Class

```javascript
import { AuthManager } from "./auth.js";

const auth = new AuthManager(oidcSettings);
```

#### Constructor

```javascript
new AuthManager(settings);
```

**Parameters:**

- `settings` (Object) - OIDC configuration object
- `authority` (string) - IDP authority URL
- `client_id` (string) - Client ID
- `redirect_uri` (string) - Redirect URI after login
- `post_logout_redirect_uri` (string) - Redirect URI after logout
- `scope` (string) - OAuth scopes (e.g., "openid profile email")

#### Methods

| Method                | Description                                  | Returns                  |
| --------------------- | -------------------------------------------- | ------------------------ |
| `initialize()`        | Initialize auth manager and handle callbacks | `Promise<void>`          |
| `login()`             | Initiate login flow                          | `Promise<void>`          |
| `logout()`            | Initiate logout flow                         | `Promise<void>`          |
| `clearError()`        | Clear current error state                    | `void`                   |
| `subscribe(callback)` | Subscribe to auth state changes              | `Function` (unsubscribe) |
| `getState()`          | Get current auth state                       | `Object`                 |

#### State Object

```javascript
{
  user: User | null,           // Current user object
  error: Error | null,         // Current error
  isLoading: boolean,          // Loading state
  isAuthenticated: boolean,    // Authentication status
  token: string | null         // Access token
}
```

#### User Object

```javascript
{
  profile: {
    sub: string,           // User ID
    name: string,          // Full name
    email: string,         // Email address
    picture?: string,      // Profile picture URL
    // ... other claims from your IDP
  },
  access_token: string,    // Access token
  id_token: string,        // ID token
  expires_at: number,      // Token expiration timestamp
}
```

### Making Authenticated API Calls

```javascript
const auth = new AuthManager(oidcSettings);

async function fetchProtectedData() {
  const state = auth.getState();

  if (!state.isAuthenticated || !state.user) return;

  const response = await fetch("https://api.example.com/protected", {
    headers: {
      Authorization: `Bearer ${state.user.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}
```

## 💻 Code Examples

### Complete Implementation Example

```javascript
import { AuthManager } from "./auth.js";

// Configure OIDC
const oidcSettings = {
  authority: "https://account.oten.com/",
  client_id: "your_client_id",
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  scope: "openid profile email",
};

// Create auth manager
const auth = new AuthManager(oidcSettings);

// Subscribe to state changes
auth.subscribe((state) => {
  if (state.isLoading) {
    console.log("Loading...");
  } else if (state.error) {
    console.error("Error:", state.error.message);
  } else if (state.isAuthenticated) {
    console.log("Logged in as:", state.user.profile.name);
  } else {
    console.log("Not authenticated");
  }
});

// Initialize
auth.initialize();

// Login
document.getElementById("login-btn").addEventListener("click", () => {
  auth.login();
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  auth.logout();
});
```

### Error Handling Example

```javascript
auth.subscribe((state) => {
  if (state.error) {
    // Display error to user
    const errorDiv = document.getElementById("error");
    errorDiv.textContent = state.error.message;
    errorDiv.style.display = "block";

    // Clear error after 5 seconds
    setTimeout(() => {
      auth.clearError();
    }, 5000);
  }
});
```

## 🐛 Troubleshooting

### Common Issues

#### **"Redirect URI mismatch" Error**

**Problem**: The redirect URI doesn't match what's configured in Oten Developer Portal.

**Solution**:

- Verify the redirect URI matches exactly what's in your Oten Developer Portal dashboard
- Include the protocol (`http://` or `https://`)
- Don't include trailing slashes unless configured that way
- For development, use `http://localhost:5173`

#### **"Invalid Client" Error**

**Problem**: Client ID is incorrect or client is not configured properly.

**Solution**:

- Double-check `VITE_OTEN_IDP_CLIENT_ID` in your `.env` file
- Ensure the client is enabled in Oten Developer Portal dashboard
- Verify the client is configured for Authorization Code Flow

#### **"No matching state found in storage" Error**

**Problem**: Authentication fails with state mismatch error after redirect.

**Solution**:

- Clear browser storage (Application → Storage → Clear site data in DevTools)
- Ensure callback handling is properly configured in `auth.js`
- Try in incognito/private mode to rule out storage issues
- Check that cookies and sessionStorage are enabled

#### **Session Lost on Page Refresh**

**Problem**: User is logged out when refreshing the page.

**Solution**:

- Check browser console for sessionStorage errors
- Verify sessionStorage is enabled in browser settings
- Ensure cookies are enabled (required for OIDC)
- Check that your domain is not blocking third-party cookies

#### **CORS Errors**

**Problem**: Browser blocks requests to Oten IDP.

**Solution**:

- Ensure `http://localhost:5173` is added to Allow Origins (CORS) in Oten Developer Portal dashboard
- Verify the authority URL is correct and accessible
- Check CORS settings in your Oten IDP application

#### **Token Expiration Issues**

**Problem**: Access token expires and user is logged out.

**Solution**:

- This is expected behavior when tokens expire
- The app shows an error message: "Your session has expired"
- User needs to log in again
- For automatic renewal, implement silent token refresh (advanced)

### Debug Mode

Open the browser console (F12) to see detailed logs:

- Check for error messages and stack traces
- Verify token storage in Application → Session Storage
- Monitor network requests to the IDP

## 🔒 Security Best Practices

This sample implements several security best practices:

- ✅ **Authorization Code Flow with PKCE** - Most secure OAuth flow for SPAs
- ✅ **State Parameter** - CSRF protection (handled by oidc-client-ts)
- ✅ **Nonce Validation** - Replay attack protection (handled by oidc-client-ts)
- ✅ **Token Storage** - Tokens stored in sessionStorage (consider httpOnly cookies for production)
- ✅ **HTTPS Required** - Always use HTTPS in production
- ✅ **Error Handling** - Comprehensive error handling and user feedback

### Production Recommendations

1. **Use HTTPS** - Always serve your app over HTTPS in production
2. **Environment Variables** - Never commit `.env` to version control
3. **Content Security Policy** - Add CSP headers to prevent XSS attacks
4. **Token Rotation** - Implement refresh token rotation if supported by your IDP
5. **Session Monitoring** - Track and monitor active user sessions
6. **Rate Limiting** - Implement rate limiting on authentication endpoints
7. **Audit Logging** - Log authentication events for security monitoring

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This sample application is provided as-is for educational and integration purposes.

## 🆘 Support

- **Documentation**: [Oten IDP Documentation](https://oten.gitbook.io/idp-support/integration/integration-document)
- **Need help**: [Oten IDP Support](https://oten.gitbook.io/idp-support/integration/integration-document#need-help)
- **GitHub Issues**: [GitHub Issues](https://github.com/oten-platform/sample-js/issues)

---

**Built with ❤️ using Vanilla JavaScript and Oten IDP**
