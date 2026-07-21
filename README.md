# WebAR Controller Evolution Showcase (AR.js)

A WebAR 5-stage evolutionary journey of video game controllers, finishing with a playable GameBoy UI overlaid on the camera feed. This project uses **A-Frame** and **AR.js** for marker-based tracking.

## Setup Hiro Tracking Marker

This project anchors the 3D controller models perfectly perpendicular to a physical PS4 controller by using an AR.js Hiro marker.

1. **Print Marker:** Print out a standard [AR.js Hiro Marker](https://upload.wikimedia.org/wikipedia/commons/4/48/Hiro_marker_ARjs.png).
2. **Attach to Controller:** Tape or place the printed Hiro marker flat onto the touchpad of your physical PS4 controller.
3. **Scan:** Open the application on your phone or laptop and point the camera at the Hiro marker. The models will hover along the Y-axis perpendicular to the marker.

## Adding 3D Models (.glb)

1. Obtain your 3D models in the `.glb` format.
2. Place your models in the `public/models/` directory.
3. Name them exactly as follows:
   - `controller-1.glb`
   - `controller-2.glb`
   - `controller-3.glb`
   - `controller-4.glb`
   - `controller-5.glb`
4. Make sure their scale and positioning look correct over your tracking target by adjusting the `<a-gltf-model>` attributes (`scale` and `position`) inside `index.html`.

## Running Locally

To run the project locally, run:

```bash
npm install
npm run dev
```

*Note: You may need to access via HTTPS or use localhost for the browser to allow camera access for WebAR. If testing on a mobile device on your local network, you must configure Vite to use HTTPS or utilize an HTTPS tunnel like ngrok.*

## Deploying to GitHub Pages

Since this is a Vite project, configure Vite for GitHub Pages deployment:

1. **Update `vite.config.js`:**
   Create a `vite.config.js` file and set the `base` property to your GitHub repository name:
   ```javascript
   import { defineConfig } from 'vite'

   export default defineConfig({
     base: '/your-repo-name/',
   })
   ```

2. **Deploy using GitHub Actions (Recommended):**
   Create a workflow file `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest
       permissions:
         contents: write
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```
