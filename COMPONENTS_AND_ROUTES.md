# DaCubes2 - Components and Routes Summary

A Remix.js portfolio application featuring 3D visuals with React Three Fiber.

---

## Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/routes/_index.tsx` | Home page with animated 3D text and portfolio links |
| `/about` | `app/routes/about.tsx` | Bio page with grid-based cards |
| `/contact` | `app/routes/contact.tsx` | Contact info and social media links |
| `/frontend` | `app/routes/frontend.tsx` | Frontend project portfolio with video demos |
| `/threejs` | `app/routes/threejs.tsx` | Three.js project portfolio with video demos |
| `/videocard` | `app/routes/videocard.tsx` | Dedicated video player page |

---

## Components

### UI Components

| Component | File | Description |
|-----------|------|-------------|
| **Navbar** | `app/components/navbar.tsx` | Scroll-aware navigation header with logo and links |

### 3D/Canvas Components

| Component | File | Description |
|-----------|------|-------------|
| **TextAnimation** | `app/components/TextAnimation.tsx` | Animated 3D text with curve paths and background effects (Neural Network, Particle Flow, Matrix Rain, etc.) |
| **GenericTA** | `app/components/GenericTA.tsx` | Extended 3D scene infrastructure with reusable lighting and effects |
| **DreiNav** | `app/components/DreiNav.tsx` | 3D navigation using interactive text buttons |
| **GridMaze** | `app/components/GridMaze.tsx` | Interactive grid with raycasting and placeable 3D objects |
| **NavigationMaze** | `app/components/navigationMaze.tsx` | Complex 3D maze with ball physics and keyboard navigation |
| **TextAnimation1** | `app/components/TextAnimation1.tsx` | Simplified text animation variant |
| **TextAnimation3** | `app/components/TextAnimation3.tsx` | Alternative text animation styling |
| **BillboardControls** | `app/components/BillboardControls.tsx` | Controls for camera-relative text orientation |

### Experimental/Variant Components

| Component | File | Description |
|-----------|------|-------------|
| **genericsphere-stars** | `app/components/genericsphere-stars.tsx` | Sphere with orbiting elements and star field |
| **three4** | `app/components/three4.tsx` | Three.js scene with multiple 3D objects |
| **vangrid1** | `app/components/vangrid1.tsx` | Vanilla JS grid implementation |
| **VanillaGridMaze** | `app/components/VanillaGridMaze.tsx` | Vanilla JS grid maze |
| **maze1** | `app/components/maze1.tsx` | Primary maze implementation |
| **maze2** | `app/components/maze2.tsx` | Alternative maze implementation |
| **getBgSphere** | `app/components/getBgSphere.js` | Helper for background sphere generation |

---

## Project Structure

```
app/
├── components/          # Reusable React/3D components
├── routes/              # Remix route pages
├── styles/              # CSS files (global.css, navbar.css, etc.)
├── fonts/               # Custom fonts (ChakraPetch, Utopia Serif)
├── root.tsx             # App layout wrapper
└── tailwind.css         # Tailwind styles
```

---

## Tech Stack

- **Remix** - Full-stack React framework
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Three.js helpers
- **Three.js** - 3D graphics library
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety
- **Netlify** - Deployment
