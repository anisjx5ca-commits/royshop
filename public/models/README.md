# 3D Models Directory

Place your GLB/GLTF 3D model files here.

## Expected Files

- tshirt-sample.glb
- jeans-sample.glb
- shirt-sample.glb
- jacket-sample.glb
- polo-sample.glb
- shorts-sample.glb
- sweater-sample.glb

## Sources for Free Models

- **Sketchfab:** https://sketchfab.com (filter by GLB format)
- **Poly Haven:** https://polyhaven.com/models
- **TurboSquid Free:** https://www.turbosquid.com/Search/3D-Models/free

## How They're Used

These models are referenced in:
- `src/data/ProductData.js` (main product data)
- `src/components/Model3D.tsx` (3D viewer component)
- `src/pages/ProductDetailsPage.tsx` (product details view)

## File Size Recommendation

- Keep each model < 5-10 MB
- Models will be loaded directly from `public/models/`
- Netlify will serve them as-is (no optimization)

## After Adding Files

1. Run `npm run build`
2. Check that files appear in `dist/models/`
3. Commit: `git add public/models/`
4. Push: `git push origin main`
5. Netlify auto-deploys
