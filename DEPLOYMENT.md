# 🚀 Deployment Guide

This guide covers multiple deployment options for your Productivity App.

## Quick Deploy Options

### Option 1: Netlify (Recommended - Easiest)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy site"
   - Your app will be live in ~2 minutes!

3. **Custom Domain** (Optional):
   - In Netlify dashboard, go to "Domain settings"
   - Click "Add custom domain"
   - Follow DNS configuration instructions

### Option 2: Vercel

1. **Push to GitHub** (same as above)

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings from `vercel.json`
   - Click "Deploy"
   - Live in ~1 minute!

### Option 3: GitHub Pages

1. **Enable GitHub Pages**:
   - Push code to GitHub
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - The workflow in `.github/workflows/deploy.yml` will auto-deploy

2. **Access your app**:
   - URL: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Option 4: Self-Hosted (VPS/Server)

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your server

3. **Configure web server** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /sw.js {
           add_header Service-Worker-Allowed "/";
           add_header Cache-Control "no-cache";
       }
   }
   ```

4. **Enable HTTPS** with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Environment Configuration

### Production Build

The app is configured for production builds with:
- Minified JavaScript and CSS
- Tree-shaking for smaller bundle size
- Source maps for debugging
- Service Worker for offline support

### Build Command
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```

## Post-Deployment Checklist

- [ ] Test all features work correctly
- [ ] Verify data export/import functionality
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Test offline functionality (service worker)
- [ ] Verify all navigation links work
- [ ] Test data persistence (localStorage)
- [ ] Check responsive design on different screen sizes

## Performance Optimization

The app is already optimized with:
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Minification
- ✅ Compression
- ✅ Service Worker caching
- ✅ LocalStorage for data persistence

## Monitoring & Analytics (Optional)

### Add Google Analytics

Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

### Add Error Tracking (Sentry)

```bash
npm install @sentry/browser
```

Add to `src/main.ts`:
```typescript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

## Backup & Recovery

### Automatic Backups

Users can export their data from Settings → Export All Data

### Scheduled Backups (Optional)

Add a reminder feature to prompt users to backup weekly:
```typescript
// Check last backup date
const lastBackup = localStorage.getItem('last-backup-date');
const daysSinceBackup = lastBackup 
  ? Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
  : 999;

if (daysSinceBackup > 7) {
  // Show backup reminder
}
```

## Troubleshooting

### Build Fails
- Check Node.js version (requires 16+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Service Worker Not Working
- Ensure HTTPS is enabled (required for service workers)
- Check browser console for service worker errors
- Clear browser cache and reload

### Data Not Persisting
- Check if localStorage is enabled in browser
- Check browser storage quota
- Verify no browser extensions blocking localStorage

## Security Considerations

- ✅ All data stored locally (no server)
- ✅ No external API calls
- ✅ No user authentication required
- ✅ HTTPS recommended for service worker
- ✅ Content Security Policy headers recommended

### Recommended CSP Header
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
```

## Updating the App

### For Users
1. Export data from Settings
2. Clear browser cache
3. Reload page
4. Import data back

### For Developers
1. Make changes
2. Update version in `package.json`
3. Build: `npm run build`
4. Deploy (push to GitHub for auto-deploy)

## Support & Maintenance

### Regular Maintenance Tasks
- Monitor error logs
- Update dependencies: `npm update`
- Test on new browser versions
- Backup user data regularly
- Monitor performance metrics

### User Support
- Provide export/import instructions
- Document keyboard shortcuts
- Create video tutorials
- Set up FAQ page

## Success Metrics

Track these metrics post-deployment:
- Daily active users
- Data export frequency
- Feature usage (tasks, projects, habits)
- Error rates
- Page load time
- Mobile vs desktop usage

## Next Steps

After deployment:
1. Share with users
2. Gather feedback
3. Monitor usage
4. Plan feature updates
5. Optimize based on metrics

---

**Need Help?** Check the README.md for feature documentation or create an issue on GitHub.
