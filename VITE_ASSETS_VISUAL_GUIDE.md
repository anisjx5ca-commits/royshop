# Vite Static Assets - Visual Guide

## 🗺️ How Vite Handles Files

```
YOUR PROJECT
═════════════════════════════════════════════════════════════════

📁 src/                          📁 public/
├── App.tsx                       ├── models/
├── main.tsx                      │   ├── tshirt-sample.glb
├── index.css                     │   ├── jeans-sample.glb
├── components/                   │   ├── shirt-sample.glb
│   ├── Header.tsx                │   └── README.md
│   ├── Model3D.tsx               ├── assets/
│   └── ...                       │   └── images/
├── pages/                        │       ├── placeholder.jpg
│   ├── HomePage.tsx              │       └── README.md
│   └── ...                       ├── _redirects
└── data/                         └── test.html
    └── ProductData.js

     ↓ npm run build ↓
     
VITE BUILD PROCESS
═════════════════════════════════════════════════════════════════

Step 1: Bundle Source Code
  src/App.tsx + src/main.tsx + all imports
  → Transpile + minify → assets/index-HASH.js

Step 2: Process Styles
  src/index.css + all component styles
  → Bundle + minify → assets/index-HASH.css

Step 3: Copy Public Files (AS-IS)
  public/* → Copy directly to dist/ root
  No processing, no hashing, no bundling

Step 4: Generate HTML
  public/index.html (if exists) or auto-generated
  → Link to bundled JS/CSS
  → Ready to deploy

     ↓ Results ↓

OUTPUT DIRECTORY
═════════════════════════════════════════════════════════════════

dist/                               URL Path
├── assets/
│   ├── index-ABC123.js         /assets/index-ABC123.js
│   └── index-XYZ789.css        /assets/index-XYZ789.css
├── models/                      /models/
│   ├── tshirt-sample.glb        /models/tshirt-sample.glb ✅
│   ├── jeans-sample.glb         /models/jeans-sample.glb ✅
│   ├── shirt-sample.glb         /models/shirt-sample.glb ✅
│   └── README.md                /models/README.md
├── assets/                      /assets/
│   └── images/
│       ├── placeholder.jpg      /assets/images/placeholder.jpg ✅
│       └── README.md
├── index.html                   /index.html ✅
├── _redirects                   (Netlify config)
└── test.html
```

---

## 🔄 Path Reference in Code

```
React Component Code:
═════════════════════════════════════════════════════════════════

// In src/data/ProductData.js
const product = {
  modelPath: '/models/shirt-sample.glb'
  //         ↑ Starts with /
  //         ↑ NO /public/ prefix
  //         ↑ Vite already stripped it
}

// In src/components/Model3D.tsx
const gltf = useGLTF(modelPath)
// modelPath = '/models/shirt-sample.glb'
// Loads from: dist/models/shirt-sample.glb ✅

// In src/components/ProductCard.tsx
<img src={product.image_url} />
// image_url = '/assets/images/placeholder.jpg'
// OR external URL = 'https://images.unsplash.com/...'
// Loads from: dist/assets/images/placeholder.jpg ✅
```

---

## 🚀 From Local to Netlify

```
LOCAL MACHINE
═════════════════════════════════════════════════════════════════

You create files:
d:\3d ferx\
├── public/models/
│   └── shirt-sample.glb          ← You add this
├── src/
│   └── ProductData.js            ← References /models/...

You run:
  npm run build
  ↓ Creates dist/ with files ↓
  ├── dist/models/shirt-sample.glb
  └── dist/index.html

You push to GitHub:
  git add public/
  git commit -m "Add models"
  git push origin main

     ↓ ↓ ↓ ↓ ↓ ↓

GITHUB REPOSITORY
═════════════════════════════════════════════════════════════════

https://github.com/anisjx5ca-commits/royshop

main branch contains:
├── public/models/
│   └── shirt-sample.glb          ← Stored here
├── src/
└── ...

     ↓ ↓ ↓ ↓ ↓ ↓

NETLIFY DEPLOYMENT
═════════════════════════════════════════════════════════════════

Webhook triggered (on push to main):

1. Clone repository
   git clone https://github.com/...
   → Get all files from GitHub

2. Install dependencies
   npm install

3. Build project
   npm run build
   → Creates dist/ with models

4. Deploy to CDN
   dist/* → Upload to Netlify servers
   → https://royshop2.netlify.app/

Live URLs:
  https://royshop2.netlify.app/models/shirt-sample.glb      ✅
  https://royshop2.netlify.app/assets/images/placeholder.jpg ✅
  https://royshop2.netlify.app/index.html                   ✅
```

---

## 📊 File Journey Diagram

```
File: tshirt-sample.glb
════════════════════════════════════════════════════════════════

Step 1: YOU ADD IT
  Source: Downloads/tshirt-sample.glb
  ↓ (copy) ↓
  d:\3d ferx\public\models\tshirt-sample.glb
  
Step 2: VITE BUILDS
  d:\3d ferx\public\models\tshirt-sample.glb
  ↓ (copy as-is) ↓
  d:\3d ferx\dist\models\tshirt-sample.glb
  
Step 3: YOU PUSH
  d:\3d ferx\public\models\tshirt-sample.glb
  ↓ (git push) ↓
  GitHub: main/public/models/tshirt-sample.glb
  
Step 4: NETLIFY BUILDS
  GitHub: main/public/models/tshirt-sample.glb
  ↓ (npm run build) ↓
  Netlify server: dist/models/tshirt-sample.glb
  
Step 5: USER ACCESS
  Browser loads: https://royshop2.netlify.app/models/tshirt-sample.glb
  ↓ (HTTP GET) ↓
  Netlify serves: dist/models/tshirt-sample.glb
  ↓ (200 OK) ↓
  User sees: 3D model renders ✅
```

---

## ⚡ Request Flow

```
User visits: https://royshop2.netlify.app/shop
════════════════════════════════════════════════════════════════

Browser loads:
  https://royshop2.netlify.app/
    ├── /index.html                  (HTML shell)
    ├── /assets/index-ABC.js         (React bundle)
    ├── /assets/index-XYZ.css        (Styles)
    └── Product page renders...

Component references model:
  ModelPath = '/models/shirt-sample.glb'
    ↓ Browser makes request ↓
  https://royshop2.netlify.app/models/shirt-sample.glb
    ↓ Netlify responds ↓
  (Serves from dist/models/shirt-sample.glb)
    ↓ Response ↓
  Content-Type: model/gltf-binary
  Status: 200 OK
  
Three.js loads:
  useGLTF(modelPath) ← receives file data
    ↓ Parse GLB ↓
  Create 3D scene with model
    ↓ Render ↓
  User sees: 3D shirt on screen ✅
```

---

## 🔍 Checking Status

### Local Development

```
1. Add files to public/models/
   ✓ Files exist: d:\3d ferx\public\models\*.glb

2. Run build
   npm run build
   ✓ Check output: dist/models/ folder created
   ✓ Files present: dist/models/*.glb

3. Dev server
   npm run dev
   ✓ Visit: http://localhost:5173
   ✓ Check Network tab: /models/*.glb (200 OK)
```

### GitHub

```
1. Commit files
   git add public/models/
   git commit -m "Add models"
   ✓ Files staged: public/models/*.glb

2. Push to GitHub
   git push origin main
   ✓ Check: https://github.com/.../public/models/
   ✓ Files visible in GitHub UI
```

### Netlify Live

```
1. Monitor deployment
   https://app.netlify.com/projects/royshop2/deploys
   ✓ Build completes without errors
   ✓ Status shows "Published"

2. Test live site
   https://royshop2.netlify.app
   ✓ DevTools Network tab
   ✓ Requests to /models/*.glb
   ✓ Status: 200 OK
   ✓ No 404 errors
```

---

## ✅ Success Indicators

```
✅ LOCAL DEVELOPMENT
   npm run build → dist/models/ exists with files
   npm run dev → /models/*.glb loads (Network tab)
   Page displays 3D models

✅ GITHUB PUSH
   git push succeeds
   Files visible in GitHub web UI
   No "file too large" warnings

✅ NETLIFY DEPLOYMENT
   Build logs show "created 1345 files" or similar
   Deploy preview shows ✅ Published
   No build errors

✅ LIVE SITE
   https://royshop2.netlify.app loads
   DevTools Network: /models/*.glb returns 200
   3D models render on product pages
```

---

## 🎯 Why This Works

```
The Key Principle:
════════════════════════════════════════════════════════════════

"Files in public/ are copied as-is to dist/ root"

This means:
  public/models/A.glb → dist/models/A.glb → /models/A.glb

Why?
  - No processing needed (GLB is binary format)
  - Can be served as static files
  - CDN-friendly (no dependencies)
  - Browser can load directly

Contrast with source code:
  src/App.tsx → Transpile → Minify → Hash → dist/assets/index-ABC.js
  Why different?
  - Needs transpilation (TypeScript → JavaScript)
  - Needs optimization (minification)
  - Needs cache busting (hash in filename)

Static assets don't need this treatment!
```

---

## 📈 Scaling Tips

### Adding More Models
```
public/models/
├── tshirt-sample.glb
├── jeans-sample.glb
├── shirt-sample.glb
├── jacket-sample.glb
├── polo-sample.glb
├── shorts-sample.glb
└── sweater-sample.glb

Just add files → rebuild → deploy
```

### Optimizing File Size
```
Original: model.glb (50 MB)
Too large!

Solution:
1. Reduce polygon count in Blender
2. Compress textures
3. Use optimizers like gltfpack
4. Result: model.glb (5 MB) ✅

Rule: Each file < 5-10 MB
```

### Versioning Models
```
If you update a model:
  public/models/tshirt-sample-v2.glb
  
Update code:
  ProductData.js → '/models/tshirt-sample-v2.glb'

Deploy:
  npm run build
  git commit && push
  Netlify auto-deploys
```

---

## 🎓 Key Takeaways

1. **public/ = Static Assets**
   - Files copied as-is
   - No processing
   - Serve directly

2. **src/ = Source Code**
   - TypeScript/JSX
   - Gets transpiled
   - Gets bundled
   - Gets hashed

3. **Paths in Code**
   - `/models/file.glb` ✅ (correct)
   - `/public/models/file.glb` ❌ (wrong)
   - `src/models/file.glb` ❌ (wrong)

4. **Build Output**
   - dist/ = ready to deploy
   - Contains everything
   - No /public/ directory

5. **Netlify**
   - Gets files from GitHub
   - Runs npm run build
   - Serves dist/ folder
   - Auto-redeploys on push

---

Ready to add your models! 🚀
