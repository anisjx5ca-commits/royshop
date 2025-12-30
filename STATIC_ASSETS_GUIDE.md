# Static Assets Management Guide for Netlify Deployment

## 🎯 Problem Summary

Your React/Vite project references 3D models and images with paths like:
- `/models/shirt-sample.glb`
- `/models/pants-sample.glb`
- etc.

**But these files don't exist in the `public/` directory**, causing 404 errors in Netlify deployment.

---

## ✅ Solution: Vite's Static Asset Handling

### How Vite Works

**Files in `public/` directory:**
- ✅ Copied **as-is** to the root of `dist/`
- ✅ Accessible via absolute paths starting with `/`
- ✅ NOT processed by Vite bundler
- ✅ NOT included in the final bundle hash

**Files in `src/` directory:**
- ❌ NOT copied to `dist/` unless imported in code
- ❌ Bundle-processed
- ❌ Must be imported/required in JavaScript

### The Rule

```
📁 public/
  └── models/
      └── shirt-sample.glb  ──➔  /models/shirt-sample.glb  ✅
  └── assets/
      └── images/
          └── logo.png      ──➔  /assets/images/logo.png   ✅

❌ src/images/logo.png       ──➔  NOT accessible via /images/logo.png
```

---

## 📁 Correct Directory Structure

```
d:\3d ferx\
├── public/                          👈 COPY FILES HERE
│   ├── models/
│   │   ├── shirt-sample.glb        📊 3D model files
│   │   ├── pants-sample.glb
│   │   ├── jacket-sample.glb
│   │   ├── polo-sample.glb
│   │   ├── shorts-sample.glb
│   │   ├── jeans-sample.glb
│   │   └── sweater-sample.glb
│   ├── assets/
│   │   └── images/
│   │       ├── placeholder.jpg     🖼️  Fallback images
│   │       └── ...
│   ├── _redirects                  🔄  Netlify routing
│   └── test.html
├── src/                             👈 SOURCE CODE ONLY
│   ├── components/
│   ├── pages/
│   ├── data/                        📊 NO static files here!
│   └── ...
└── dist/                            (Built - auto-generated)
```

---

## 🔧 How Your Code References Files

### ✅ Correct Usage (What You Have Now)

In your code (`src/data/ProductData.js`, components, etc.):

```javascript
// Models referenced with absolute paths
modelPath: '/models/shirt-sample.glb'    // ✅ CORRECT

// Images from external URLs
image: 'https://images.unsplash.com/...' // ✅ CORRECT

// Local images in public/
image: '/assets/images/placeholder.jpg'  // ✅ CORRECT
```

### ❌ WRONG (Don't do this)

```javascript
modelPath: '/public/models/shirt-sample.glb'  // ❌ WRONG
modelPath: 'src/models/shirt-sample.glb'     // ❌ WRONG
image: 'src/images/logo.png'                 // ❌ WRONG
```

**No `/public` in the path!** It's removed during build.

---

## 📋 What You Need to Do

### 1. **Create the Directories** (Already Done ✅)

```bash
public/models/           # For 3D model files
public/assets/images/    # For image files
```

### 2. **Add Your Files**

**Option A: Download Sample Models**
- Use free GLB models from:
  - [Sketchfab](https://sketchfab.com) (filter for GLB format)
  - [Poly Haven](https://polyhaven.com/models)
  - [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free)

**Place them in:** `public/models/`

**Option B: Use Your Existing Models**
- Copy your GLB/GLTF files to `public/models/`

**Option C: Use Fallback (No Models)**
- Users will see placeholder images instead
- 3D viewer will display error gracefully

### 3. **No Code Changes Needed!**

Your code already uses the correct paths:
```typescript
// ProductData.js
modelPath: '/models/shirt-sample.glb'  ✅ Ready to go

// ProductCard.tsx
src={product.image_url}  ✅ Already correct

// Model3D.tsx
useGLTF(modelPath)  ✅ Will load from public/
```

### 4. **Rebuild and Deploy**

```bash
npm run build      # Copies public/* to dist/
git add public/    # Commit your files
git push           # Push to GitHub
# Netlify auto-deploys
```

---

## 🔍 How to Verify

### Locally (Development)
```bash
npm run dev
# Visit http://localhost:5173/
# Open DevTools (F12) → Network tab
# Check for 404 errors on models or images
```

### After Build
```bash
npm run build
# Check dist/ folder:
ls dist/models/         # Should show your .glb files
ls dist/assets/images/  # Should show your images
```

### On Netlify
1. Open your site: https://royshop2.netlify.app
2. Open DevTools (F12) → Network tab
3. Filter for 404 errors
4. Models should load from `/models/` path

---

## 📊 Current Status

| Item | Status | Location |
|------|--------|----------|
| `public/models/` directory | ✅ Created | `d:\3d ferx\public\models\` |
| `public/assets/images/` directory | ✅ Created | `d:\3d ferx\public\assets\images\` |
| Code paths (absolute `/models/`) | ✅ Correct | ProductData.js, all components |
| Model files | ⏳ Pending | Add your `.glb` files here |
| Image files | ⏳ Optional | Add fallback images here |

---

## 🚀 Common Issues & Fixes

### Issue: 404 on 3D models after deploy
**Cause:** `.glb` files not in `public/models/`  
**Fix:** Add files to `public/models/` → rebuild → deploy

### Issue: Images show broken on Netlify
**Cause:** Using external URLs (Unsplash, etc.)  
**Fix:** Add to `public/assets/images/` or accept external dependency

### Issue: Paths work locally but not on Netlify
**Cause:** Missing `_redirects` file or SPA routing  
**Status:** ✅ Already configured in `public/_redirects`

### Issue: Model viewer shows error
**Cause:** File too large or corrupt GLB  
**Fix:** 
- Keep GLB files < 10MB
- Validate GLB files with [GLTFValidator](https://www.khronos.org/gltf/writers/gltfvalidator/)

---

## 📝 Next Steps

1. **Get 3D Models**
   - Option 1: Download from Sketchfab/Poly Haven
   - Option 2: Use your existing GLB files
   - Option 3: Create in Blender and export as GLB

2. **Add Fallback Images**
   ```
   public/assets/images/
   ├── placeholder.jpg     # Used when model fails
   ├── product-default.jpg
   └── ...
   ```

3. **Update Product Data (Optional)**
   - If you have better images, update `src/data/ProductData.js`

4. **Commit & Push**
   ```bash
   git add public/models/ public/assets/
   git commit -m "Add static assets (models and images)"
   git push origin main
   ```

5. **Rebuild on Netlify**
   - Netlify auto-rebuilds when you push
   - Check deployment logs at https://app.netlify.com/projects/royshop2

---

## 🎓 Learning Reference

### Vite Documentation
- [Static Asset Handling](https://vitejs.dev/guide/assets.html#the-public-directory)
- [Public Directory](https://vitejs.dev/guide/assets.html#importing-asset-as-url)

### Your Configuration
- **Entry Point:** `src/main.tsx`
- **Build Output:** `dist/`
- **Public Directory:** `public/`
- **Build Command:** `npm run build`
- **Public Path:** `/` (root)

---

## ✨ Summary

| Path Type | Location | Access Pattern |
|-----------|----------|-----------------|
| 3D Models | `public/models/` | `/models/filename.glb` |
| Images | `public/assets/images/` | `/assets/images/filename.jpg` |
| Component Code | `src/components/` | Imported in JS |
| Page Code | `src/pages/` | Routed in App.tsx |
| Static HTML | `public/` | `/{filename}` |

**Key Point:** Only files in `public/` become `/` accessible URLs. Everything else must be imported in your code.
