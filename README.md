# Lucky Shaker — Digital Product Experience & Media Assets

Commercial product repository for **Lucky Shaker Mobile Bartending Service** and signature bottled cocktails, featuring the **Whiskey Cream by Katherin** 3D interactive Shopify scroll-driven experience and web production videos.

---

## 📁 Repository Structure

```
├── assets/                     # 3D GLB Model & Master PBR Textures
│   ├── lucky_shaker_whiskey_cream.glb   # Production 3D asset for WebGL / Shopify
│   ├── whiskey_cream_label_original.jpg # Original immutable label artwork
│   ├── lucky_shaker_logo_original.png   # Official brand logo
│   └── label_* / neck_sleeve_*          # PBR texture maps (diffuse, metallic, roughness, bump)
│
├── viewer/                     # Interactive 3D WebGL / Shopify Scroll Showcase
│   ├── index.html              # Standalone 3D scroll story & 9:16 mobile frame simulator
│   ├── viewer.css              # Bespoke luxury dark theme styling
│   └── viewer.js               # Three.js PBR rendering & scroll-driven camera engine
│
├── renders/                    # High-Resolution Commercial Product Stills
│   ├── lucky_shaker_hero_9_16.png        # 9:16 Hero portrait commercial render
│   ├── lucky_shaker_turntable_105deg.png # 105° turntable rotation angle
│   └── lucky_shaker_macro_pushin.png     # Close-up macro label render
│
├── videos para web/            # Optimized Commercial Web Videos (Desktop & Mobile 9:16)
│   ├── Whiskey Cream/          # Desktop & Mobile video assets
│   ├── Mojito/                 # Desktop & Mobile video assets
│   └── Old Fashioned/          # Desktop & Mobile video assets
│
└── Media/                      # Reference photography and branding artwork
```

---

## 🍸 Products Featured

### 1. Whiskey Cream by Katherin
- **3D Asset**: Full 1:1 physical accuracy reconstruction ($265\text{ mm}$ height, $84\text{ mm}$ diameter, $22\text{ mm}$ solid glass heel).
- **Physical Details**: Original scalloped label badge, gold foil borders, official Lucky Shaker cocktail logo, signature *"By Katherin"* calligraphy, red neck foil capsule, and drooping crimson satin bow.
- **Web Experience**: Scroll-driven storytelling with 9:16 mobile frame simulation, 360° interactive turntable, and 4K snapshot export.

### 2. Ready-to-Serve Cocktails
- **Mojito** (Cinematic desktop & mobile 9:16 web video)
- **Old Fashioned** (Cinematic desktop & mobile 9:16 web video)

---

## 🚀 Running the Interactive 3D Viewer Locally

You can launch the 3D viewer locally using any static HTTP server:

```bash
# Using Python
python -m http.server 3000

# Open in browser:
# http://localhost:3000/viewer/
```
