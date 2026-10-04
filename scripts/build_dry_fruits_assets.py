import os
from PIL import Image

src_dir = r"c:\TRABAJO\Lucky Shaker\Media\paquetes de disecados"
dest_dir = r"c:\TRABAJO\Lucky Shaker\shopify-theme\assets"

mapping = {
    "lemon dry.png": ["pkg-lemon-dry.webp", "can-lemon-dry.webp"],
    "manzana dry.png": ["pkg-manzana-dry.webp", "can-manzana-dry.webp"],
    "naranja dry.png": ["pkg-naranja-dry.webp", "can-naranja-dry.webp"],
    "piña dry.png": ["pkg-pina-dry.webp", "can-pina-dry.webp", "pkg-piña-dry.webp", "can-piña-dry.webp"]
}

for src_fn, dest_list in mapping.items():
    src_fp = os.path.join(src_dir, src_fn)
    if os.path.exists(src_fp):
        im = Image.open(src_fp)
        bbox = im.getbbox()
        cropped = im.crop(bbox)
        w, h = cropped.size
        target_w, target_h = 640, 1040
        scale = min((target_w * 0.90) / w, (target_h * 0.90) / h)
        new_w, new_h = int(w * scale), int(h * scale)
        resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
        paste_x = (target_w - new_w) // 2
        paste_y = (target_h - new_h) // 2
        canvas.paste(resized, (paste_x, paste_y), resized)
        
        for dest_fn in dest_list:
            dest_fp = os.path.join(dest_dir, dest_fn)
            canvas.save(dest_fp, "WEBP", quality=95, method=6)
            print(f"Saved {dest_fn} ({os.path.getsize(dest_fp)} bytes)")

print("Dry fruits packages conversion complete.")
