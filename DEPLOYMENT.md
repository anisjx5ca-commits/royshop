# Deployment Guide - RoyShop

## Pre-Deployment Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] 3D models added to `public/models/`
- [ ] Supabase database schema created
- [ ] Sample products added to database
- [ ] All pages tested locally (`npm run dev`)
- [ ] WhatsApp number updated
- [ ] Product images optimized
- [ ] No console errors in browser DevTools

## Build Process

```bash
# Build the project
npm run build

# Preview the build locally
npm run preview
```

The build creates an optimized production version in the `dist/` folder.

## Deployment Options

### Option 1: Vercel (Recommended)

**Benefits:** Automatic deployments, edge functions, analytics

1. Push project to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import project from GitHub
4. Set environment variables in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your-url
   VITE_SUPABASE_ANON_KEY=your-key
   ```
5. Deploy with one click

### Option 2: Netlify

**Benefits:** Simple setup, free SSL, built-in analytics

1. Push project to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Site Settings
6. Deploy automatically

### Option 3: Firebase Hosting

**Benefits:** Google infrastructure, fast CDN

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Option 4: AWS S3 + CloudFront

**Benefits:** Highly scalable, cost-effective

1. Build project: `npm run build`
2. Create S3 bucket
3. Upload `dist/` contents to S3
4. Set up CloudFront distribution
5. Configure Route 53 for domain

### Option 5: Traditional VPS (DigitalOcean, Linode, etc.)

```bash
# SSH into server
ssh root@your-server-ip

# Clone repository
git clone https://github.com/yourusername/royshop.git
cd royshop

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies and build
npm install
npm run build

# Use Nginx as reverse proxy
sudo apt-get install nginx

# Configure Nginx (create /etc/nginx/sites-available/royshop)
# Then: sudo ln -s /etc/nginx/sites-available/royshop /etc/nginx/sites-enabled/
# And: sudo systemctl restart nginx

# Use PM2 for process management
sudo npm install -g pm2
pm2 start npm --name royshop -- run preview
pm2 startup
pm2 save
```

## Environment Configuration for Production

Create production environment variables:

```env
# .env.production (in root directory)
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_WHATSAPP_PHONE=213671234567
```

## Supabase Production Configuration

### Security Best Practices

1. **Enable RLS Policies:**
   - All tables should have RLS enabled
   - Policies are already in SQL schema

2. **API Keys:**
   - Use separate anon key for frontend (already done)
   - Keep service role key private
   - Rotate keys periodically

3. **Database Backups:**
   - Supabase automatically backs up daily
   - Configure backup retention (7 days minimum)

4. **Database Scaling:**
   - Monitor connection count
   - Upgrade to higher plan if needed
   - Monitor query performance

### Monitoring

1. Go to Supabase dashboard
2. Check **Logs** for errors
3. Monitor **Database** → **Connections**
4. Review **Storage** usage
5. Set up alerts for high resource usage

## Performance Optimization

### Frontend

1. **Enable Caching:**
   ```nginx
   # Add to Nginx config
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

2. **Enable Gzip Compression:**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   gzip_min_length 1000;
   ```

3. **Optimize Bundle Size:**
   - Run `npm run build`
   - Check output for warnings
   - Use `webpack-bundle-analyzer` if needed

### Backend (Supabase)

1. **Optimize Queries:**
   - Use indexes (already created in schema)
   - Select only needed columns
   - Use appropriate filters

2. **Connection Pooling:**
   - Supabase includes connection pooling
   - Configure if using custom connection

3. **CDN for Assets:**
   - Use Supabase Storage for product images
   - Enable cache control headers
   - Consider external CDN (Cloudflare)

## Domain Configuration

### Using Vercel/Netlify

1. Go to hosting provider dashboard
2. Add custom domain
3. Update DNS records (automated or manual)
4. Enable SSL (automatic)

### Using Custom Domain

1. Purchase domain (Namecheap, GoDaddy, etc.)
2. Get nameservers from hosting provider
3. Update domain DNS settings
4. Point to hosting provider
5. Enable SSL certificate (free via Let's Encrypt)

## Monitoring & Analytics

### Add Google Analytics (Optional)

```typescript
// In App.tsx
import { useEffect } from 'react';

useEffect(() => {
  // Add Google Analytics script
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_ID';
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_ID');
}, []);
```

### Monitor with Vercel Analytics

Already included if using Vercel deployment

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: vercel/actions/deploy-production@main
        with:
          token: ${{ secrets.VERCEL_TOKEN }}
```

## Rollback Plan

### If deployment fails:

1. Check deployment logs
2. Revert to previous version:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. Hosting provider will auto-redeploy

### Database issues:

1. Use Supabase backups to restore
2. Go to **Backups** → **Restore**
3. Select backup point
4. Click restore

## Post-Deployment Checklist

- [ ] Website loads at production URL
- [ ] All pages accessible
- [ ] 3D models load correctly
- [ ] Cart functionality works
- [ ] Checkout processes orders to Supabase
- [ ] Email notifications configured
- [ ] WhatsApp button works
- [ ] Mobile responsive tested
- [ ] Console has no errors
- [ ] Analytics tracking working
- [ ] SSL certificate valid
- [ ] Redirects configured (www to non-www)

## Common Deployment Issues

| Issue | Solution |
|-------|----------|
| Env vars not loading | Ensure keys are in hosting provider settings |
| 3D models 404 | Check public folder is deployed |
| CORS errors | Configure CORS in Supabase settings |
| Database connection timeout | Check Supabase status page |
| Slow loads | Enable caching, optimize images |
| WhatsApp not opening | Check phone number format |

## Maintenance

### Regular Tasks

- **Weekly:** Monitor error logs
- **Monthly:** Check Supabase usage
- **Quarterly:** Update dependencies
- **Annually:** Renew SSL certificates

### Update Dependencies Safely

```bash
# Check for outdated packages
npm outdated

# Update patch versions
npm update

# Update major versions (test thoroughly)
npm install package-name@latest

# Run tests after updates
npm run build
```

## Support URLs

- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs
- React: https://react.dev
- Vite: https://vitejs.dev

---

**Deployment is complete!** Your RoyShop store is now live.
