# 🔴 BLANK SCREEN AFTER DEPLOYMENT? DEBUGGING GUIDE

If you see a blank screen (just dark background) after deploying to Netlify, follow this systematic debugging guide.

## ⚡ QUICK CHECKLIST (Do These First!)

### 1. **Check Console for Errors** ← START HERE!
```
Steps:
1. Open your deployed site in browser
2. Press F12 (Windows) or Cmd+Option+I (Mac)
3. Click "Console" tab
4. Look for RED error messages
5. Copy the exact error and Google it
6. Share the error with your developer
```

**Common errors you might see:**
- ❌ `Supabase credentials not configured`
- ❌ `Cannot read property 'X' of undefined`
- ❌ `Module not found`
- ❌ `Failed to fetch Supabase`

---

### 2. **Verify Environment Variables on Netlify**
```
Steps:
1. Go to https://app.netlify.com
2. Click your site name
3. Go to Settings → Environment
4. Add these variables:
   - VITE_SUPABASE_URL = https://pguzlxoigpbjyfburfzw.supabase.co
   - VITE_SUPABASE_ANON_KEY = sb_publishable_4dYNskT-7b0uEfBfNUkUww_GMOTn6OR
5. Click "Save"
6. Go to Deploys → click latest deploy → "Trigger deploy"
```

⚠️ **WHY THIS MATTERS:**
- Without Supabase keys, the app crashes immediately
- The blank screen appears because error is silent

---

### 3. **Check _redirects File Exists**
```
The file should be at: public/_redirects
Content should be:
/*    /index.html   200

This tells Netlify: "For any URL, serve index.html"
Then React Router handles the routing.

WITHOUT THIS:
- /shop, /product/:id, etc. return 404 errors
- React Router never loads
```

---

### 4. **Verify Build Output**
```
Steps:
1. Go to Deploys tab
2. Click your latest deploy
3. Click "View deploy log"
4. Look for:
   ✅ "vite v5..." (means Vite ran)
   ✅ "dist/index.html" (HTML was built)
   ✅ "dist/assets/" (CSS/JS were built)
   ❌ Any red error messages = bad build
```

---

## 🔍 DETAILED DEBUGGING STEPS

### Step 1: Check Browser Console (Most Important!)

```
F12 → Console tab

What to look for:
✅ If EMPTY = good, problem is elsewhere
❌ If RED ERRORS = this is your issue!

Common errors and fixes:

1. "VITE_SUPABASE_URL is empty"
   Fix: Add environment variables to Netlify

2. "Cannot find module 'X'"
   Fix: Run 'npm install' locally, commit node_modules or use npm ci in build

3. "fetch failed" or "ERR_NAME_NOT_RESOLVED"
   Fix: Check internet connection, Supabase URL is correct

4. "Script error" (generic)
   Fix: Check Network tab, see which files failed to load
```

### Step 2: Check Network Tab (Files Loading?)

```
F12 → Network tab

Look for:
- index.html (should be 200 - green)
- CSS file (should be 200 - green)
- JavaScript file (should be 200 - green)

If RED (404/500):
- The file wasn't built correctly
- Run 'npm run build' locally and check dist/ folder
```

### Step 3: Check Build Locally

```bash
# In your project directory:

npm run build

# You should see:
# ✓ 973 modules transformed
# dist/index.html                 0.92 kB
# dist/assets/index-XYZ.css      27.53 kB
# dist/assets/index-ABC.js    1,542.92 kB
# ✓ built in 50.63s

# Check that files exist:
ls -la dist/
# Should show:
# - index.html
# - assets/
#   - index-*.css
#   - index-*.js
```

### Step 4: Test Locally Before Pushing

```bash
npm run build
npm run preview

# Then open http://localhost:4173/
# Try navigating to /shop, /product/1, etc.
# Everything should work
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: "Blank screen but no errors in console"

**Possible Causes:**
1. React app crashed silently (ErrorBoundary will help)
2. CSS not loading (check Network tab)
3. JavaScript bundle failed to load (check Network tab)

**Solution:**
```bash
# 1. Rebuild locally
npm run build

# 2. Check for errors
npm run preview

# 3. Open DevTools, look for errors

# 4. If still blank, check console for:
#    - Network errors
#    - Module loading failures
#    - Null reference errors

# 5. Commit and redeploy
git add .
git commit -m "Debug blank screen"
git push
```

---

### Issue 2: "Blank screen, console shows 'Cannot read property X of undefined'"

**Cause:** A component is trying to use undefined data

**Solution:**
```tsx
// Add error boundary logging:
console.log('Rendering HomePage...');

// Check if data exists before using it:
if (!data) {
  console.error('Data is undefined!');
  return <div>Loading...</div>;
}
```

---

### Issue 3: "404 errors on /shop, /product/:id but home page works"

**Cause:** Missing `_redirects` file

**Solution:**
```
1. Create file: public/_redirects
2. Add content:
   /*    /index.html   200
3. Rebuild: npm run build
4. Check dist/_redirects exists
5. Commit and push
6. Redeploy
```

---

### Issue 4: "Network shows all files load (200), but still blank"

**Cause:** React app is crashing after loading

**Solution:**
```tsx
// 1. Check App.tsx has ErrorBoundary:
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* ... */}
      </Router>
    </ErrorBoundary>
  );
}

// 2. Check main.tsx has error handling:
console.log('App mounting...');
try {
  root.render(<App />);
  console.log('App mounted successfully');
} catch (e) {
  console.error('App failed to mount:', e);
}

// 3. Check browser console for error messages
```

---

## 📊 DEBUGGING CHECKLIST

Create a systematic debug report:

```
Website: https://royshop.netlify.app
Deployed: [date]

✅/❌ Environment Variables Set?
      - VITE_SUPABASE_URL
      - VITE_SUPABASE_ANON_KEY

✅/❌ Console Errors? (F12 → Console)
      Error 1: [describe]
      Error 2: [describe]

✅/❌ Network Issues? (F12 → Network)
      index.html: [status code]
      CSS file: [status code]
      JS file: [status code]

✅/❌ Local Build Works?
      npm run build: [success/failed]
      npm run preview: [works/blank]

✅/❌ _redirects File Exists?
      Location: public/_redirects
      Content: /* /index.html 200

✅/❌ Build Logs Show Errors?
      Site → Deploys → View deploy log
      Errors: [list any]
```

---

## 🚀 DEPLOYMENT CHECKLIST (Before Pushing to Netlify)

```bash
# 1. Verify build works locally
npm run build
npm run preview
# Should see site at http://localhost:4173
# Test /shop, /product/1, etc.

# 2. Check _redirects file
ls public/_redirects
# Should exist

# 3. Check TypeScript compilation
npm run build
# Should show no errors

# 4. Verify environment variables locally
cat .env.local
# Should have VITE_SUPABASE_* keys

# 5. Commit everything
git status
git add .
git commit -m "Ready for Netlify deployment"

# 6. Push
git push

# 7. Trigger Netlify deploy
# Go to Netlify → Deploys → "Trigger deploy"

# 8. Wait for build
# Watch the deploy log for errors

# 9. Add Netlify env vars
# Settings → Environment → Add VITE_SUPABASE_* keys

# 10. Redeploy
# Deploys → "Trigger deploy"
```

---

## 📞 IF YOU STILL HAVE A BLANK SCREEN

Share these details with your developer:

```
1. Screenshot of DevTools Console (F12)
   - Show all red error messages
   
2. Screenshot of Network tab
   - Show status codes of index.html, CSS, JS files
   
3. Netlify build log
   - Deploys → latest deploy → View deploy log
   - Copy/paste any error messages
   
4. Confirm environment variables set:
   - Netlify → Settings → Environment
   - Screenshot showing variables are there
   
5. Confirm _redirects file exists:
   - Run: ls -la public/
   - Should show _redirects file
```

---

## 🎯 COMMON FIXES SUMMARY

| Issue | Fix |
|-------|-----|
| Blank screen, no errors | Check Network tab for failed files |
| Console shows errors | Read the error message, Google it |
| "404 on /shop" | Create public/_redirects with `/* /index.html 200` |
| "Supabase not configured" | Add VITE_SUPABASE_URL to Netlify env vars |
| "Module not found" | Run npm install locally, commit package-lock.json |
| Works locally, blank on Netlify | Probably missing env vars or _redirects |

---

**Last Resort:** If nothing works, try:
```bash
# 1. Delete node_modules and reinstall
rm -rf node_modules
npm install

# 2. Clear Netlify cache
# Netlify → Settings → clear cache & redeploy

# 3. Force rebuild
# Netlify → Deploys → click latest → "Retry deploy"
```

Good luck! 🚀
