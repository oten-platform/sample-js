# Quick Start Guide

Get your Oten IDP Vanilla JS app running in 5 minutes using `oidc-client-ts`! ⚡

## ✅ Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Oten IDP account created
- [ ] Application configured in Oten IDP dashboard

## 🚀 5-Minute Setup

### Step 1: Install (1 min)

```bash
npm install
```

### Step 2: Configure Oten IDP (2 min)

1. Go to [Oten Developer Portal](https://developer.oten.live)
2. Create/select your application
3. Add these URLs:
   - **Redirect URIs**: `http://localhost:5173`
   - **Logout URIs**: `http://localhost:5173`
   - **Allow Origins (CORS):**: `http://localhost:5173`
4. Copy your **Client ID**

### Step 3: Create .env File (1 min)

```bash
# Create .env file
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
VITE_OTEN_IDP_AUTH_DOMAIN=https://account.oten.live/
VITE_OTEN_IDP_CLIENT_ID=your_client_id_here
```

### Step 4: Run (1 min)

```bash
npm run dev
```

Open http://localhost:5173 and click **"Log In"**! 🎉

## 🐛 Troubleshooting

### "Redirect URI mismatch"

- Check that `http://localhost:5173` is in your Oten Developer Portal

### "Invalid Client"

- Verify your Client ID in `.env` is correct

### Can't log in

- Make sure you created an account in Oten IDP
- Check browser console for errors

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
- Explore the code in `src/` directory

## 🆘 Need Help?

- [Documentation](https://oten.gitbook.io/idp-support/integration/integration-document)
- [GitHub Issues](https://github.com/oten-platform/sample-js/issues)

---

**Happy coding! 🚀**
