# Netlify Deployment Setup

Your code is now on GitHub! Follow these steps to deploy to Netlify:

## Step 1: Go to Netlify
1. Open your browser and go to [netlify.com](https://netlify.com)
2. Log in to your Netlify account

## Step 2: Import Your Project
1. Click **"Add new site"** button (or "Import an existing project")
2. Choose **"Import from Git"**
3. Select **"GitHub"**
4. Find and select your repository: **TaskMasterApp**

## Step 3: Configure Build Settings
Netlify should auto-detect your settings from `netlify.toml`, but verify:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 or higher

## Step 4: Deploy
1. Click **"Deploy site"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at a URL like: `https://random-name-12345.netlify.app`

## Step 5: Custom Domain (Optional)
- You can change the site name in Site settings → Domain management
- Or connect a custom domain if you have one

## Important Notes
- The login page will work correctly when deployed (no more cache issues)
- Your credentials are:
  - Username: `drewdrew`
  - Password: `Canley99!!`
  - PIN: `13031996`
- Sessions last 7 days before requiring re-login

## Troubleshooting
If the site doesn't work:
1. Check the deploy logs in Netlify
2. Make sure the build completed successfully
3. Clear your browser cache and try again

Your app is now ready for deployment! 🚀
